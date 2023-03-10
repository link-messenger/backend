import { hash, verify } from 'argon2';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getRedisClient } from '../config';

import { ServerError, UnauthorizedError } from '../errors';
import { hasUser } from '../guards/server.guard';
import { User } from '../models';
import { generateRedisTokenName, getEnv } from '../utils';

const generateToken = (user) => {
	return jwt.sign(
		{
			id: user.id,
			email: user.email,
		},
		getEnv('APP_TOKEN_SECRET')
	);
};

export const loginController = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	const user = await User.findOne({
		email: email,
	});
	const redis = getRedisClient();
	if (!user) throw new UnauthorizedError('wrong credentials');
	const searchToken = await redis.get(
		generateRedisTokenName(user._id.toString())
	);
	if (searchToken) {
		return res.json({
			token: searchToken,
		});
	}
	const authorized = verify(user.password, password);
	if (!authorized) throw new Error('UnAuthorized!');

	const token = generateToken(user);
	await redis.set(generateRedisTokenName(user._id.toString()), token, {
		EX: parseInt(getEnv('REDIS_TOKEN_EXPIRATION')),
	});

	res.json({
		token,
	});
};

export const registerController = async (req: Request, res: Response) => {
	const user_data = req.body;
	const h_password = await hash(user_data.password);
	const user = await User.create({
		...user_data,
		password: h_password,
	});
	if (!user) throw new ServerError('Something went wrong!');
	const redis = getRedisClient();
	const searchToken = await redis.get(
		generateRedisTokenName(user._id.toString())
	);
	if (searchToken) {
		return res.json({
			data: {
				username: user.username,
				email: user.email,
				id: user.id,
			},
			token: searchToken,
		});
	}
	const token = generateToken(user);
	await redis.set(generateRedisTokenName(user._id.toString()), token, {
		EX: parseInt(getEnv('REDIS_TOKEN_EXPIRATION')),
	});
	res.status(201).json({
		user: {
			username: user.username,
			name: user.name,
			email: user.email,
			id: user.id,
			createdAt: user.createdAt,
		},
		token,
	});
};

// TODO: create an injectable decorator so we can remove gaurds
// protected route
export const profileController = async (req: Request, res: Response) => {
	if (!hasUser(req)) throw new ServerError('oops! something went wrong');
	const user = req.user;
	res.json(user);
};

// proteceted route
export const logoutController = async (req: Request, res: Response) => {
	if (!hasUser(req)) throw new ServerError('oops! something went wrong');
	const user = req.user;
	const redis = getRedisClient();
	await redis.del(generateRedisTokenName(user._id.toString()));
	res.status(200).json({
		message: 'logout successfull',
	});
};
