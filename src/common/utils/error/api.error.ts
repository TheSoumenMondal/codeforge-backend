import { StatusCodes } from "http-status-codes";

class ApiError extends Error {
	private statusCode: number;
	private isOperational: boolean;
	constructor(
		message: string,
		statusCode: number,
		isOperational: boolean = true,
		name: string = "ApiError",
	) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;
		this.name = name;
	}
	public getStatusCode(): number {
		return this.statusCode;
	}
	public getIsOperational(): boolean {
		return this.isOperational;
	}

	static notImplemented(message: string = "Not Implemented"): ApiError {
		return new ApiError(
			message,
			StatusCodes.NOT_IMPLEMENTED,
			true,
			"NotImplementedError",
		);
	}

	static badRequest(message: string = "Bad Request"): ApiError {
		return new ApiError(
			message,
			StatusCodes.BAD_REQUEST,
			true,
			"BadRequestError",
		);
	}

	static notFound(message: string = "Not Found"): ApiError {
		return new ApiError(message, StatusCodes.NOT_FOUND, true, "NotFoundError");
	}

	static invalid(message: string = "Invalid"): ApiError {
		return new ApiError(message, StatusCodes.BAD_REQUEST, true, "InvalidError");
	}

	static conflict(message: string = "Conflict"): ApiError {
		return new ApiError(message, StatusCodes.CONFLICT, true, "ConflictError");
	}
}

export { ApiError };
