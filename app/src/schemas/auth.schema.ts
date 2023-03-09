import * as yup from 'yup';

export const loginSchema = yup.object({
	body: yup.object({
		email: yup.string().email().required(),
		password: yup.string().min(8).required(),
	}),	
});

export const registerSchema = yup.object({
	body: yup.object({
		email: yup.string().email().required(),
		username: yup.string().required(),
		name: yup.string().required(),
		password: yup.string().min(8).required(),
		confirmPassword: yup
			.string()
			.oneOf([yup.ref('password')], 'Passwords must match'),
	}),
});
