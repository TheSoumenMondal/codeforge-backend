import { ApiError } from "../../common/utils/error/api.error.js";
import type { SheetDtoType } from "./dto/sheet.dto.js";
import type { SheetRepository } from "./sheet.repository.js";

class SheetService {
	private readonly sheetRepository: SheetRepository;
	constructor(sheetRepository: SheetRepository) {
		this.sheetRepository = sheetRepository;
	}

	async createSheet(data: SheetDtoType, userId: string) {
		const existingSheet = await this.sheetRepository.findByName(data.title);

		if (existingSheet.length > 0) {
			throw ApiError.conflict("A sheet with this title already exists.");
		}

		if (!userId) {
			throw ApiError.unauthorized("You are not authorized.");
		}
		const result = await this.sheetRepository.createSheet(data, userId);
		return result;
	}

	async getAllPublicSheets() {
		const result = await this.sheetRepository.getAllPublicSheets();
		return result;
	}

	async getMySheets(userId: string) {
		if (!userId) {
			throw ApiError.unauthorized("You are not authorized.");
		}
		const result = await this.sheetRepository.getMySheets(userId);
		return result;
	}
}

export { SheetService };
