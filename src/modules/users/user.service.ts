import { imagekitClient } from "../../common/config/imagekit.js";
import { ApiError } from "../../common/utils/error/api.error.js";
import type { CreateUserDto, UpdateUserDto } from "./dto/user.dto.js";
import type UserRepository from "./user.repository.js";

class UserService {
	private userRepository: UserRepository;

	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}

	async create(userData: CreateUserDto) {
		const existingUser = await this.userRepository.getUserByEmail(
			userData.email,
		);
		if (existingUser) {
			throw ApiError.conflict("User with this email already exists");
		}
		const newUser = await this.userRepository.createUser(userData);
		if (!newUser) {
			throw ApiError.badRequest("Failed to create user");
		}
		return newUser;
	}

	async getProfile(userId: string) {
		const userProfile = await this.userRepository.getUserById(userId);
		if (!userProfile) {
			throw ApiError.notFound("User not found");
		}
		return userProfile;
	}

	async updateProfile(userId: string, updateData: UpdateUserDto) {
		const userProfile = await this.userRepository.getUserById(userId);
		if (!userProfile) {
			throw ApiError.notFound("User not found");
		}
		const updatedUser = await this.userRepository.updateUser(
			userId,
			updateData,
		);
		if (!updatedUser) {
			throw ApiError.badRequest("Failed to update user profile");
		}
		return updatedUser;
	}

	async addAvatar(
		userId: string,
		fileBuffer: Buffer,
		fileName: string,
		mimeType: string,
	) {
		const userProfile = await this.userRepository.getUserById(userId);
		if (!userProfile) {
			throw ApiError.notFound("User not found");
		}

		const fileExtension =
			fileName.split(".").pop()?.toLowerCase() ??
			mimeType.split("/")[1]?.toLowerCase();

		const allowedExtensions = ["jpg", "jpeg", "png", "webp"];

		if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
			throw ApiError.invalid(
				"Invalid file type. Only jpg, jpeg, png, and webp are allowed.",
			);
		}

		try {
			const result = await imagekitClient.files.upload({
				file: fileBuffer.toString("base64"),
				fileName: `avatar-${userId}-${Date.now()}.${fileExtension}`,
				folder: "/avatars",
			});
			const updatedUser = await this.userRepository.updateUser(userId, {
				avatar_url: result.url,
			});

			if (!updatedUser) {
				throw ApiError.badRequest("Failed to update user avatar");
			}

			return updatedUser;
		} catch (error) {
			throw ApiError.badRequest(
				`Failed to upload avatar: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}
}

export default UserService;
