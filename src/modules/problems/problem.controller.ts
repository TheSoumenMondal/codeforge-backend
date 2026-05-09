import type { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "../../common/utils/async-handler.js";
import { ApiError } from "../../common/utils/error/api.error.js";
import type { CodeStubService } from "./code-stub.service.js";
import { CreateCodeStubDto, UpdateCodeStubDto } from "./dto/code-stub.dto.js";
import { ProblemDto, ProblemUpdateDto } from "./dto/problem.dto.js";
import { CreateTestCaseDto, UpdateTestCaseDto } from "./dto/test-case.dto.js";
import type ProblemService from "./problem.service.js";
import type { TestCaseService } from "./test-case.service.js";

class ProblemController {
	private problemService: ProblemService;
	private codeStubService: CodeStubService;
	private testCaseService: TestCaseService;
	constructor(
		problemService: ProblemService,
		codeStubService: CodeStubService,
		testCaseService: TestCaseService,
	) {
		this.problemService = problemService;
		this.codeStubService = codeStubService;
		this.testCaseService = testCaseService;
	}

	public create: RequestHandler = asyncHandler(async (req, res) => {
		const incomingData = await ProblemDto.safeParseAsync(req.body);
		if (!incomingData.success) {
			throw ApiError.invalid(
				`Invalid data : ${incomingData.error?.issues.map((issue) => issue.message).join(", ")}`,
			);
		}

		const userId = req.user?.id;

		if (!userId) {
			throw ApiError.unauthorized("User not authenticated");
		}

		const problem = await this.problemService.create(incomingData.data, userId);

		res.status(StatusCodes.CREATED).json({
			success: true,
			message: "Problem created successfully",
			data: problem,
			error: null,
		});
	});

	public getProblemByFilter: RequestHandler = asyncHandler(async (req, res) => {
		const { difficulty } = req.query;

		const problems = await this.problemService.getProblemsByFilter(
			difficulty as string | undefined,
		);

		res.status(StatusCodes.OK).json({
			success: true,
			message: "Problems retrieved successfully",
			data: problems,
			error: null,
		});
	});

	public getById: RequestHandler = asyncHandler(async (req, res) => {
		const id = req.params.id;
		if (!id || typeof id !== "string") {
			throw ApiError.invalid("Invalid problem ID");
		}

		const variant = req.query.variant;
		if (typeof variant === "string" && !["three", "all"].includes(variant)) {
			throw ApiError.invalid("Invalid variant. Use three or all.");
		}

		const problem =
			typeof variant === "string" && variant === "all"
				? await this.problemService.getByIdWithAllTestCases(id)
				: await this.problemService.getByIdWithThreeTestCases(id);
		res.status(StatusCodes.OK).json({
			success: true,
			message: "Problem retrieved successfully",
			data: problem,
			error: null,
		});
	});

	public update: RequestHandler = asyncHandler(async (req, res) => {
		const userId = req.user?.id;
		if (!userId) {
			throw ApiError.unauthorized("User not authenticated");
		}

		const incomingData = await ProblemUpdateDto.safeParseAsync(req.body);

		if (!incomingData.success) {
			throw ApiError.invalid(
				`Invalid data : ${incomingData.error?.issues.map((issue) => issue.message).join(", ")}`,
			);
		}

		const problemId = req.params.id;
		if (!problemId || typeof problemId !== "string") {
			throw ApiError.invalid("Invalid problem ID");
		}

		const updatedProblem = await this.problemService.update(
			userId,
			problemId,
			incomingData.data,
		);
		res.status(StatusCodes.OK).json({
			success: true,
			message: "Problem updated successfully",
			data: updatedProblem,
			error: null,
		});
	});

	public delete: RequestHandler = asyncHandler(async (req, res) => {
		const userId = req.user?.id;
		if (!userId) {
			throw ApiError.unauthorized("User not authenticated");
		}

		const problemId = req.params.id;
		if (!problemId || typeof problemId !== "string") {
			throw ApiError.invalid("Invalid problem ID");
		}

		await this.problemService.delete(userId, problemId);
		res.status(StatusCodes.OK).json({
			success: true,
			message: "Problem deleted successfully",
			data: null,
			error: null,
		});
	});

	public toggleLike: RequestHandler = asyncHandler(async (req, res) => {
		const userId = req.user?.id;
		if (!userId) {
			throw ApiError.unauthorized("User not authenticated");
		}

		const problemId = req.params.id;
		if (!problemId || typeof problemId !== "string") {
			throw ApiError.invalid("Invalid problem ID");
		}

		await this.problemService.toggleLike(userId, problemId);
		res.status(StatusCodes.OK).json({
			success: true,
			message: "Problem like status updated successfully",
			data: null,
			error: null,
		});
	});

	public createCodeStub: RequestHandler = asyncHandler(async (req, res) => {
		const userId = req.user?.id;
		if (!userId) {
			throw ApiError.unauthorized("User not authenticated");
		}

		const incomingData = await CreateCodeStubDto.safeParseAsync(req.body);
		if (!incomingData.success) {
			throw ApiError.invalid(
				`Invalid data : ${incomingData.error?.issues.map((issue) => issue.message).join(", ")}`,
			);
		}

		const codeStub = await this.codeStubService.createCodeStub(
			incomingData.data,
			userId,
		);

		res.status(StatusCodes.CREATED).json({
			success: true,
			message: "Code stub created successfully",
			data: codeStub,
			error: null,
		});
	});

	public updateCodeStub: RequestHandler = asyncHandler(async (req, res) => {
		const userId = req.user?.id;
		if (!userId) {
			throw ApiError.unauthorized("User not authenticated");
		}

		const problemId = req.params.id;
		if (!problemId || typeof problemId !== "string") {
			throw ApiError.invalid("Invalid problem ID");
		}

		const incomingData = await UpdateCodeStubDto.safeParseAsync(req.body);

		if (!incomingData.success) {
			throw ApiError.invalid(
				`Invalid data : ${incomingData.error?.issues.map((issue) => issue.message).join(", ")}`,
			);
		}

		try {
			const codeStub = await this.codeStubService.updateCodeStub(
				problemId,
				incomingData.data,
				userId,
			);

			res.status(StatusCodes.OK).json({
				success: true,
				message: "Code stub updated successfully",
				data: codeStub,
				error: null,
			});
		} catch (error) {
			console.error("Error updating code stub:", error);
			throw error;
		}
	});

	public deleteCodeStub: RequestHandler = asyncHandler(async (req, res) => {
		const userId = req.user?.id;
		if (!userId) {
			throw ApiError.unauthorized("User not authenticated");
		}

		const codeStubId = req.params.id;
		if (!codeStubId || typeof codeStubId !== "string") {
			throw ApiError.invalid("Invalid code stub ID");
		}

		await this.codeStubService.deleteCodeStub(codeStubId, userId);
		res.status(StatusCodes.OK).json({
			success: true,
			message: "Code stub deleted successfully",
			data: null,
			error: null,
		});
	});

	public getAllCodeStubsByProblemId: RequestHandler = asyncHandler(
		async (req, res) => {
			const problemId = req.params.id;
			if (!problemId || typeof problemId !== "string") {
				throw ApiError.invalid("Invalid problem ID");
			}

			const codeStubs =
				await this.codeStubService.getAllCodeStubsByProblemId(problemId);
			res.status(StatusCodes.OK).json({
				success: true,
				message: "Code stubs retrieved successfully",
				data: codeStubs,
				error: null,
			});
		},
	);

	public getAllCodeStubsByProblemIdFiltered: RequestHandler = asyncHandler(
		async (req, res) => {
			const problemId = req.params.id;
			if (!problemId || typeof problemId !== "string") {
				throw ApiError.invalid("Invalid problem ID");
			}

			const languageParam = req.query.language;
			const allowedLanguages = ["cpp", "java", "python", "js"] as const;
			const language =
				typeof languageParam === "string"
					? languageParam === "javascript"
						? "js"
						: allowedLanguages.includes(
									languageParam as (typeof allowedLanguages)[number],
								)
							? (languageParam as (typeof allowedLanguages)[number])
							: undefined
					: undefined;

			if (typeof languageParam === "string" && language === undefined) {
				throw ApiError.invalid("Invalid language filter");
			}

			const codeStubs = await this.codeStubService.getAllCodeStubsByProblemId(
				problemId,
				language,
			);

			res.status(StatusCodes.OK).json({
				success: true,
				message: "Code stubs retrieved successfully",
				data: codeStubs,
				error: null,
			});
		},
	);

	public createTestCase: RequestHandler = asyncHandler(async (req, res) => {
		const userId = req.user?.id;
		if (!userId) {
			throw ApiError.unauthorized("User not authenticated");
		}
		const problemId = req.params.id;
		if (!problemId || typeof problemId !== "string") {
			throw ApiError.invalid("Invalid problem ID");
		}
		const incomingData = await CreateTestCaseDto.safeParseAsync(req.body);

		if (!incomingData.success) {
			throw ApiError.invalid(
				`Invalid data : ${incomingData.error?.issues.map((issue) => issue.message).join(", ")}`,
			);
		}

		const testCase = await this.testCaseService.createTestCase(
			problemId,
			incomingData.data,
			userId,
		);

		res.status(StatusCodes.CREATED).json({
			success: true,
			message: "Test case created successfully",
			data: testCase,
			error: null,
		});
	});

	public updateTestCase: RequestHandler = asyncHandler(async (req, res) => {
		const userId = req.user?.id;
		if (!userId) {
			throw ApiError.unauthorized("User not authenticated");
		}

		const problemId = req.params.id;
		if (!problemId || typeof problemId !== "string") {
			throw ApiError.invalid("Invalid problem ID");
		}

		const incomingData = await UpdateTestCaseDto.safeParseAsync(req.body);

		if (!incomingData.success) {
			throw ApiError.invalid(
				`Invalid data : ${incomingData.error?.issues.map((issue) => issue.message).join(", ")}`,
			);
		}

		const testCase = await this.testCaseService.updateTestCase(
			problemId,
			incomingData.data,
			userId,
		);

		res.status(StatusCodes.OK).json({
			success: true,
			message: "Test case updated successfully",
			data: testCase,
			error: null,
		});
	});

	public getAllTestCasesByProblemId: RequestHandler = asyncHandler(
		async (req, res) => {
			const problemId = req.params.id;
			if (!problemId || typeof problemId !== "string") {
				throw ApiError.invalid("Invalid problem ID");
			}
			const testCases =
				await this.testCaseService.getTestCasesByProblemId(problemId);
			res.status(StatusCodes.OK).json({
				success: true,
				message: "Test cases retrieved successfully",
				data: testCases,
				error: null,
			});
		},
	);

	public getPublicTestCasesByProblemId: RequestHandler = asyncHandler(
		async (req, res) => {
			const problemId = req.params.id;
			if (!problemId || typeof problemId !== "string") {
				throw ApiError.invalid("Invalid problem ID");
			}
			const testCases =
				await this.testCaseService.getPublicTestCasesByProblemId(problemId);
			res.status(StatusCodes.OK).json({
				success: true,
				message: "Public test cases retrieved successfully",
				data: testCases,
				error: null,
			});
		},
	);

	public deleteTestCase: RequestHandler = asyncHandler(async (req, res) => {
		const userId = req.user?.id;
		if (!userId) {
			throw ApiError.unauthorized("User not authenticated");
		}

		const problemId = req.params.id;
		if (!problemId || typeof problemId !== "string") {
			throw ApiError.invalid("Invalid problem ID");
		}
		const { testCaseId } = req.body;
		if (!testCaseId || typeof testCaseId !== "string") {
			throw ApiError.invalid("testCaseId is required to delete a test case");
		}
		await this.testCaseService.deleteTestCase(problemId, testCaseId, userId);
		res.status(StatusCodes.OK).json({
			success: true,
			message: "Test case deleted successfully",
			data: null,
			error: null,
		});
	});
}

export default ProblemController;
