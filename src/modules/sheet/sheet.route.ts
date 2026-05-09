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

sheetRouter.post(
	"/sheet/",
	authMiddleware.isAuthenticated.bind(authMiddleware),
	sheetController.createSheet.bind(sheetController),
);

sheetRouter.get(
	"/sheet",
	sheetController.getAllPublicSheets.bind(sheetController),
);

export { sheetRouter };
