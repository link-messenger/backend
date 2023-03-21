import otp from 'otp-generator';

import { getRedisClient } from '../config';
import { OTP_LENGTH } from '../constants';
import { getEnv } from './env';

export const generateRedisTokenName = (id: string) => `token-${id}`;
export const generateRedisRefreshName = (id: string) => `refresh-${id}`;

export const setRedisToken = async (
	id: string,
	token: string,
	refresh: string
) => {
	const redis = getRedisClient();

	await redis.set(generateRedisTokenName(id), token, {
		EX: parseInt(getEnv('REDIS_TOKEN_EXPIRATION')),
	});

	await redis.set(generateRedisRefreshName(id), refresh, {
		EX: parseInt(getEnv('REDIS_REFRESH_EXPIRATION')),
	});
};

export const getRedisToken = async (id: string) => {
	const redis = getRedisClient();
	const searchToken = await redis.get(generateRedisTokenName(id));
	const searchRefresh = await redis.get(generateRedisRefreshName(id));

	return {
		searchToken,
		searchRefresh,
	};
};

export const deleteRedisToken = async (id: string) => {
	const redis = getRedisClient();

	await redis.del(generateRedisTokenName(id));
	await redis.del(generateRedisRefreshName(id));
};

export const createOTP = () => {
	return otp.generate(OTP_LENGTH, {
		digits: true,
		lowerCaseAlphabets: true,
		upperCaseAlphabets: true,
		specialChars: false,
	});
};

export const saveUnverifiedUser = async (user, otp: string) => {
	const redis = getRedisClient();
	await redis.set(otp, JSON.stringify(user), {
		EX: parseInt(getEnv('REDIS_OTP_EXPIRATION')),
	});
};

export const getUnverifiedUser = async (otp: string) => {
	const redis = getRedisClient();
	const user = await redis.get(otp);
	if (!user) throw new Error('OTP not found');
	return JSON.parse(user);
};

export const expireOTP = async (otp: string) => {
	const redis = getRedisClient();
	await redis.del(otp);
};
