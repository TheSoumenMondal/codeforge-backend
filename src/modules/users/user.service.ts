import { ApiError } from "../../common/utils/error/api.error.js";
import type { CreateUserDto } from "./dto/user.dto.js";
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
}

export default UserService;
