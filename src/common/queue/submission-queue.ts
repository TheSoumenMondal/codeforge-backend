import { Queue } from "bullmq";
import { logger } from "../config/logger/pino-logger.js";
import { createRedisClient } from "../config/redis.js";
import { QUEUES } from "../constants/queues.js";

const submissionQueue = new Queue(QUEUES.SUBMISSION_QUEUE, {
	connection: createRedisClient(),
	defaultJobOptions: {
		attempts: 3,
		backoff: {
			type: "exponential",
			delay: 2000,
		},
	},
});

submissionQueue.on("error", (err) => {
	logger.error(`Submission queue error : ${err}`);
});

submissionQueue.on("waiting", (job) => {
	logger.info(
		`Job with id ${job.id} is waiting to be processed in submission queue`,
	);
});

export { submissionQueue };
