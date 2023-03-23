import { hash, verify } from 'argon2';
import { Request, Response } from 'express';

import { getRedisClient } from '../config';
import { FORGET_PASSWORD_MAIL, LOGIN_MAIL } from '../constants';
import { ServerError, UnauthorizedError } from '../errors';
import { hasUser } from '../guards/server.guard';
import { User, UserDevice } from '../models';
import { sendEmail } from '../services/mail.service';
import {
	createOTP,
	deleteRedisToken,
	expireOTP,
	generateRedisRefreshName,
	generatePairToken,
	getRedisToken,
	getUnverifiedUser,
	saveUnverifiedUser,
	setRedisToken,
	generateToken,
	verifyRefresh,
} from '../utils';



export const loginController = async (req: Request, res: Response) => {
	const { email, password, device } = req.body;
	const user = await User.findOne({
		email: email,
	});
	if (!user) throw new UnauthorizedError('wrong credentials');
	const deviceHash = await hash(device);
	const foundDevice = await UserDevice.findOne({
		user: user._id,
		hash: deviceHash,	
	});
	const { searchRefresh } = await getRedisToken(
		user._id.toString()
	);
	if (searchRefresh && foundDevice) {
		const token = generateToken(user);
		setRedisToken(user._id.toString(), token, searchRefresh);
		return res.status(200).json({
			token: token,
			refresh: searchRefresh,
		});
	}

	const authorized = verify(user.password, password);
	if (!authorized) throw new Error('wrong credentials!');
	
	if (!foundDevice) {
		const userDevice = await UserDevice.create({
			hash: deviceHash,
			user: user._id,
			device,
		});
		userDevice.save();
	}
	const otp = createOTP();
	await saveUnverifiedUser(user, otp);
	sendEmail({
		to: user.email,
		subject: LOGIN_MAIL.subject,
		html: LOGIN_MAIL.html(otp),
	});
	res.status(201).json({
		message: 'otp sent to your email',
	});
};

export const registerController = async (req: Request, res: Response) => {
	const { device, ...user_data } = req.body;
	const h_password = await hash(user_data.password);
	const user = await User.create({
		...user_data,
		password: h_password,
	});
	user.save();
	if (!user) throw new ServerError('Something went wrong!');
	const deviceHash = await hash(device);

	const userDevice = await UserDevice.create({
		hash: deviceHash,
		device,
		user: user._id,
	});
	userDevice.save();

	const { token, refresh } = generatePairToken(user);
	setRedisToken(user._id.toString(), token, refresh);

	res.status(201).json({
		user: {
			username: user.username,
			name: user.name,
			email: user.email,
			id: user.id,
			createdAt: user.createdAt,
		},
		token,
		refresh,
	});
};

// TODO: create an injectable decorator so we can remove gaurds
// protected route
export const profileController = async (req: Request, res: Response) => {
	if (!hasUser(req)) throw new ServerError('oops! something went wrong');
	const user = req.user;

	const devices = await UserDevice.find({
		user: user._id,
	});
	res.json({
		id: user._id,
		username: user.username,
		name: user.name,
		email: user.email,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
		devices,
	});
};

// proteceted route
export const logoutController = async (req: Request, res: Response) => {
	if (!hasUser(req)) throw new ServerError('oops! something went wrong');
	const user = req.user;
	deleteRedisToken(user._id.toString());
	res.status(200).json({
		message: 'logout successfull',
	});
};

export const deleteAccountController = async (req: Request, res: Response) => {
	if (!hasUser(req)) throw new ServerError('oops! something went wrong');
	const user = req.user;
	await User.findByIdAndDelete(user._id);
	deleteRedisToken(user._id.toString());
	res.status(200).json({
		message: 'account deleted successfully',
	});
};

export const refreshTokenController = async (req: Request, res: Response) => {
	const { refresh } = req.body;
	const userToken = verifyRefresh(refresh) as { id: string };
	const user = await User.findById(userToken.id);
	if (!user) throw new UnauthorizedError('unAuthorized');
	const redis = getRedisClient();
	const checkRefresh = await redis.get(
		generateRedisRefreshName(user._id.toString())
	);
	if (!checkRefresh || refresh !== checkRefresh)
		throw new UnauthorizedError('unAuthorized');

	const { token, refresh: newRefresh } = generatePairToken(user);

	setRedisToken(user._id.toString(), token, newRefresh);

	return res.json({
		token,
		refresh: newRefresh,
	});
};

export const updateAccountController = async (req: Request, res: Response) => {
	if (!hasUser(req)) throw new ServerError('oops! something went wrong');
	const user = req.user;
	const { name, username, email } = req.body;
	const updated = await User.findByIdAndUpdate(
		user._id,
		{
			name,
			username,
			email,
		},
		{
			projection: {
				password: 0,
			},
			new: true,
		}
	);
	if (!updated) throw new ServerError('something went wrong');
	res.json({
		profile: updated,
		message: 'account updated successfully',
	});
};

export const verifyOtpController = async (req: Request, res: Response) => {
	const { otp } = req.body;
	const user = await getUnverifiedUser(otp);
	if (!user) throw new UnauthorizedError('invalid otp');
	const { token, refresh } = generatePairToken(user);
	await expireOTP(otp);
	setRedisToken(user._id.toString(), token, refresh);
	res.json({
		token,
		refresh,
	});
};

export const forgetPasswordController = async (req: Request, res: Response) => {
	const { email } = req.body;
	const user = await User.findOne({
		email,
	});

	if (!user) throw new UnauthorizedError('invalid email');

	const otp = createOTP();
	await saveUnverifiedUser(user, otp);
	sendEmail({
		to: user.email,
		subject: FORGET_PASSWORD_MAIL.subject,
		html: FORGET_PASSWORD_MAIL.html(otp),
	});

	res.status(201).json({
		message: 'otp sent to your email',
	});
};

export const resetPasswordController = async (req: Request, res: Response) => {
	const { otp, password } = req.body;
	const unverified = await getUnverifiedUser(otp);
	if (!unverified) throw new UnauthorizedError('invalid otp');
	const user = await User.findById(unverified._id);
	if (!user) throw new ServerError('something went wrong');
	const h_password = await hash(password);
	const updated = await User.findByIdAndUpdate(
		user._id,
		{
			password: h_password,
		},
		{
			new: true,
		}
	);
	if(!updated) throw new ServerError('something went wrong');
	await expireOTP(otp);
	const { token, refresh } = generatePairToken(updated);
	await setRedisToken(updated._id.toString(), token, refresh);
	res.json({
		message: 'password reset successfully',
		token,
		refresh,
	});
};
