import { model, Schema } from 'mongoose';
import { MessageStatus, MessageType } from '../constants';

const MessageModel = new Schema(
	{
		content: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			enum:MessageType,
			default: MessageType.TEXT,
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
		status: {
			type: String,
			required: true,
			enum: MessageStatus,
			default: MessageStatus.UNSEEN,
		},
	},
	{
		timestamps: true,
	}
);

export const Message = model('message', MessageModel);
