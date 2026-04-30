import type { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "../../common/utils/async-handler.js";
import { ApiError } from "../../common/utils/error/api.error.js";
import type AuthService from "./auth.service.js";
import { loginDto } from "./dto/login.dto.js";
import { signupDto } from "./dto/signup.dto.js";

class AuthController {
	private authService: AuthService;
	constructor(authService: AuthService) {
		this.authService = authService;
	}

	signup: RequestHandler = asyncHandler(async (req, res) => {
		const incomingData = req.body;
		const validatedData = await signupDto.safeParseAsync(incomingData);
		if (!validatedData.success) {
			throw ApiError.invalid(
				`Invalid data : ${validatedData.error.issues.map((issue) => issue.message).join(" , ")}`,
			);
		}
		const user = await this.authService.signup(validatedData.data);
		res.status(StatusCodes.CREATED).json({
			success: true,
			message: "User created successfully",
			data: user,
			error: null,
		});
	});

	login: RequestHandler = asyncHandler(async (req, res) => {
		const incomingData = req.body;
		const validatedData = await loginDto.safeParseAsync(incomingData);

		if (!validatedData.success) {
			throw ApiError.invalid(
				`Invalid data : ${validatedData.error.issues.map((issue) => issue.message).join(" , ")}`,
			);
		}

		const loginResult = await this.authService.login(validatedData.data);

		res.status(StatusCodes.OK).json({
			success: true,
			message: "Login successful",
			data: {
				id: loginResult.user.id,
				name: loginResult.user.name,
				email: loginResult.user.email,
				access_token: loginResult.accessToken,
			},
			error: null,
		});
	});
}

export default AuthController;
