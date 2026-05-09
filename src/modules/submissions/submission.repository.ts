import { eq } from "drizzle-orm";
import { db } from "../../common/config/db/index.js";
import { code_submission } from "../../common/config/db/schema/submission.js";
import { SUBMISSION_STATUS } from "../../common/constants/submission-status.js";
import type { SubmissionDTOType } from "./dto/submission.dto.js";

class SubmissionRepository {
	async createSubmission(
		userId: string,
		problemId: string,
		data: SubmissionDTOType,
	) {
		const submission = await db
			.insert(code_submission)
			.values({
				user_id: userId,
				problem_id: problemId,
				code: data.code,
				language: data.language,
				status: SUBMISSION_STATUS.PENDING,
			})
			.returning();
		return submission[0] ?? null;
	}

	async getSubmissionById(submissionId: string) {
		const submission = await db
			.select()
			.from(code_submission)
			.where(eq(code_submission.id, submissionId))
			.execute();
		return submission[0] ?? null;
	}
}

export { SubmissionRepository };
