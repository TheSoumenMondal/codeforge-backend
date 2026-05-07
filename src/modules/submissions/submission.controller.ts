import type { RequestHandler } from "express";
import asyncHandler from "../../common/utils/async-handler.js";
import { ApiError } from "../../common/utils/error/api.error.js";
import { CreateSubmissionDTO } from "./dto/submission.dto.js";
import type { SubmissionService } from "./submission.service.js";

class SubmissionController {
	private readonly submissionService: SubmissionService;

	constructor(submissionService: SubmissionService) {
		this.submissionService = submissionService;
	}

	public createSubmission: RequestHandler = asyncHandler(async (req, res) => {
		const userid = req.user?.id;
		if (!userid) {
			throw ApiError.unauthorized("User not authenticated");
		}

		const problemId = req.params.problem_id;
		if (!problemId || typeof problemId !== "string") {
			throw ApiError.invalid("Invalid problem ID");
		}

		const incomingData = await CreateSubmissionDTO.safeParseAsync(req.body);

		if (!incomingData.success) {
			throw ApiError.invalid(
				`${incomingData.error.issues.map((issue) => issue.message).join(", ")}`,
			);
		}

		const submissionData = incomingData.data;
		const submission = await this.submissionService.createSubmission(
			userid,
			problemId,
			submissionData,
		);

		res.status(201).json({
			success: true,
			data: submission,
			message: "Submission created successfully",
		});
	});

	public getSubmissionById: RequestHandler = asyncHandler(async (req, res) => {
		const userId = req.user?.id;
		if (!userId) {
			throw ApiError.unauthorized("User not authenticated");
		}

		const submissionId = req.params.id;
		if (!submissionId || typeof submissionId !== "string") {
			throw ApiError.invalid("Invalid submission ID");
		}

		const submission = await this.submissionService.getSubmissionById(
			submissionId,
			userId,
		);
		if (!submission) {
			throw ApiError.notFound("Submission not found");
		}

		res.status(200).json({
			success: true,
			data: submission,
			message: "Submission retrieved successfully",
		});
	});
}

export { SubmissionController };
