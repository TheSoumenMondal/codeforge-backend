import { logger } from "../../common/config/logger/pino-logger.js";
import { addSubmissionJob } from "../../common/producer/submission.producer.js";
import { ApiError } from "../../common/utils/error/api.error.js";
import type { CodeStubRepository } from "../problems/code-stub.repository.js";
import type ProblemRepository from "../problems/problem.repository.js";
import type { SubmissionDTOType } from "./dto/submission.dto.js";
import type { SubmissionRepository } from "./submission.repository.js";

class SubmissionService {
	private readonly submissionRepository: SubmissionRepository;
	private readonly problemRepository: ProblemRepository;
	private readonly codeStubRepository: CodeStubRepository;
	constructor(
		submissionRepository: SubmissionRepository,
		problemRepository: ProblemRepository,
		codeStubRepository: CodeStubRepository,
	) {
		this.submissionRepository = submissionRepository;
		this.problemRepository = problemRepository;
		this.codeStubRepository = codeStubRepository;
	}

	async createSubmission(
		userId: string,
		problemId: string,
		data: SubmissionDTOType,
	) {
		const problemData =
			await this.problemRepository.getByIdWithAllTestCases(problemId);
		if (!problemData) {
			throw ApiError.invalid("Invalid problem id");
		}

		const codeStubs = await this.codeStubRepository.filterCodeStubByLanguage(
			problemId,
			data.language as "cpp" | "java" | "python" | "js",
		);
		const stub = codeStubs[0];

		const fullCode = [stub?.start_code, data.code, stub?.end_code]
			.filter(Boolean)
			.join("\n");

		const submission = await this.submissionRepository.createSubmission(
			userId,
			problemId,
			{ ...data, code: fullCode },
		);

		logger.info(submission);

		const submissionId = submission?.id;

		if (!submissionId) {
			throw ApiError.notFound("Unable to create submission");
		}

		await addSubmissionJob({
			submissionId,
		});

		return submission;
	}

	async getSubmissionById(submissionId: string, userId: string) {
		const submission =
			await this.submissionRepository.getSubmissionById(submissionId);

		if (!submission) {
			throw ApiError.notFound("Submission not found");
		}

		if (submission.user_id !== userId) {
			throw ApiError.unauthorized(
				"User not authorized to view this submission",
			);
		}

		return submission;
	}
}

export { SubmissionService };
