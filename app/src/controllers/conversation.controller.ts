import { Request, Response } from 'express';
import { NotFoundError } from '../errors';
import { Conversation } from '../models';

export const createConversationController = async (
	req: Request,
	res: Response
) => {
	// @ts-ignore
	const user = req.user;
	const { targetUser } = req.body;
	const checkConv = await Conversation.findOne({
		users: {
			$eq: [user._id, targetUser]
		}
	}).populate('users');
	if (checkConv) {
		return res.json(checkConv);
	}
	const conversation = await (
		await Conversation.create({
			users: [user._id, targetUser],
		})
	).populate('users');

	res.status(201).json(conversation);
};

export const getUserConversationController = async (req: Request, res: Response) => {
  // @ts-ignore
	const user = req.user;
  const conversations = await Conversation.find({
		users: {
			$elemMatch: {
				$eq: user._id
			}
		}
	}).populate('users');

  res.json(conversations);
}

export const deleteConversationController = async (
	req: Request,
	res: Response
) => {
	// @ts-ignore
	const user = req.user;
	const { id } = req.params;
	const conversation = await Conversation.findOneAndDelete({
		_id: id,
    users: {
			$elemMatch: {
				$eq: user._id
			}
		},
  });
   if (!conversation) throw new NotFoundError('Conversation not found');
  res.json(conversation);
};
