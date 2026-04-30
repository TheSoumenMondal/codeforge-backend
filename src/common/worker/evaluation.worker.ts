import { Worker } from "bullmq";
import { logger } from "../config/logger/pino-logger.js";
import { createRedisClient } from "../config/redis.js";
import { QUEUES } from "../constants/queues.js";

const configureEvaluationWorker = async () => {
	const evaluationWorker = new Worker(
		QUEUES.SUBMISSION_QUEUE,
		async (job) => {
			logger.info(
				`Processing job with id ${job.id} to evaluate submission with id ${job.data.submissionId}`,
			);
		},
		{
			connection: createRedisClient(),
		},
	);

	evaluationWorker.on("error", (err) => {
		logger.error(`Evaluation Worker Error ${err}`);
	});

	evaluationWorker.on("completed", (job) => {
		logger.info(
			`Completed job with id ${job.id} for submission with id ${job.data.submissionId}`,
		);
	});

	evaluationWorker.on("failed", (job, err) => {
		logger.error(
			`Evaluation job failed: ${job?.id ?? "unknown"} with error: ${err}`,
		);
	});
};

async function startEvaluationWorker() {
	await configureEvaluationWorker();
}

export { startEvaluationWorker };
