import express from "express";
import { basePingController } from "../../common/helpers/ping.request.js";
import AuthMiddleware from "../auth/middleware/auth.middleware.js";
import { CodeStubRepository } from "../problems/code-stub.repository.js";
import ProblemRepository from "../problems/problem.repository.js";
import { SubmissionController } from "./submission.controller.js";
import { SubmissionRepository } from "./submission.repository.js";
import { SubmissionService } from "./submission.service.js";

const problemRepository = new ProblemRepository();
const submissionRepository = new SubmissionRepository();
const codeStubRepository = new CodeStubRepository();
const submissionService = new SubmissionService(
	submissionRepository,
	problemRepository,
	codeStubRepository,
);

const submissionController = new SubmissionController(submissionService);

const authMiddleware = new AuthMiddleware();

const submissionRouter: express.Router = express.Router();
submissionRouter.get(
	"/submission/ping",
	basePingController({
		serviceName: "Submission Service",
	}),
);

submissionRouter.post(
	"/submission/:problem_id",
	authMiddleware.isAuthenticated.bind(authMiddleware),
	submissionController.createSubmission.bind(submissionController),
);

export { submissionRouter };
