import http from "node:http";
import { ExpressApp } from "./app.js";
import { logger } from "./common/config/logger/pino-logger.js";
import { envConfig } from "./common/config/server.config.js";
import { startEvaluationWorker } from "./common/worker/evaluation.worker.js";

function main() {
	const app = new ExpressApp().getApp();
	const port = +envConfig.PORT;
	const server = http.createServer(app);
	server.listen(port, async () => {
		logger.info({
			message: `Server is running on port ${port}`,
			port: port,
		});
		await startEvaluationWorker();
	});
}

main();
