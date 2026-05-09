import express from "express";
import { UploadMilleware } from "../../common/middleware/upload.middleware.js";
import AuthMiddleware from "../auth/middleware/auth.middleware.js";
import { PostController } from "./post.controller.js";
import { PostRepository } from "./post.repository.js";
import { PostService } from "./post.service.js";

const postRepository = new PostRepository();
const postService = new PostService(postRepository);
const postController = new PostController(postService);
const authMiddleware = new AuthMiddleware();

const postRouter: express.Router = express.Router();

const uploadMiddelware = new UploadMilleware(5 * 1024 * 1024); // 5MB per file

postRouter.post(
	"/post",
	authMiddleware.isAuthenticated.bind(authMiddleware),
	postController.createPost.bind(postController),
);

postRouter.get("/post", postController.getAllPosts.bind(postController));

postRouter.put(
	"/post/:id",
	authMiddleware.isAuthenticated.bind(authMiddleware),
	postController.updatePost.bind(postController),
);

postRouter.delete(
	"/post/:id",
	authMiddleware.isAuthenticated.bind(authMiddleware),
	postController.deletePost.bind(postController),
);

postRouter.post(
	"/post/files",
	authMiddleware.isAuthenticated.bind(authMiddleware),
	uploadMiddelware.upload.array("files"),
	postController.addMultipleImagesToPost.bind(postController),
);

export { postRouter };
