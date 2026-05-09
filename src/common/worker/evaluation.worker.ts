import { Worker } from "bullmq";
import { EvaluationRepository } from "../../modules/evaluation/evaluation.repository.js";
import { EvaluationService } from "../../modules/evaluation/evaluation.service.js";
import { logger } from "../config/logger/pino-logger.js";
import { createRedisClient } from "../config/redis.js";
import { JOB_NAME } from "../constants/job.js";
import { QUEUES } from "../constants/queues.js";
import { SUBMISSION_STATUS } from "../constants/submission-status.js";
import createExecutor from "../utils/executor-factory.js";

const configureEvaluationWorker = async () => {
	const evaluationWorker = new Worker(
		QUEUES.SUBMISSION_QUEUE,
		async (job) => {
			if (job.name === JOB_NAME.EVALUATE_SUBMISSION) {
				logger.info(
					`Processing job with id ${job.id} to evaluate submission with id ${job.data.submissionId}`,
				);

				// Gather data required for evaluation
				const evaluationRepository = new EvaluationRepository();
				const evaluationService = new EvaluationService(evaluationRepository);
				const data = await evaluationService.getRequiredDataForEvaluation(
					job.data.submissionId,
				);
				logger.info(data);

				logger.info(
					"Starting evaluation for submission with id " + job.data.submissionId,
				);

				// evaluate into the docker container
				const executor = createExecutor(data.language);
				if (!executor) {
					throw new Error(`Unsupported language: ${data.language}`);
				}

				const testCases = data.testCases.map((tc) => ({
					input_test_case: tc.input,
					expected_output_test_case: tc.output,
				}));

				const result = await executor.executeCode(data.code, testCases);
				logger.info(
					`Evaluation result for submission with id ${job.data.submissionId}: ${JSON.stringify(result)}`,
				);

				let dbStatus = SUBMISSION_STATUS.RUNTIME_ERROR;
				if (result.status === "SUCCESS") {
					dbStatus = SUBMISSION_STATUS.ACCEPTED;
				} else if (result.status === "FAILED") {
					dbStatus = SUBMISSION_STATUS.WRONG_ANSWER;
				} else if (result.status === "COMPILE_ERROR") {
					dbStatus = SUBMISSION_STATUS.RUNTIME_ERROR;
				} else if (result.status === "TIME_LIMIT_EXCEEDED") {
					dbStatus = SUBMISSION_STATUS.TIME_LIMIT_EXCEED;
				}

				await evaluationService.updateEvaluationResult(
					job.data.submissionId,
					dbStatus,
					result.output,
				);
			} else {
				logger.warn(
					`Received job with unknown name ${job.name} and id ${job.id}`,
				);
			}
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
