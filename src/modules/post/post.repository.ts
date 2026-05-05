import { eq } from "drizzle-orm";
import { db } from "../../common/config/db/index.js";
import { post } from "../../common/config/db/schema/post.js";
import { user } from "../../common/config/db/schema/user.js";
import { type CreatePostDto } from "./dto/post.dto.js";

class PostRepository {
	async create(userId: string, data: CreatePostDto) {
		const newPost = await db
			.insert(post)
			.values({
				authorId: userId,
				title: data.title,
				content: data.content,
				images: data.images,
				tags: data.tags,
			})
			.returning();

		return newPost;
	}

	async getAll() {
		const posts = await db
			.select({
				id: post.id,
				title: post.title,
				content: post.content,
				images: post.images,
				tags: post.tags,
				createdAt: post.createdAt,
				updatedAt: post.updatedAt,
				userId: user.id,
				userName: user.name,
				userProfileImage: user.avatar_url,
			})
			.from(post)
			.leftJoin(user, eq(user.id, post.authorId));

		return posts;
	}
}

export { PostRepository };
