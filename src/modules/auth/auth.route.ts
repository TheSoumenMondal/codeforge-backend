import express from "express";
import { basePingController } from "../../common/helpers/ping.request.js";

const authRouter = express.Router();

authRouter.get(
	"/auth/ping",
	basePingController({
		serviceName: "Auth Service",
	}),
);

export { authRouter };
