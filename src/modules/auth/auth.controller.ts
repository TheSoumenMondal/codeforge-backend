import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../common/utils/error/api.error.js";
import type AuthService from "./auth.service.js";
import { signupDto } from "./dto/signup.dto.js";

class AuthController {
	private authService: AuthService;
	constructor(authService: AuthService) {
		this.authService = authService;
	}

	signup = asyncHandler(async (req, res) => {
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

	login = asyncHandler(async (req, res) => {});
}

export default AuthController;
