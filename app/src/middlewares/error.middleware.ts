import { NextFunction, Request, Response } from "express";
import colors from 'colors';

import { CustomError } from "../errors";


export const errorHandler = (error,req: Request, res: Response, next: NextFunction) => {
	console.error(`[${colors.red.bold('ERROR')}]`, error.message);
	
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