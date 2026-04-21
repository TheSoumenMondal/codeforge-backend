import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const basePingController = ({ serviceName }: { serviceName: string }) => {
	return (_req: Request, res: Response): void => {
		res.status(StatusCodes.OK).json({
			message: `${serviceName} is running!`,
			uptime: process.uptime(),
			timestamp: new Date().toISOString(),
		});
	};
};

export { basePingController };
