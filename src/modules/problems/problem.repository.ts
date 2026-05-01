import { and, eq, sql } from "drizzle-orm";
import { db } from "../../common/config/db/index.js";
import { problemLikes } from "../../common/config/db/schema/like.js";
import {
	code_stub,
	problem,
	test_case,
} from "../../common/config/db/schema/problem.js";
import { user } from "../../common/config/db/schema/user.js";
import type { ProblemDto } from "./dto/problem.dto.js";

class ProblemRepository {
	async findProblemByTitle(title: string) {
		const normalizedTitle = title.toLowerCase().replace(/\s+/g, "");
		const result = await db
			.select()
			.from(problem)
			.where(
				eq(sql`lower(replace(${problem.title}, ' ', ''))`, normalizedTitle),
			);
		return result.length > 0 ? result[0] : null;
	}

	async create(data: ProblemDto, userId: string) {
		const createdProblem = await db
			.insert(problem)
			.values({
				title: data.title,
				description: data.description,
				difficulty: data.difficulty,
				created_by: userId,
			})
			.returning();
		if (!createdProblem[0]) {
			return null;
		}
		return await this.getById(createdProblem[0].id);
	}

	async getProblemsByFilter(difficulty?: string) {
		if (difficulty) {
			return await db
				.select()
				.from(problem)
				.where(
					eq(problem.difficulty, difficulty as "easy" | "medium" | "hard"),
				);
		}
		return await db.select().from(problem);
	}

	async getById(id: string) {
		const result = await db
			.select({
				id: problem.id,
				title: problem.title,
				description: problem.description,
				difficulty: problem.difficulty,
				created_by: problem.created_by,
				created_at: problem.created_at,
				updated_at: problem.updated_at,
				creator: {
					id: user.id,
					name: user.name,
					bio: user.bio,
					email: user.email,
					email_verified: user.email_verified,
					location: user.location,
					avatar_url: user.avatar_url,
					website_url: user.website_url,
					created_at: user.created_at,
					updated_at: user.updated_at,
				},
			})
			.from(problem)
			.leftJoin(user, eq(problem.created_by, user.id))
			.where(eq(problem.id, id))
			.limit(1);

		return result[0] ?? null;
	}

	private async getProblemBundle(id: string, limit?: number) {
		const problemData = await this.getById(id);
		if (!problemData) {
			return null;
		}

		const testCaseRows = await db
			.select()
			.from(test_case)
			.where(eq(test_case.problem_id, id));

		const codeStubs = await db
			.select()
			.from(code_stub)
			.where(eq(code_stub.problem_id, id));

		const testCases = testCaseRows
			.map((r) => ({
				id: r.id,
				input: r.input,
				output: r.expected_output,
				totalExecutionTime: r.total_execution_time,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
			}))
			.slice(0, limit);

		return {
			...problemData,
			code_stubs: codeStubs,
			test_cases: testCases,
		};
	}

	async getByIdWithThreeTestCases(id: string) {
		return this.getProblemBundle(id, 3);
	}

	async getByIdWithAllTestCases(id: string) {
		return this.getProblemBundle(id);
	}

	async update(id: string, data: Partial<ProblemDto>) {
		const updatedProblem = await db
			.update(problem)
			.set({
				title: data.title,
				description: data.description,
				difficulty: data.difficulty,
			})
			.where(eq(problem.id, id))
			.returning();
		if (!updatedProblem[0]) {
			return null;
		}
		return await this.getById(updatedProblem[0].id);
	}

	async delete(id: string) {
		await db.delete(problem).where(eq(problem.id, id));
	}

	async hasUserLikedProblem(userId: string, problemId: string) {
		const result = await db
			.select()
			.from(problemLikes)
			.where(
				and(
					eq(problemLikes.userId, userId),
					eq(problemLikes.problemId, problemId),
				),
			)
			.limit(1);

		return result.length > 0;
	}

	async like(userId: string, id: string) {
		await db.transaction(async (tx) => {
			await tx.select().from(problem).where(eq(problem.id, id)).limit(1);

			await tx.insert(problemLikes).values({
				userId: userId,
				problemId: id,
			});
		});
	}

	async unlike(userId: string, id: string) {
		await db
			.delete(problemLikes)
			.where(
				and(eq(problemLikes.userId, userId), eq(problemLikes.problemId, id)),
			);
	}
}

export default ProblemRepository;
