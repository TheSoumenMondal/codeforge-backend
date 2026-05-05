import { eq } from "drizzle-orm";
import { db } from "../../common/config/db/index.js";
import { post } from "../../common/config/db/schema/post.js";
import { user } from "../../common/config/db/schema/user.js";
import { type CreatePostDto, UpdatePostDto } from "./dto/post.dto.js";

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

		return newPost[0];
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

	async getById(postId: string) {
		const postData = await db
			.select()
			.from(post)
			.where(eq(post.id, postId))
			.limit(1);

		return postData.length > 0 ? postData[0] : null;
	}

	async updatePost(postId: string, data: Partial<UpdatePostDto>) {
		const updatedPost = await db
			.update(post)
			.set({
				title: data.title,
				content: data.content,
				images: data.images,
				tags: data.tags,
				updatedAt: new Date(),
			})
			.where(eq(post.id, postId))
			.returning();

		return updatedPost[0];
	}
}

export { PostRepository };
