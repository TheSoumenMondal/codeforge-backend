import asyncHandler from "express-async-handler";
import { ApiError } from "../../common/utils/error/api.error.js";
import type ProblemService from "./problem.service.js";

class ProblemController {
	private problemService: ProblemService;
	constructor(problemService: ProblemService) {
		this.problemService = problemService;
	}

	public create = asyncHandler(async (req, res) => {
		throw ApiError.notImplemented("Create problem not implemented yet");
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
