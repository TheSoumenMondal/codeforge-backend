import { eq } from "drizzle-orm";
import { db } from "../../common/config/db/index.js";
import { sheet } from "../../common/config/db/schema/sheet.js";
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
}

export { SheetRepository };
