import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "./api.error.js";

export const errorHandler = (
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	if (err instanceof ApiError) {
		res.status(err.getStatusCode()).json({
			success: false,
			message: err.message,
			data: null,
			error: err.name,
		});
	} else {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: "Internal Server Error",
			data: null,
			error: err.name,
		});
	}
};
