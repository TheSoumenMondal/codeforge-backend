import { eq, sql } from "drizzle-orm";
import { db } from "../../common/config/db/index.js";
import { problem } from "../../common/config/db/schema/problem.js";
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
				like_count: problem.like_count,
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
}

export default ProblemRepository;
