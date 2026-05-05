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
}

export default ArticleService;
