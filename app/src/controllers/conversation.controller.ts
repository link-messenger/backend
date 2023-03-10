import { Request, Response } from 'express';
import { NotFoundError, ServerError, UnauthorizedError } from '../errors';
import { hasUser } from '../guards/server.guard';
import { Conversation, User } from '../models';

export const createConversationController = async (
	req: Request,
	res: Response
) => {
	if (!hasUser(req)) throw new ServerError('oops! something went wrong');
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
	if (!hasUser(req)) throw new ServerError('oops! something went wrong'); 
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
	if (!hasUser(req)) throw new ServerError('oops! something went wrong');
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


export const getUserDetailController = async (req: Request, res: Response) => {
	const { id } = req.params;
	const user = await User.findById(id);
	if (!user) throw new NotFoundError('User not found');
	res.json(user);
};
