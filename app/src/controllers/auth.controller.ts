import { hash, verify } from 'argon2';
import { Request, Response } from 'express';
import { Server } from 'http';
import jwt from 'jsonwebtoken';

import { ServerError, UnauthorizedError } from '../errors';
import { User } from '../models';
import { getEnv } from '../utils';

const generateToken = (user) => {
	return jwt.sign(
		{
			id: user.id,
			email: user.email,
		},
		getEnv('APP_TOKEN_SECRET'),
		{
			expiresIn:getEnv('APP_TOKEN_EXPIRATION')
		}
	);
};

export const loginController = async (req:Request, res: Response) => {
	const { email, password } = req.body;
	const user = await User.findOne({
		email: email,
	});
	if (!user) throw new UnauthorizedError('wrong credentials');
	const authorized = verify(user.password, password);
	if (!authorized) throw new Error('UnAuthorized!');

	const token = generateToken(user);
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
	const token = generateToken(user);

	res.status(201).json({
		data: {
			username: user.username,
			email: user.email,
			id: user.id,
		},
		token,
	});
};


// protected route
export const profileController = async (req:Request, res:Response) => {
	// @ts-ignore
	const user = req.user;
	res.json(user);
};
