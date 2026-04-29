import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { envConfig } from "../../config/server.config.js";
import { ApiError } from "../error/api.error.js";

export const tokenUtils = {
	generateToken: (payload: object): string =>
		jwt.sign(payload, envConfig.JWT_SECRET as Secret, {
			expiresIn: envConfig.JWT_EXPIRES_IN as NonNullable<
				SignOptions["expiresIn"]
			>,
			algorithm: "HS256",
		}),

	verifyToken: (token: string) => {
		try {
			return jwt.verify(token, envConfig.JWT_SECRET);
		} catch (error) {
			throw ApiError.invalid("Invalid token");
		}
	},
};
