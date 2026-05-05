import type { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "../../common/utils/async-handler.js";
import { ApiError } from "../../common/utils/error/api.error.js";
import { CreatePostDto } from "./dto/post.dto.js";
import type { PostService } from "./post.service.js";

class PostController {
	private readonly postService: PostService;
	constructor(postService: PostService) {
		this.postService = postService;
	}

	public createPost: RequestHandler = asyncHandler(async (req, res) => {
		const userId = req.user?.id;
		if (!userId) {
			throw ApiError.unauthorized(
				"You are not authorized to perform this action.",
			);
		}

		const incomingData = await CreatePostDto.safeParseAsync(req.body);

		if (!incomingData.success) {
			throw ApiError.badRequest(`
      ${incomingData.error.issues
				.map((issue) => `${issue.path.join(".")}: ${issue.message}`)
				.join("")}
    `);
		}

		const post = await this.postService.createPost(userId, incomingData.data);

		res.status(StatusCodes.CREATED).json({
			success: true,
			message: "Post created successfully.",
			data: post,
			error: null,
		});
	});

	public getAllPosts: RequestHandler = asyncHandler(async (req, res) => {
		const posts = await this.postService.getAllPosts();

		res.status(StatusCodes.OK).json({
			success: true,
			message: "Posts retrieved successfully.",
			data: posts,
			error: null,
		});
	});
}

export { PostController };
