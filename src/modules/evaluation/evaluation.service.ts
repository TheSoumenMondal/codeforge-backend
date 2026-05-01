import { ApiError } from "../../common/utils/error/api.error.js";
import type { EvaluationRepository } from "./evaluation.repository.js";

class EvaluationService {
	private readonly evaluationRepository: EvaluationRepository;
	constructor(evaluationRepository: EvaluationRepository) {
		this.evaluationRepository = evaluationRepository;
	}

	async getRequiredDataForEvaluation(submissionId: string) {
		if (!submissionId) {
			throw ApiError.notFound("Submission ID is required");
		}

		const data =
			await this.evaluationRepository.getRequiredDataForEvaluation(
				submissionId,
			);

		if (!data) {
			throw ApiError.notFound(
				`No data found for submission ID ${submissionId}`,
			);
		}

		if (data.testCases.length === 0) {
			throw ApiError.invalid(
				`Problem has no test cases configured for submission ID ${submissionId}`,
			);
		}

		return data;
	}
}

export { EvaluationService };
