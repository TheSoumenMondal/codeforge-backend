import { eq, sql } from "drizzle-orm";
import { db } from "../../common/config/db/index.js";
import { article } from "../../common/config/db/schema/article.js";
import { user } from "../../common/config/db/schema/user.js";
import { ArticleDto } from "./dto/article.dto.js";

class ArticleRepository {
	async generateSlugSafe(title: string): Promise<string> {
		const base = title
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");

		for (let i = 0; i < 3; i++) {
			const slug = `${base}-${crypto.randomUUID().slice(0, 6)}`;

			const result = await db
				.select({ id: article.id }) // lighter query
				.from(article)
				.where(eq(article.slug, slug))
				.limit(1);

			if (result.length === 0) return slug;
		}

		throw new Error("Failed to generate unique slug");
	}

	async create(userId: string, data: ArticleDto) {
		const slug = await this.generateSlugSafe(data.title);

		const created = await db
			.insert(article)
			.values({
				title: data.title,
				slug,
				content: data.content,
				excerpt: data.excerpt ?? null,
				cover_image: data.cover_image ?? null,
				author_id: userId,
			})
			.returning();

		if (!created[0]) {
			return null;
		}

		const rows = await db
			.select({
				id: article.id,
				title: article.title,
				slug: article.slug,
				content: article.content,
				excerpt: article.excerpt,
				cover_image: article.cover_image,
				status: article.status,
				views: article.views,
				created_at: article.created_at,
				updated_at: article.updated_at,
				published_at: article.published_at,
				author: {
					id: user.id,
					name: user.name,
					avatar_url: user.avatar_url,
				},
			})
			.from(article)
			.leftJoin(user, eq(article.author_id, user.id))
			.where(eq(article.id, created[0].id))
			.limit(1);

		return rows[0] ?? null;
	}

	async findBySlug(slug: string) {
		const existingSlug = await db
			.select()
			.from(article)
			.where(eq(article.slug, slug))
			.limit(1);
		return existingSlug[0] ?? null;
	}

	async findArticleById(id: string) {
		const articleData = await db
			.select()
			.from(article)
			.where(eq(article.id, id))
			.limit(1);
		return articleData[0] ?? null;
	}

	async getAll() {
		const articles = await db
			.select({
				id: article.id,
				title: article.title,
				slug: article.slug,
				content: article.content,
				excerpt: article.excerpt,
				cover_image: article.cover_image,
				status: article.status,
				views: article.views,
				created_at: article.created_at,
				updated_at: article.updated_at,
				published_at: article.published_at,
				author: {
					id: user.id,
					name: user.name,
					avatar_url: user.avatar_url,
				},
			})
			.from(article)
			.leftJoin(user, eq(article.author_id, user.id));
		return articles;
	}

	async updateArticle(articleId: string, data: ArticleDto) {
		const updated = await db
			.update(article)
			.set({
				title: data.title,
				content: data.content,
				cover_image: data.cover_image,
				updated_at: new Date(),
			})
			.where(eq(article.id, articleId))
			.returning();
		return updated[0] ?? null;
	}

	async deleteArticle(articleId: string) {
		const deleted = await db
			.delete(article)
			.where(eq(article.id, articleId))
			.returning();
		return deleted[0] ?? null;
	}

	async getArticlesByUserId(userId: string) {
		const articles = await db
			.select()
			.from(article)
			.where(eq(article.author_id, userId));
		return articles;
	}

	async getAuthors() {
		return this.getTopAuthors(10);
	}

	async getTopAuthors(limit = 10) {
		const authors = await db
			.select({
				id: user.id,
				name: user.name,
				avatar_url: user.avatar_url,
				article_count: sql<number>`count(${article.id})`,
			})
			.from(user)
			.leftJoin(article, eq(article.author_id, user.id))
			.groupBy(user.id)
			.having(sql`count(${article.id}) > 0`)
			.orderBy(sql`count(${article.id}) desc`)
			.limit(limit);

		return authors.map((a: any) => ({
			id: a.id,
			name: a.name,
			avatar_url: a.avatar_url,
			article_count: Number(a.article_count ?? 0),
		}));
	}
}

export default ArticleRepository;
