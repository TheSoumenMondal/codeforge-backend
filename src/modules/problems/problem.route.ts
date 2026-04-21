import express from "express";
import { basePingController } from "../../common/helpers/ping.request.js";

const problemRouter = express.Router();
problemRouter.get(
	"/problem/ping",
	basePingController({
		serviceName: "Problem Service",
	}),
);

export { problemRouter };
