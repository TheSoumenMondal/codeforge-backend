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

	private validateInputOutputMatch(input: unknown, output: unknown): void {
		const getItemCount = (data: unknown): number | null => {
			if (Array.isArray(data)) {
				return data.length;
			}
			if (data !== null && typeof data === "object") {
				return Object.keys(data as Record<string, unknown>).length;
			}
			return null;
		};

		const inputCount = getItemCount(input);
		const outputCount = getItemCount(output);

		if (inputCount === null || outputCount === null) {
			return;
		}

		if (inputCount !== outputCount) {
			throw ApiError.invalid(
				`Input and output must have the same number of items. Input has ${inputCount} items, output has ${outputCount} items.`,
			);
		}
	}

	async createTestCase(
		problemId: string,
		testCaseData: CreateTestCaseDtoType,
		userId: string,
	) {
		this.validateInputOutputMatch(testCaseData.input, testCaseData.output);

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

	async updateTestCase(
		problemId: string,
		testCaseData: UpdateTestCaseDtoType,
		userId: string,
	) {
		const problem = await this.problemRepository.getById(problemId);
		if (!problem) {
			throw ApiError.notFound("Problem not found");
		}
		const existingTestCase =
			await this.testCaseRepository.getTestCasesByProblemId(problemId);

		if (!existingTestCase) {
			throw ApiError.notFound("Test case not found for this problem");
		}
		if (problem.created_by !== userId) {
			throw ApiError.forbidden(
				"You are not allowed to update test case for this problem",
			);
		}

		const inputToValidate = testCaseData.input ?? existingTestCase.input;
		const outputToValidate = testCaseData.output ?? existingTestCase.output;

		this.validateInputOutputMatch(inputToValidate, outputToValidate);

		const updatedTestCase = await this.testCaseRepository.update(
			problemId,
			testCaseData,
		);

		return updatedTestCase;
	}

	async getTestCasesByProblemId(problemId: string) {
		const testCases =
			await this.testCaseRepository.getTestCasesByProblemId(problemId);
		if (!testCases) {
			throw ApiError.notFound("Test cases not found for this problem");
		}
		return testCases;
	}
}

export { TestCaseService };
