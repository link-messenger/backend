import { Schema, model } from 'mongoose';

import {
	Roles, UserActivityStatus, UserStatus,
} from '../constants';

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
			index: {
				unique: true,
			},
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
			enum: Roles,
			default: Roles.USER,
		},
		status: {
			type: String,
			required: true,
			enum: UserStatus,
			default: UserStatus.UNVERIFIED,
		},
		activityStatus: {
			type: String,
			required: true,
			enum: UserActivityStatus,
			default: UserActivityStatus.ONLINE,
		},
	},
	{
		timestamps: true,
	}
);

export const User = model('user', UserModel);
