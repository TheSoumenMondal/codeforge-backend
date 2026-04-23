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
}

export default AuthRepository;
