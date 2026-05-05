import { type CreatePostDto } from "./dto/post.dto.js";
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
}

export { PostService };
