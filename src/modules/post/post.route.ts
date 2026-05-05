import express from "express";
import AuthMiddleware from "../auth/middleware/auth.middleware.js";
import { PostController } from "./post.controller.js";
import { PostRepository } from "./post.repository.js";
import { PostService } from "./post.service.js";

const postRepository = new PostRepository();
const postService = new PostService(postRepository);
const postController = new PostController(postService);
const authMiddleware = new AuthMiddleware();

const postRouter: express.Router = express.Router();

postRouter.post(
	"/post",
	authMiddleware.isAuthenticated.bind(authMiddleware),
	postController.createPost.bind(postController),
);

postRouter.get("/post", postController.getAllPosts.bind(postController));

export { postRouter };
