import type { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "../../common/utils/async-handler.js";
import { ApiError } from "../../common/utils/error/api.error.js";
import { SheetDto } from "./dto/sheet.dto.js";
import type { SheetService } from "./sheet.service.js";

class SheetController {
	private readonly sheetService: SheetService;
	constructor(sheetService: SheetService) {
		this.sheetService = sheetService;
	}

	public createSheet: RequestHandler = asyncHandler(async (req, res) => {
		const userId = req.user?.id;

		if (!userId) {
			throw ApiError.unauthorized("You are not authorized");
		}
		const incomingData = await SheetDto.safeParseAsync(req.body);

		if (!incomingData.success) {
			throw ApiError.badRequest(
				`Invalid data: ${incomingData.error.issues
					.map((issue) => `${issue.path.join(".")}: ${issue.message}`)
					.join(", ")}`,
			);
		}

		const result = await this.sheetService.createSheet(
			incomingData.data,
			userId,
		);

		res.status(StatusCodes.CREATED).json({
			success: true,
			message: "Sheet created successfully",
			data: result,
			error: null,
		});
	});

	public getAllPublicSheets: RequestHandler = asyncHandler(async (req, res) => {
		const result = await this.sheetService.getAllPublicSheets();
		res.status(StatusCodes.OK).json({
			success: true,
			message: "Public sheets retrieved successfully",
			data: result,
			error: null,
		});
	});

	public getMySheets: RequestHandler = asyncHandler(async (req, res) => {
		const userId = req.user?.id;
		if (!userId) {
			throw ApiError.unauthorized("You are not authorized");
		}
		const result = await this.sheetService.getMySheets(userId);
		res.status(StatusCodes.OK).json({
			success: true,
			message: "Your sheets retrieved successfully",
			data: result,
			error: null,
		});
	});
}

export { SheetController };
