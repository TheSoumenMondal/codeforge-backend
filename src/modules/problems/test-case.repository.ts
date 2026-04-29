import { eq } from "drizzle-orm";
import { db } from "../../common/config/db/index.js";
import { test_case } from "../../common/config/db/schema/problem.js";
import type { CreateTestCaseDtoType } from "./dto/test-case.dto.js";

class TestCaseRepository {
	async getTestCasesByProblemId(problemId: string) {
		const testCases = await db
			.select()
			.from(test_case)
			.where(eq(test_case.problem_id, problemId));
		return testCases[0] ?? null;
	}

	async create(problemId: string, data: CreateTestCaseDtoType) {
		const testCase = await db
			.insert(test_case)
			.values({
				problem_id: problemId,
				input: data.input,
				output: data.output,
				total_execution_time: data.totalExecutionTime,
			})
			.returning();
		return testCase[0] ?? null;
	}
}

export { TestCaseRepository };
