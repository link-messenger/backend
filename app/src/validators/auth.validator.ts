import * as yup from 'yup';
import { OTP_LENGTH } from '../constants';

export const loginSchema = yup.object({
	body: yup.object({
		email: yup.string().email().required(),
		password: yup.string().min(8).required(),
		device: yup.string().required(),
	}),
});

export const registerSchema = yup.object({
	body: yup.object({
		email: yup.string().email().required(),
		username: yup.string().required(),
		name: yup.string().required(),
		password: yup.string().min(8).required(),
		device: yup.string().required(),
		confirmPassword: yup
			.string()
			.oneOf([yup.ref('password')], 'Passwords must match')
			.required(),
	}),
});

export const refreshTokenSchema = yup.object({
	body: yup.object({
		refresh: yup.string().required(),
	}),
});

export const updateAccountSchema = yup.object({
	body: yup.object({
		name: yup.string().required(),
		username: yup.string().required(),
		email: yup.string().email().required(),
	}),
});

export const verifyOtpSchema = yup.object({
	body: yup.object({
		otp: yup.string().length(OTP_LENGTH).required(),
	}),
});

export const forgetPasswordSchema = yup.object({
	body: yup.object({
		email: yup.string().email().required(),
	}),
});

export const resetPasswordSchema = yup.object({
	body: yup.object({
		otp: yup.string().length(OTP_LENGTH).required(),
		password: yup.string().min(8).required(),
		confirmPassword: yup
			.string()
			.oneOf([yup.ref('password')], 'Passwords must match')
			.required(),
	}),
});

export const checkUsernameUniqueSchema = yup.object({
	body: yup.object({
		username: yup.string().required(),
	}),
});