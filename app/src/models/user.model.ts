import { Schema, model } from 'mongoose';

const UserModel = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			minlength: 3,
			maxlength: 20,
		},
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			minlength: 5,
			maxlength: 50,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
			required: false,
		},
	},
	{
		timestamps: true,
	}
);

export const User = model('user', UserModel);
