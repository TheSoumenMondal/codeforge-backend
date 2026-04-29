import express from "express";
import { basePingController } from "../../common/helpers/ping.request.js";
import AuthMiddleware from "../auth/middleware/auth.middleware.js";
import UserController from "./user.controller.js";
import UserRepository from "./user.repository.js";
import UserService from "./user.service.js";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);
const authMiddleware = new AuthMiddleware();

const userRouter = express.Router();
userRouter.get(
	"/user/ping",
	basePingController({
		serviceName: "User Service",
	}),
);

userRouter.post("/user", userController.create.bind(userController));

userRouter.get(
	"/user/profile",
	authMiddleware.isAuthenticated,
	userController.getProfile.bind(userController),
);

userRouter.put(
	"/user/profile",
	authMiddleware.isAuthenticated,
	userController.updateProfile.bind(userController),
);

export { userRouter };
