import { eq } from "drizzle-orm";
import { db } from "../../common/config/db/index.js";
import { password_account } from "../../common/config/db/schema/auth.js";
import type { PasswordAccountDto } from "./dto/signup.dto.js";

class AuthRepository {
	async createPasswordAccount(data: PasswordAccountDto) {
		const [passwordAccount] = await db
			.insert(password_account)
			.values({
				user_id: data.userId,
				password_hash: data.passwordHash,
			})
			.returning({
				id: password_account.id,
				user_id: password_account.user_id,
			});

		return passwordAccount ?? null;
	}

	async getPasswordAccountByUserId(userId: string) {
		const passwordAccount = await db
			.select()
			.from(password_account)
			.where(eq(password_account.user_id, userId));
		return passwordAccount[0] ?? null;
	}
}

export default AuthRepository;
