import { Redis } from "ioredis";
import { envConfig } from "./server.config.js";

const redis = new Redis({
	host: envConfig.REDIS_HOST,
	port: parseInt(envConfig.REDIS_PORT, 10),
	maxRetriesPerRequest: null,
});

export { redis };
