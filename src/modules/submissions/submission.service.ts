import { addSubmissionJob } from "../../common/producer/submission.producer.js";
import { ApiError } from "../../common/utils/error/api.error.js";
import type ProblemRepository from "../problems/problem.repository.js";
import type { SubmissionDTOType } from "./dto/submission.dto.js";
import type { SubmissionRepository } from "./submission.repository.js";

class SubmissionService {
	private readonly submissionRepository: SubmissionRepository;
	private readonly problemRepository: ProblemRepository;
	constructor(
		submissionRepository: SubmissionRepository,
		problemRepository: ProblemRepository,
	) {
		this.submissionRepository = submissionRepository;
		this.problemRepository = problemRepository;
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

		const submission = await this.submissionRepository.createSubmission(
			userId,
			problemId,
			data,
		);

		const submissionId = submission?.id;

		if (!submissionId) {
			throw ApiError.notFound("Unable to create submission");
		}

		await addSubmissionJob({
			submissionId,
			problemData: {
				id: problemData.id,
				inputTestCases: problemData.test_cases.map((tc) => tc.input),
				outputTestCases: problemData.test_cases.map((tc) => tc.output),
			},
			userId,
			code: data.code,
			language: data.language,
		});

		return submission;
	}
}

export { SubmissionService };
