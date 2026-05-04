import type { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "../../common/utils/async-handler.js";
import { ApiError } from "../../common/utils/error/api.error.js";
import type ArticleService from "./articles.services.js";
import { ArticleDto } from "./dto/article.dto.js";

class ArticleController {
	private readonly articleService: ArticleService;
	constructor(articleService: ArticleService) {
		this.articleService = articleService;
	}

	public createArticle: RequestHandler = asyncHandler(async (req, res) => {
		const userId = req.user?.id;
		const incomingData = await ArticleDto.safeParseAsync(req.body);
		if (!incomingData.success) {
			throw ApiError.invalid(
				incomingData.error.issues.map((issue) => issue.message).join(","),
			);
		}

		if (!userId) {
			throw ApiError.unauthorized("You are not authorized");
		}

		const data = await this.articleService.createArticle(
			userId,
			incomingData.data,
		);

		res.status(StatusCodes.CREATED).json({
			success: true,
			message: "Article created successfully",
			data: data,
			error: null,
		});
	});
}

export default ArticleController;
