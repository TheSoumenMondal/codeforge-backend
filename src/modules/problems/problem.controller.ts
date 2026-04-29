import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../common/utils/error/api.error.js";
import type { CodeStubService } from "./code-stub.service.js";
import { CreateCodeStubDto, UpdateCodeStubDto } from "./dto/code-stub.dto.js";
import { ProblemDto, ProblemUpdateDto } from "./dto/problem.dto.js";
import type ProblemService from "./problem.service.js";

class ProblemController {
	private problemService: ProblemService;
	private codeStubService: CodeStubService;
	constructor(
		problemService: ProblemService,
		codeStubService: CodeStubService,
	) {
		this.problemService = problemService;
		this.codeStubService = codeStubService;
	}

	public create = asyncHandler(async (req, res) => {
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

	public getProblemByFilter = asyncHandler(async (req, res) => {
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

	public getById = asyncHandler(async (req, res) => {
		const id = req.params.id;
		if (!id || typeof id !== "string") {
			throw ApiError.invalid("Invalid problem ID");
		}
		const problem = await this.problemService.getById(id);
		res.status(StatusCodes.OK).json({
			success: true,
			message: "Problem retrieved successfully",
			data: problem,
			error: null,
		});
	});

	public update = asyncHandler(async (req, res) => {
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

	public delete = asyncHandler(async (req, res) => {
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

	public toggleLike = asyncHandler(async (req, res) => {
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

	public createCodeStub = asyncHandler(async (req, res) => {
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

	public updateCodeStub = asyncHandler(async (req, res) => {
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
}

export default ProblemController;
