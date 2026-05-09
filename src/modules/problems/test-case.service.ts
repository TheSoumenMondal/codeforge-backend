import { ApiError } from "../../common/utils/error/api.error.js";
import type {
	CreateTestCaseDtoType,
	UpdateTestCaseDtoType,
} from "./dto/test-case.dto.js";
import type ProblemRepository from "./problem.repository.js";
import type { TestCaseRepository } from "./test-case.repository.js";

class TestCaseService {
	private readonly testCaseRepository: TestCaseRepository;
	private readonly problemRepository: ProblemRepository;
	constructor(
		testCaseRepository: TestCaseRepository,
		problemRepository: ProblemRepository,
	) {
		this.testCaseRepository = testCaseRepository;
		this.problemRepository = problemRepository;
	}

	async createTestCase(
		problemId: string,
		testCaseData: CreateTestCaseDtoType,
		userId: string,
	) {
		const problem = await this.problemRepository.getById(problemId);
		if (!problem) {
			throw ApiError.notFound("Problem not found");
		}

		if (problem.created_by !== userId) {
			throw ApiError.forbidden(
				"You are not allowed to create test case for this problem",
			);
		}

		const testCase = await this.testCaseRepository.create(
			problemId,
			testCaseData,
		);

		return testCase;
	}

	async updateTestCase(
		problemId: string,
		testCaseData: UpdateTestCaseDtoType,
		userId: string,
	) {
		const problem = await this.problemRepository.getById(problemId);
		if (!problem) {
			throw ApiError.notFound("Problem not found");
		}

		if (problem.created_by !== userId) {
			throw ApiError.forbidden(
				"You are not allowed to update test case for this problem",
			);
		}

		const testCaseId = testCaseData.testCaseId;
		if (!testCaseId) {
			throw ApiError.invalid("testCaseId is required for update");
		}

		const existingTestCase = await this.testCaseRepository.getById(testCaseId);
		if (!existingTestCase) {
			throw ApiError.notFound("Test case not found");
		}

		const updatedTestCase = await this.testCaseRepository.update(
			testCaseId,
			testCaseData,
		);

		return updatedTestCase;
	}

	async getTestCasesByProblemId(problemId: string) {
		const testCases =
			await this.testCaseRepository.getTestCasesByProblemId(problemId);
		if (!testCases || testCases.length === 0) {
			throw ApiError.notFound("Test cases not found for this problem");
		}

		// map DB rows to api shape (input, output)
		return testCases.map((r) => ({
			id: r.id,
			input: r.input,
			output: r.expected_output,
			totalExecutionTime: r.total_execution_time,
			createdAt: r.created_at,
			updatedAt: r.updated_at,
		}));
	}

	async getPublicTestCasesByProblemId(problemId: string) {
		const testCases =
			await this.testCaseRepository.getTestCasesByProblemId(problemId);
		if (!testCases || testCases.length === 0) {
			throw ApiError.notFound("Test cases not found for this problem");
		}

		return testCases
			.slice(0, 3)
			.map((r) => ({ input: r.input, output: r.expected_output }));
	}

	async deleteTestCase(problemId: string, testCaseId: string, userId: string) {
		const problem = await this.problemRepository.getById(problemId);
		if (!problem) {
			throw ApiError.notFound("Problem not found");
		}

		if (problem.created_by !== userId) {
			throw ApiError.forbidden(
				"You are not allowed to delete test case for this problem",
			);
		}

		const existingTestCase = await this.testCaseRepository.getById(testCaseId);
		if (!existingTestCase) {
			throw ApiError.notFound("Test case not found for this problem");
		}

		await this.testCaseRepository.delete(testCaseId);
	}
}

export { TestCaseService };
