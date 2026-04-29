declare global {
	interface AuthenticatedUser {
		id: string;
		email: string;
	}

	interface TokenPayload {
		sub: string;
		email: string;
		iat: number;
		exp: number;
	}

	namespace Express {
		interface Request {
			user?: AuthenticatedUser;
		}
	}
}

export {};
