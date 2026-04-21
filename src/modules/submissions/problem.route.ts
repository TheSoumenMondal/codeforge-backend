import express from "express";
import { basePingController } from "../../common/helpers/ping.request.js";

const submissionRouter = express.Router();
submissionRouter.get(
	"/submission/ping",
	basePingController({
		serviceName: "Submission Service",
	}),
);

export { submissionRouter };
