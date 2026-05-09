import { eq } from "drizzle-orm";
import { db } from "../../common/config/db/index.js";
import { sheet } from "../../common/config/db/schema/sheet.js";
import { user } from "../../common/config/db/schema/user.js";
import type { SheetDtoType } from "./dto/sheet.dto.js";

class SheetRepository {
	async findByName(name: string) {
		const result = await db.select().from(sheet).where(eq(sheet.title, name));
		return result;
	}

	async createSheet(data: SheetDtoType, userId: string) {
		const result = await db
			.insert(sheet)
			.values({
				title: data.title,
				description: data.description,
				visibility: data.visibility,
				categories: data.categories,
				created_by: userId,
			})
			.returning();
		return result;
	}

	async getAllPublicSheets() {
		const result = await db
			.select({
				id: sheet.id,
				title: sheet.title,
				description: sheet.description,
				visibility: sheet.visibility,
				categories: sheet.categories,
				creator: {
					id: user.id,
					email: user.email,
					avatar: user.avatar_url,
					name: user.name,
				},
				created_at: sheet.created_at,
				updated_at: sheet.updated_at,
			})
			.from(sheet)
			.leftJoin(user, eq(sheet.created_by, user.id))
			.where(eq(sheet.visibility, "public"));
		return result;
	}

	async getMySheets(userId: string) {
		const result = await db
			.select()
			.from(sheet)
			.where(eq(sheet.created_by, userId));
		return result;
	}
}

export { SheetRepository };
