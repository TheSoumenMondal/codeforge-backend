import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../common/utils/error/api.error.js";
import { ProblemDto } from "./dto/problem.dto.js";
import type ProblemService from "./problem.service.js";

class ProblemController {
	private problemService: ProblemService;
	constructor(problemService: ProblemService) {
		this.problemService = problemService;
	}

	public create = asyncHandler(async (req, res) => {
		const incomingData = await ProblemDto.safeParseAsync(req.body);
		if (!incomingData.success) {
			throw ApiError.invalid(
				`Invalid data : ${(await incomingData).error?.issues.map((issue) => issue.message).join(", ")}`,
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
		throw ApiError.notImplemented("Get problem by filter not implemented yet");
	});

	public getById = asyncHandler(async (req, res) => {
		throw ApiError.notImplemented("Get problem by ID not implemented yet");
	});

	public update = asyncHandler(async (req, res) => {
		throw ApiError.notImplemented("Update problem not implemented yet");
	});

	public delete = asyncHandler(async (req, res) => {
		throw ApiError.notImplemented("Delete problem not implemented yet");
	});
}

export default ProblemController;
