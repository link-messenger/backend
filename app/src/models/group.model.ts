import { Schema, model } from 'mongoose';
import { GroupStatus, Roles } from '../constants';
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
			enum: GroupStatus,
			default: GroupStatus.PRIVATE,
		},
		members: [
			{
				user: {
					type: Schema.Types.ObjectId,
					ref: 'user',
					required: true,
				},
				role: {
					type: String,
					required: true,
					enum: Roles,
					default: Roles.USER,
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
