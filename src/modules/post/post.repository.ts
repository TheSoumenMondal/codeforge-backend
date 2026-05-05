import { db } from "../../common/config/db/index.js";
import { post } from "../../common/config/db/schema/post.js";
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
}

export { PostRepository };
