import { model, Schema } from 'mongoose';
import { MESSAGE_TYPE, MESSAGE_TYPE_MAP } from '../constants';

const MessageModel = new Schema(
	{
		content: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			enum: MESSAGE_TYPE,
			default: MESSAGE_TYPE_MAP.message,
		},
		sender: {
			type: Schema.Types.ObjectId,
			ref: 'user',
			required: true,
		},
		to: {
			type: Schema.Types.ObjectId,
			refPath: 'onModel',
			required: true,
		},
		onModel: {
			type: String,
			required: true,
			enum: ['group', 'user'],
		},
	},
	{
		timestamps: true,
	}
);

export const Message = model('message', MessageModel);
