import { NextFunction, Request, Response } from "express";
import colors from 'colors';
import { Socket } from "socket.io";
import { getCurrentTime } from "../utils/time";

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(
		`[${colors.green(req.method)}] ${colors.blue(
			getCurrentTime()
		)} ${colors.gray(req.path)}`
	);
  next();
}

export const socketLoggerMiddleware = (socket: Socket, next) => {
  console.log(
		`[${colors.green(socket.handshake.auth.id)}] ${colors.blue(
			getCurrentTime()
		)} ${colors.gray(socket.handshake.url)}`
	);
  next();
}
