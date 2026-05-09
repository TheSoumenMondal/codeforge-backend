import { ApiError } from "../../common/utils/error/api.error.js";
import type ArticleRepository from "./articles.repository.js";
import { ArticleDto } from "./dto/article.dto.js";

class ArticleService {
	private readonly articleRepository: ArticleRepository;
	constructor(articleRepository: ArticleRepository) {
		this.articleRepository = articleRepository;
	}

	async createArticle(userId: string, data: ArticleDto) {
		return this.articleRepository.create(userId, data);
	}

	async findArticleBySlug(slug: string) {
		const article = await this.articleRepository.findBySlug(slug);
		if (!article) {
			throw ApiError.notFound("Article not found");
		}
		return article;
	}

	async findArticleById(id: string) {
		const article = await this.articleRepository.findArticleById(id);
		if (!article) {
			throw ApiError.notFound("Article not found");
		}
		return article;
	}

	async getAllArticles() {
		return this.articleRepository.getAll();
	}

	async updateArticle(articleId: string, userId: string, data: ArticleDto) {
		const article = await this.articleRepository.findArticleById(articleId);
		if (!article) {
			throw ApiError.notFound("Article not found");
		}

		if (article.author_id !== userId) {
			throw ApiError.unauthorized(
				"You are not authorized to update this article",
			);
		}

		return this.articleRepository.updateArticle(articleId, data);
	}

	async deleteArticle(articleId: string, userId: string) {
		const article = await this.articleRepository.findArticleById(articleId);
		if (!article) {
			throw ApiError.notFound("Article not found");
		}

		if (article.author_id !== userId) {
			throw ApiError.unauthorized(
				"You are not authorized to delete this article",
			);
		}

		return this.articleRepository.deleteArticle(articleId);
	}

	async getArticlesByUserId(userId: string) {
		return this.articleRepository.getArticlesByUserId(userId);
	}

	async getAuthors() {
		return this.articleRepository.getAuthors();
	}
}

export default ArticleService;
