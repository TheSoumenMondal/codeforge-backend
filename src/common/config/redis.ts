import { Redis } from "ioredis";
import { logger } from "./logger/pino-logger.js";
import { envConfig } from "./server.config.js";

const createRedisClient = () => {
	const client = new Redis({
		host: envConfig.REDIS_HOST,
		port: parseInt(envConfig.REDIS_PORT, 10),
		maxRetriesPerRequest: null,
		enableReadyCheck: false,
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
