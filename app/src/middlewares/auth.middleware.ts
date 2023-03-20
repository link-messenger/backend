import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { getRedisClient } from '../config';
import { ForbiddenError, UnauthorizedError } from '../errors';
import { User } from '../models';
import { generateRedisTokenName, getEnv } from '../utils';

export const protectedRoute = async (
	req: Request,
	res: Response,
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
	let checkedUser: any = await redis.get(user.id);
	if (!checkedUser) {
		checkedUser = await User.findById(user.id);
		await redis.set(
			user.id,
			JSON.stringify({
				_id: checkedUser.id,
				email: checkedUser.email,
				password: checkedUser.password,
				username: checkedUser.username,
				name: checkedUser.name,
				createdAt: checkedUser.createdAt,
				updatedAt: checkedUser.updatedAt,
				token,
			}),
			{
				EX: parseInt(getEnv('REDIS_TOKEN_EXPIRATION')),
			}
		);
		if (!checkedUser) throw new UnauthorizedError('Invalid User');
	} else {
		checkedUser = JSON.parse(checkedUser);
	}
	//@ts-ignore
	req.user = checkedUser;
	return next();
};
