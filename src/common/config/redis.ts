import { Redis } from "ioredis";
import { logger } from "./logger/pino-logger.js";
import { envConfig } from "./server.config.js";

const createRedisClient = () => {
	const client = new Redis(envConfig.REDIS_URL, {
		maxRetriesPerRequest: null,
	});

	client.on("connect", () => {
		logger.info("Connected to redis successfully");
	});

	client.on("error", (err) => {
		logger.error(`Redis connection error, err: ${err.message}`);
	});

	return client;
};

export { createRedisClient };
