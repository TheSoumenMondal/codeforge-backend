import express from "express";
import { basePingController } from "../../common/helpers/ping.request.js";

const userRouter = express.Router();
userRouter.get(
	"/user/ping",
	basePingController({
		serviceName: "User Service",
	}),
);

export { userRouter };
