import { eq } from "drizzle-orm";
import { db } from "../../common/config/db/index.js";
import { test_case } from "../../common/config/db/schema/problem.js";
import type {
	CreateTestCaseDtoType,
	UpdateTestCaseDtoType,
} from "./dto/test-case.dto.js";

class TestCaseRepository {
	async getTestCasesByProblemId(problemId: string) {
		const testCases = await db
			.select()
			.from(test_case)
			.where(eq(test_case.problem_id, problemId));
		return testCases;
	}

	async create(problemId: string, data: CreateTestCaseDtoType) {
		const testCase = await db
			.insert(test_case)
			.values({
				problem_id: problemId,
				input: data.input,
				expected_output: data.output,
				total_execution_time: data.totalExecutionTime,
			})
			.returning();
		return testCase[0] ?? null;
	}

	async getById(testCaseId: string) {
		const rows = await db
			.select()
			.from(test_case)
			.where(eq(test_case.id, testCaseId))
			.limit(1);
		return rows[0] ?? null;
	}

	async update(testCaseId: string, data: UpdateTestCaseDtoType) {
		const updated = await db
			.update(test_case)
			.set({
				input: data.input,
				expected_output: data.output,
				total_execution_time: data.totalExecutionTime,
			})
			.where(eq(test_case.id, testCaseId))
			.returning();

		return updated[0] ?? null;
	}

	async delete(testCaseId: string) {
		await db.delete(test_case).where(eq(test_case.id, testCaseId));
	}
}

export { TestCaseRepository };
