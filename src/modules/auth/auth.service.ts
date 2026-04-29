import { ApiError } from "../../common/utils/error/api.error.js";
import { passwordUtils } from "../../common/utils/security/hash-utils.js";
import { tokenUtils } from "../../common/utils/security/token-utils.js";
import type UserRepository from "../users/user.repository.js";
import type AuthRepository from "./auth.repository.js";
import type { LoginDto } from "./dto/login.dto.js";
import type { SignupDto } from "./dto/signup.dto.js";

class AuthService {
	private authRepository: AuthRepository;
	private userRepository: UserRepository;
	constructor(authRepository: AuthRepository, userRepository: UserRepository) {
		this.authRepository = authRepository;
		this.userRepository = userRepository;
	}

	async signup(signupData: SignupDto) {
		const existingUser = await this.userRepository.getUserByEmail(
			signupData.email,
		);

		if (existingUser) {
			throw ApiError.conflict("User with this email already exists");
		}

		const passwordHash = await passwordUtils.hashPassword(signupData.password);
		const createdUser = await this.userRepository.createUser({
			name: signupData.name,
			email: signupData.email,
		});

		if (!createdUser) {
			throw ApiError.badRequest("Failed to create user");
		}

		const passwordAccount = await this.authRepository.createPasswordAccount({
			userId: createdUser.id,
			passwordHash,
		});

		if (!passwordAccount) {
			throw ApiError.badRequest("Failed to create password account");
		}

		const accessToken = tokenUtils.generateToken({
			sub: createdUser.id,
			email: createdUser.email,
		});

		return {
			user: createdUser,
			accessToken,
		};
	}

	async login(data: LoginDto) {
		const { email, password } = data;
		const user = await this.userRepository.getUserByEmail(email);
		if (!user) {
			throw ApiError.notFound(`User not found`);
		}
		const userId = user.id;
		const passwordAccountData =
			await this.authRepository.getPasswordAccountByUserId(userId);
		if (!passwordAccountData) {
			throw ApiError.notFound(`Password account not found for user`);
		}

		const isPasswordValid = await passwordUtils.comparePassword(
			password,
			passwordAccountData.password_hash,
		);

		if (!isPasswordValid) {
			throw ApiError.unauthorized(`Invalid credentials`);
		}

		const accessToken = tokenUtils.generateToken({
			sub: user.id,
			email: user.email,
		});

		return {
			user,
			accessToken,
		};
	}
}

export default AuthService;
