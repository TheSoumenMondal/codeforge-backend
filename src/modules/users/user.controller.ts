import expressAsyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../common/utils/error/api.error.js";
import { createUserDto } from "./dto/user.dto.js";
import type UserService from "./user.service.js";

class UserController {
	private userService: UserService;

	constructor(userService: UserService) {
		this.userService = userService;
	}

	create = expressAsyncHandler(async (req, res) => {
		const incomingData = req.body;
		const parsedData = await createUserDto.safeParseAsync(incomingData);

		if (!parsedData.success) {
			throw ApiError.invalid(
				`Invalid data : ${parsedData.error.issues
					.map((issue) => `${issue.path.join(".")}: ${issue.message}`)
					.join(", ")}`,
			);
		}

		const createdUser = await this.userService.create(parsedData.data);

		res.status(StatusCodes.CREATED).json({
			success: true,
			data: createdUser,
			message: "User created successfully",
			error: null,
		});
	});
}

export default UserController;
