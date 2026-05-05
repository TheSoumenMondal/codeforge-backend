import { ApiError } from "../../common/utils/error/api.error.js";
import { type CreatePostDto, UpdatePostDto } from "./dto/post.dto.js";
import type { PostRepository } from "./post.repository.js";

class PostService {
	private readonly postRepository: PostRepository;
	constructor(postRepository: PostRepository) {
		this.postRepository = postRepository;
	}

	async createPost(userId: string, data: CreatePostDto) {
		const post = await this.postRepository.create(userId, data);
		return post;
	}

	async getAllPosts() {
		const posts = await this.postRepository.getAll();
		return posts;
	}

	async updatePost(userId: string, postId: string, data: UpdatePostDto) {
		const existingPost = await this.postRepository.getById(postId);
		if (!existingPost) {
			throw ApiError.notFound("Post not found.");
		}
		if (existingPost.authorId !== userId) {
			throw ApiError.forbidden("You are not authorized to update this post.");
		}
		const updatedPost = await this.postRepository.updatePost(postId, data);
		return updatedPost;
	}

	async deletePost(userId: string, postId: string) {
		const existingPost = await this.postRepository.getById(postId);
		if (!existingPost) {
			throw ApiError.notFound("Post not found.");
		}
		if (existingPost.authorId !== userId) {
			throw ApiError.forbidden("You are not authorized to delete this post.");
		}
		await this.postRepository.deletePost(postId);
	}
}

export { PostService };
