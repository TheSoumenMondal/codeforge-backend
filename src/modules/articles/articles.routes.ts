import express from "express";
import AuthMiddleware from "../auth/middleware/auth.middleware.js";
import ArticleController from "./articles.controller.js";
import ArticleRepository from "./articles.repository.js";
import ArticleService from "./articles.services.js";

const articleRepository = new ArticleRepository();
const articleService = new ArticleService(articleRepository);
const articleController = new ArticleController(articleService);

const authMiddleware = new AuthMiddleware();

const articleRouter: express.Router = express.Router();

articleRouter.post(
	"/article",
	authMiddleware.isAuthenticated.bind(authMiddleware),
	articleController.createArticle.bind(articleController),
);

articleRouter.get(
	"/article/:slug",
	articleController.getArticleBySlug.bind(articleController),
);

export default articleRouter;
