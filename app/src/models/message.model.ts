import { model, Schema } from 'mongoose';

const MessageModel = new Schema(
	{
		content: {
      type: Object,
      required: true,
		},
		sender: {
			type: Schema.Types.ObjectId,
			ref: 'group',
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