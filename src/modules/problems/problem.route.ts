import express from "express";
import { basePingController } from "../../common/helpers/ping.request.js";
import ProblemController from "./problem.controller.js";
import ProblemRepository from "./problem.repository.js";
import ProblemService from "./problem.service.js";

const problemRepository = new ProblemRepository();
const problemService = new ProblemService(problemRepository);
const problemController = new ProblemController(problemService);

const problemRouter = express.Router();
problemRouter.get(
	"/problem/ping",
	basePingController({
		serviceName: "Problem Service",
	}),
);

problemRouter.post(
	"/problem",
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
	problemController.update.bind(problemController),
);
problemRouter.delete(
	"/problem/:id",
	problemController.delete.bind(problemController),
);

export { problemRouter };
