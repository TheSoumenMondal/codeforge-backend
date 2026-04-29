import { eq, sql } from "drizzle-orm";
import { db } from "../../common/config/db/index.js";
import { problem } from "../../common/config/db/schema/problem.js";
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
		return createdProblem[0];
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
}

export default ProblemRepository;
