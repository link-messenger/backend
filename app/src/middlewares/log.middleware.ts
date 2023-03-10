import { NextFunction, Request, Response } from "express";
import colors from 'colors';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${colors.green(req.method)}] ${colors.gray(req.path)}`);
  next();
}