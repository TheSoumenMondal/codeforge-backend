import express from "express";
import { httpLogger } from "./common/config/logger/pino-http-logger.js";
import { envConfig } from "./common/config/server.config.js";
import { basePingController } from "./common/helpers/ping.request.js";
import { errorHandler } from "./common/utils/error/error-handler.js";
import { authRouter } from "./modules/auth/auth.route.js";
import { problemRouter } from "./modules/problems/problem.route.js";
import { submissionRouter } from "./modules/submissions/problem.route.js";
import { userRouter } from "./modules/users/problem.route.js";

class ExpressApp {
	private app: express.Application;
	constructor() {
		this.app = express();
		this.configureMiddlewares();
		this.configureRoutes();
		this.configureErrorHandler();
	}

	public getApp(): express.Application {
		return this.app;
	}

	private configureMiddlewares(): void {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(express.text());
		this.app.use(httpLogger);
	}

	private configureRoutes(): void {
		this.app.get(
			"/ping",
			basePingController({
				serviceName: "CodeForge Backend",
			}),
		);

		this.app.use(envConfig.API_VERSION_PREFIX, authRouter);
		this.app.use(envConfig.API_VERSION_PREFIX, problemRouter);
		this.app.use(envConfig.API_VERSION_PREFIX, submissionRouter);
		this.app.use(envConfig.API_VERSION_PREFIX, userRouter);
	}

	private configureErrorHandler(): void {
		this.app.use(errorHandler);
	}
}

export { ExpressApp };
