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
	"/article/slug/:slug",
	articleController.getArticleBySlug.bind(articleController),
);

articleRouter.get(
	"/article/:id",
	articleController.getArticleById.bind(articleController),
);

articleRouter.get(
	"/article",
	articleController.getAllArticles.bind(articleController),
);

articleRouter.put(
	"/article/:id",
	authMiddleware.isAuthenticated.bind(authMiddleware),
	articleController.updateArticle.bind(articleController),
);

articleRouter.delete(
	"/article/:id",
	authMiddleware.isAuthenticated.bind(authMiddleware),
	articleController.deleteArticle.bind(articleController),
);

export default articleRouter;
