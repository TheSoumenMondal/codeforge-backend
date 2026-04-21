import http from "node:http";
import { ExpressApp } from "./app.js";
import { logger } from "./common/config/logger/pino-logger.js";
import { envConfig } from "./common/config/server.config.js";

function main() {
	const app = new ExpressApp().getApp();
	const port = +envConfig.PORT;
	const server = http.createServer(app);
	server.listen(port, () => {
		logger.info({
			message: `Server is running on port ${port}`,
			port: port,
		});
	});
}

main();
