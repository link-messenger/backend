import { NextFunction, Request, Response } from "express";
import colors from 'colors';
import { Socket } from "socket.io";

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${colors.green(req.method)}] ${colors.gray(req.path)}`);
  next();
}

export const socketLoggerMiddleware = (socket: Socket, next) => {
  console.log(`[${colors.green(socket.handshake.auth.id)}] ${colors.gray(socket.handshake.url)}`);
  next();
}
