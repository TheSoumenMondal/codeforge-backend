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
}

export default ArticleService;
