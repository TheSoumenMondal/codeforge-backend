import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../common/utils/error/api.error.js";
import { tokenUtils } from "../../../common/utils/security/token-utils.js";

class AuthMiddleware {
	isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
		try {
			const authHeader = req.headers.authorization;
			if (!authHeader || !authHeader.startsWith("Bearer ")) {
				throw ApiError.unauthorized("You are not authenticated.");
			}

			const token = authHeader.slice(7);
			if (!token) {
				throw ApiError.unauthorized("You are not authenticated.");
			}

			const payload = tokenUtils.verifyToken(token);
			const tokenPayload = this.validateTokenPayload(payload);

			req.user = {
				id: tokenPayload.sub,
				email: tokenPayload.email,
			};

			next();
		} catch (error) {
			next(error);
		}
	};

	private validateTokenPayload(payload: unknown): TokenPayload {
		if (!payload || typeof payload !== "object") {
			throw ApiError.unauthorized("Invalid token payload");
		}

		const token = payload as Record<string, unknown>;

		if (typeof token.sub !== "string" || !token.sub) {
			throw ApiError.unauthorized("Invalid token: missing user ID");
		}

		if (typeof token.email !== "string" || !token.email) {
			throw ApiError.unauthorized("Invalid token: missing email");
		}

		return {
			sub: token.sub,
			email: token.email,
			iat: typeof token.iat === "number" ? token.iat : 0,
			exp: typeof token.exp === "number" ? token.exp : 0,
		};
	}
}

export default AuthMiddleware;
