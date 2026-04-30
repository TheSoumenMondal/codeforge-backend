import { Queue } from "bullmq";
import { QUEUES } from "../constants/queues.js";

const submissionQueue = new Queue(QUEUES.SUBMISSION_QUEUE, {
	connection: {},
});

export { submissionQueue };
