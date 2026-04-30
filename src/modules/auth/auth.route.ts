import express from "express";
import { basePingController } from "../../common/helpers/ping.request.js";
import UserRepository from "../users/user.repository.js";
import AuthController from "./auth.controller.js";
import AuthRepository from "./auth.repository.js";
import AuthService from "./auth.service.js";

const authRepository = new AuthRepository();
const userRepository = new UserRepository();
const authService = new AuthService(authRepository, userRepository);
const authController = new AuthController(authService);

const authRouter: express.Router = express.Router();

authRouter.get(
	"/auth/ping",
	basePingController({
		serviceName: "Auth Service",
	}),
);

authRouter.post("/auth/signup", authController.signup.bind(authController));
authRouter.post("/auth/login", authController.login.bind(authController));

export { authRouter };
