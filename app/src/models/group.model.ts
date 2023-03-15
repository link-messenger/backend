import { Schema, model } from 'mongoose';
import { GROUP_STATUS, GROUP_STATUS_MAP, ROLES, ROLESMAP } from '../constants';
import { nanoid } from 'nanoid';

const GroupModel = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			minlength: 1,
			maxlength: 30,
		},
		description: {
			type: String,
			required: false,
			trim: true,
		},
		status: {
			type: String,
			enum: GROUP_STATUS,
			default: GROUP_STATUS_MAP.private,
		},
		members: [
			{
				user: {
					type: Schema.Types.ObjectId,
					ref: 'user',
					required: true,
					unique: true,
				},
				role: {
					type: String,
					required: true,
					enum: ROLES,
					default: ROLESMAP.user,
				},
			},
		],
		link: {
			type: String,
			required: true,
			default: nanoid(10)
		},
	},
	{
		timestamps: true,
	}
);

export const Group = model('group', GroupModel);
