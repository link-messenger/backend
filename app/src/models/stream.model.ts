import { model, Schema } from "mongoose";

const StreamModel = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'user',
		},
		key: {
			type: String,
			required: true,
			index: {
				unique: true,
			}
		}
	},
	{
		timestamps: true,
	}
);


export const Stream = model('stream', StreamModel);