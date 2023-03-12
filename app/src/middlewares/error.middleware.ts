import { NextFunction, Request, Response } from 'express';
import colors from 'colors';

import { CustomError } from '../errors';
import { Socket } from 'socket.io';

export const errorHandler = (
	error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.error(`[${colors.red.bold('ERROR')}]`, error.message);

	if (error instanceof CustomError) {
		return res.status(error.getCode()).json({
			message: error.getMessage(),
			error: error.getError(),
		});
	}
	return res.status(500).send({
		errors: {
			error,
		},
	});
};

export const socketErrorHandler = (socket: Socket, next) => {
	socket.on('error', (error) => {
		console.error(`[${colors.red.bold('SOCKET ERROR')}]`, error.message);
	});
	next();
}