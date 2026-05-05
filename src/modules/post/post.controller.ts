import type { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { imagekitClient } from "../../common/config/imagekit.js";
import asyncHandler from "../../common/utils/async-handler.js";
import { ApiError } from "../../common/utils/error/api.error.js";
import { CreatePostDto, UpdatePostDto } from "./dto/post.dto.js";
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

	public updatePost: RequestHandler = asyncHandler(async (req, res) => {
		const userId = req.user?.id;
		if (!userId) {
			throw ApiError.unauthorized(
				"You are not authorized to perform this action.",
			);
		}

		const postId = req.params.id;

		if (!postId || typeof postId !== "string") {
			throw ApiError.badRequest("Invalid post ID.");
		}

		const incomingData = await UpdatePostDto.safeParseAsync(req.body);
		if (!incomingData.success) {
			throw ApiError.badRequest(`
        ${incomingData.error.issues
					.map((issue) => `${issue.path.join(".")}: ${issue.message}`)
					.join("")}
      `);
		}

		const updatedPost = await this.postService.updatePost(
			userId,
			postId,
			incomingData.data,
		);

		res.status(StatusCodes.OK).json({
			success: true,
			message: "Post updated successfully.",
			data: updatedPost,
			error: null,
		});
	});

	public deletePost: RequestHandler = asyncHandler(async (req, res) => {
		const userId = req.user?.id;
		if (!userId) {
			throw ApiError.unauthorized(
				"You are not authorized to perform this action.",
			);
		}
		const postId = req.params.id;
		if (!postId || typeof postId !== "string") {
			throw ApiError.badRequest("Invalid post ID.");
		}
		await this.postService.deletePost(userId, postId);
		res.status(StatusCodes.OK).json({
			success: true,
			message: "Post deleted successfully.",
			data: null,
			error: null,
		});
	});

	public addMultipleImagesToPost: RequestHandler = asyncHandler(
		async (req, res) => {
			const userId = req.user?.id;
			if (!userId) {
				throw ApiError.unauthorized(
					"You are not authorized to perform this action.",
				);
			}

			const files = (req.files ?? []) as Express.Multer.File[];

			if (!Array.isArray(files) || files.length === 0) {
				throw ApiError.badRequest("No files uploaded.");
			}

			const uploaded: Array<{ fileName: string; url: string }> = [];
			const failed: Array<{ fileName: string; error: string }> = [];

			for (const file of files) {
				const originalName = file.originalname || `upload-${Date.now()}`;
				const fileExtension =
					originalName.split(".").pop()?.toLowerCase() ||
					file.mimetype.split("/")[1]?.toLowerCase();

				const allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif"];

				if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
					failed.push({
						fileName: originalName,
						error: "Invalid file type. Allowed: jpg, jpeg, png, webp, gif",
					});
					continue;
				}

				try {
					const result = await imagekitClient.files.upload({
						file: file.buffer.toString("base64"),
						fileName: `post-${Date.now()}-${originalName}`,
						folder: "/posts",
					});

					const url: string = result?.url || (result as any)?.response?.url;
					if (url) {
						uploaded.push({ fileName: originalName, url });
					} else {
						failed.push({
							fileName: originalName,
							error: "No URL returned from ImageKit",
						});
					}
				} catch (err: any) {
					failed.push({
						fileName: originalName,
						error: err?.message || String(err),
					});
				}
			}

			res.status(StatusCodes.OK).json({
				success: true,
				message: "Files uploaded to ImageKit.",
				data: { uploaded, failed },
				error: null,
			});
		},
	);
}

export { PostController };
