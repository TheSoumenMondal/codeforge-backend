import type { RequestHandler } from "express";
import { pinoHttp } from "pino-http";
import { envConfig } from "../server.config.js";
import { logger } from "./pino-logger.js";

const httpLogger: RequestHandler =
	envConfig.NODE_ENV === "development"
		? pinoHttp({
				logger,
			})
		: (_req, _res, next) => {
				next();
			};

export { httpLogger };
