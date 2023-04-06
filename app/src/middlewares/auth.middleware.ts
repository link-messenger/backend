import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { getRedisClient } from '../config';
import { ForbiddenError, UnauthorizedError } from '../errors';
import { User } from '../models';
import { generateRedisTokenName, getEnv } from '../utils';

export const protectedRoute = async (
	req: Request,
	_res: Response,
	next: NextFunction
) => {
	const token = (req.headers['Authorization'] ??
		req.headers['authorization']) as string | undefined;
	if (!token) throw new ForbiddenError('Credentials needed');
	const [bearer, content] = token.split(' ');
	if (bearer !== 'Bearer') throw new UnauthorizedError('Invalid token');
	if (!content) throw new UnauthorizedError('Invalid token');
	const user = verify(content, getEnv('APP_TOKEN_SECRET')) as {
		email: string;
		id: string;
	};
	if (!user) throw new UnauthorizedError('Invalid Token');
	const redis = getRedisClient();
	const isValid = await redis.get(generateRedisTokenName(user.id));
	if (!isValid || isValid !==content) throw new UnauthorizedError('Invalid Token');
	// @ts-expect-error
	req.user = { _id: user.id, email: user.email };
	return next();
};
