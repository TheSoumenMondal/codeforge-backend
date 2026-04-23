import { eq } from "drizzle-orm";
import { db } from "../../common/config/db/index.js";
import { user } from "../../common/config/db/schema/user.js";
import type { CreateUserDto } from "./dto/user.dto.js";

class UserRepository {
	async getUserByEmail(email: string) {
		const existingUser = await db
			.select()
			.from(user)
			.where(eq(user.email, email))
			.limit(1);

		return existingUser[0] ?? null;
	}

	async createUser(userData: CreateUserDto) {
		const [newUser] = await db
			.insert(user)
			.values({
				name: userData.name,
				email: userData.email,
			})
			.returning({
				id: user.id,
				email: user.email,
			});

		return newUser ?? null;
	}
}

export default UserRepository;
