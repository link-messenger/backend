import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors";

export const errorHandler = (error,req: Request, res: Response, next: NextFunction) => {
	console.error('[ERROR] ', error.message);
	
	if (error instanceof CustomError) {
		return res.status(error.getCode()).json({
			message: error.getMessage(),
			error: error.getError()
		})
	}
  return res.status(500).send({
		errors: {
			error,
		},
	});
}