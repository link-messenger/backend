import { model, Schema } from 'mongoose';

const ConversationModel = new Schema(
	{
		users: [
			{
				type: Schema.Types.ObjectId,
				ref: 'user',
			},
		],
	},
	{
		timestamps: true,
	}
);

export const Conversation = model('conversation', ConversationModel);
