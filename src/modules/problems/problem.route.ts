import express from "express";
import { basePingController } from "../../common/helpers/ping.request.js";
import AuthMiddleware from "../auth/middleware/auth.middleware.js";
import { CodeStubRepository } from "./code-stub.repository.js";
import { CodeStubService } from "./code-stub.service.js";
import ProblemController from "./problem.controller.js";
import ProblemRepository from "./problem.repository.js";
import ProblemService from "./problem.service.js";

const problemRepository = new ProblemRepository();
const problemService = new ProblemService(problemRepository);
const codeStubRepository = new CodeStubRepository();
const codeStubService = new CodeStubService(
	codeStubRepository,
	problemRepository,
);
const problemController = new ProblemController(
	problemService,
	codeStubService,
);
const authMiddleware = new AuthMiddleware();

const problemRouter = express.Router();
problemRouter.get(
	"/problem/ping",
	basePingController({
		serviceName: "Problem Service",
	}),
);

problemRouter.post(
	"/problem",
	authMiddleware.isAuthenticated.bind(authMiddleware),
	problemController.create.bind(problemController),
);
problemRouter.get(
	"/problem",
	problemController.getProblemByFilter.bind(problemController),
);
problemRouter.get(
	"/problem/:id",
	problemController.getById.bind(problemController),
);
problemRouter.put(
	"/problem/:id",
	authMiddleware.isAuthenticated.bind(authMiddleware),
	problemController.update.bind(problemController),
);
problemRouter.delete(
	"/problem/:id",
	authMiddleware.isAuthenticated.bind(authMiddleware),
	problemController.delete.bind(problemController),
);

problemRouter.post(
	"/problem/toggle-like/:id",
	authMiddleware.isAuthenticated.bind(authMiddleware),
	problemController.toggleLike.bind(problemController),
);

problemRouter.post(
	"/problem/code-stub",
	authMiddleware.isAuthenticated.bind(authMiddleware),
	problemController.createCodeStub.bind(problemController),
);

problemRouter.put(
	"/problem/:id/code-stub",
	authMiddleware.isAuthenticated.bind(authMiddleware),
	problemController.updateCodeStub.bind(problemController),
);

export { problemRouter };
