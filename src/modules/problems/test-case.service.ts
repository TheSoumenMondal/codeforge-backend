import { ApiError } from "../../common/utils/error/api.error.js";
import type { CreateTestCaseDtoType } from "./dto/test-case.dto.js";
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

		const alreadyExistingTestCase =
			await this.testCaseRepository.getTestCasesByProblemId(problemId);

		if (alreadyExistingTestCase) {
			throw ApiError.conflict("Test case already exists for this problem");
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
}

export { TestCaseService };
