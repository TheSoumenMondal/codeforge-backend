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

	public getArticleBySlug: RequestHandler = asyncHandler(async (req, res) => {
		const slug = req.params.slug;
		if (!slug || typeof slug !== "string") {
			throw ApiError.invalid("Invalid slug");
		}
		const article = await this.articleService.findArticleBySlug(slug);

		res.status(StatusCodes.OK).json({
			success: true,
			message: "Article fetched successfully",
			data: article,
			error: null,
		});
	});

	public getArticleById: RequestHandler = asyncHandler(async (req, res) => {
		const articleId = req.params.id;
		if (!articleId || typeof articleId !== "string") {
			throw ApiError.invalid("Invalid article id");
		}
		const article = await this.articleService.findArticleById(articleId);

		res.status(StatusCodes.OK).json({
			success: true,
			message: "Article fetched successfully",
			data: article,
			error: null,
		});
	});

	public getAllArticles: RequestHandler = asyncHandler(async (req, res) => {
		const articles = await this.articleService.getAllArticles();
		res.status(StatusCodes.OK).json({
			success: true,
			message: "Articles fetched successfully",
			data: articles,
			error: null,
		});
	});

	public updateArticle: RequestHandler = asyncHandler(async (req, res) => {
		const articleId = req.params.id;
		const userId = req.user?.id;
		const incomingData = await ArticleDto.safeParseAsync(req.body);
		if (!incomingData.success) {
			throw ApiError.invalid(
				incomingData.error.issues.map((issue) => issue.message).join(","),
			);
		}

		if (!articleId || typeof articleId !== "string") {
			throw ApiError.invalid("Invalid article id");
		}

		if (!userId) {
			throw ApiError.unauthorized("You are not authorized");
		}

		const updatedArticle = await this.articleService.updateArticle(
			articleId,
			userId,
			incomingData.data,
		);

		res.status(StatusCodes.OK).json({
			success: true,
			message: "Article updated successfully",
			data: updatedArticle,
			error: null,
		});
	});
}

export default ArticleController;
