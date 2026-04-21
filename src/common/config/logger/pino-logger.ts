import pino from "pino";
import { envConfig } from "../server.config.js";

const isDevelopment: boolean = envConfig.NODE_ENV === "development";

let loggerInstance: pino.Logger | undefined;

const createLogger = (): pino.Logger => {
	const transport = isDevelopment
		? pino.transport({
				target: "pino-pretty",
				options: {
					colorize: true,
					singleLine: false,
					translateTime: "SYS:standard",
				},
			})
		: undefined;

	return pino(
		{
			level: envConfig.LOGGER_LEVEL,
			base: {
				service: "backend",
			},
			timestamp: pino.stdTimeFunctions.isoTime,
			redact: {
				paths: [
					"req.headers.authorization",
					"req.headers.cookie",
					"password",
					"token",
				],
				censor: "[REDACTED]",
			},
		},
		transport,
	);
};

const getLogger = (): pino.Logger => {
	if (loggerInstance === undefined) {
		loggerInstance = createLogger();
	}

	return loggerInstance;
};

const logger = getLogger();

export { getLogger, logger };
