import { Schema, model } from 'mongoose';

const UserDeviceModel = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'user',
			required: true,
		},
		device: {
			type: String,
			required: true,
		},
		hash: {
			type: String,
			required: true,
			index: true,
		},
	},
	{
		timestamps: true,
	}
);


export const UserDevice = model('userDevice', UserDeviceModel);
