import { logger } from "../config/logger/pino-logger.js";
import { JOB_NAME } from "../constants/job.js";
import { submissionQueue } from "../queue/submission-queue.js";

export interface SubmissionJobData {
	submissionId: string;
}

async function addSubmissionJob(data: SubmissionJobData) {
	try {
		const job = await submissionQueue.add(JOB_NAME.EVALUATE_SUBMISSION, data);
		logger.info(
			`Added job with id ${job.id} to evaluate submission with id ${data.submissionId}`,
		);
	} catch (error) {
		logger.error(`Error adding submission job: ${error}`);
		return null;
	}
}

export { addSubmissionJob };
