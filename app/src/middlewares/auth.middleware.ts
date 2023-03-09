import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { getRedisClient } from '../config';
import { ForbiddenError, UnauthorizedError } from '../errors';
import { User } from '../models';
import { getEnv } from '../utils';

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.headers['authorization'];
	if (!token) return next();
	const [bearer, content] = token.split(' ');
	if (bearer !== 'Bearer') throw new UnauthorizedError('Invalid token');
	if (!content) throw new UnauthorizedError('Invalid token');
	const user = verify(content, getEnv('APP_TOKEN_SECRET')) as {
		id: string;
		email: string;
	};
	if (!user) throw new UnauthorizedError('Invalid Token');
	const redis = getRedisClient();

	let checkedUser = await redis.get(user.id);

	if (!checkedUser) {
		checkedUser = await User.findById(user.id);
		await redis.set(user.id, JSON.stringify(checkedUser), {
			EX: parseInt(getEnv('REDIS_TOKEN_EXPIRATION')) ,
		});
		if (!checkedUser) throw new UnauthorizedError('Invalid Token');
	} else {
		checkedUser = JSON.parse(checkedUser);
	}
	//@ts-ignore
	req.user = checkedUser;
	return next();
};


export const protectedRoute = async(req: Request,res: Response, next: NextFunction) => {
	//@ts-ignore
	const user = req?.user;
	if (!user) throw new ForbiddenError('Insuficient permissions');
	return next();
}
