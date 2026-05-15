import express from "express";
import AuthMiddleware from "../auth/middleware/auth.middleware.js";
import { SheetController } from "./sheet.controller.js";
import { SheetRepository } from "./sheet.repository.js";
import { SheetService } from "./sheet.service.js";

const sheetRepository = new SheetRepository();
const sheetService = new SheetService(sheetRepository);
const sheetController = new SheetController(sheetService);

const authMiddleware = new AuthMiddleware();

const sheetRouter: express.Router = express.Router();

/**
 * Create a new sheet. This endpoint requires authentication and will create a new sheet associated with the authenticated user. The request body should contain the `title`, `description`, `visibility`, and `categories` of the sheet to be created.
 */
sheetRouter.post(
	"/sheet/",
	authMiddleware.isAuthenticated.bind(authMiddleware),
	sheetController.createSheet.bind(sheetController),
);

/**
 * Get all sheets created by the authenticated user. This endpoint requires authentication and will return only the sheets that belong to the requesting user.
 */

sheetRouter.get(
	"/sheet/me",
	authMiddleware.isAuthenticated.bind(authMiddleware),
	sheetController.getMySheets.bind(sheetController),
);

/**
 * Add a problem to a specific sheet. This endpoint requires authentication and will only allow the owner of the sheet to add problems to it. The request body should contain the `problemId` of the problem to be added, and the `sheetId` should be provided as a URL parameter.
 */

sheetRouter.post(
	"/sheet/:id/add-problem",
	authMiddleware.isAuthenticated.bind(authMiddleware),
	sheetController.addProblemToSheet.bind(sheetController),
);

/**
 * Get all problems for a specific sheet. This endpoint is public and does not require authentication.
 */
sheetRouter.get(
	"/sheet/:id/problems",
	sheetController.getProblemsBySheetId.bind(sheetController),
);

/**
 * Get a specific sheet by its ID. This endpoint is public and does not require authentication.
 */
sheetRouter.get(
	"/sheet/:id",
	sheetController.getSheetById.bind(sheetController),
);

/**
 * Get all public sheets. This endpoint is public and does not require authentication.
 */

sheetRouter.get(
	"/sheet",
	sheetController.getAllPublicSheets.bind(sheetController),
);

export { sheetRouter };
