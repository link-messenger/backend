import { Schema, model } from 'mongoose';

import { ROLES, ROLESMAP, USER_STATUS, USER_STATUS_MAP } from '../constants';

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
		role: {
			type: String,
			required: true,
			enum: ROLES,
			default: ROLESMAP.admin,
		},
		status: {
			type: String,
			required: true,
			enum: USER_STATUS,
			default: USER_STATUS_MAP.unverified,
		},
	},
	{
		timestamps: true,
	}
);

export const User = model('user', UserModel);
