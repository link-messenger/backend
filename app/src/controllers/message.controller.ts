import { Request, Response } from 'express';
import { MESSAGE_PER_PAGE } from '../constants';
import { ServerError } from '../errors';
import { hasUser } from '../guards/server.guard';
import { Message } from '../models';

export const getLastMessages = async (req: Request, res: Response) => {
	if (!hasUser(req)) throw new ServerError('oops! something went wrong');
	const user = req.user;
	const { id, type } = req.params;
	const { page } = req.query;
	const p_num = (page ?? 1).toString();
	const skip = (parseInt(p_num) - 1) * MESSAGE_PER_PAGE;
	if (type === 'group') {
		const messages = await Message.find(
			{
				to: id,
			},
			{
				content: true,
				createdAt: true,
				sender: true,
				onModel: true,
				to: true,
				type: true,
				updatedAt: true,
			},
			{
				sort: '-createdAt',
				skip,
				limit: MESSAGE_PER_PAGE,
				populate: 'sender',
			}
		);
		return res.status(200).json(messages);
	}
	const messages = await Message.find(
		{
			$or: [
				{
					to: id,
					sender: user._id,
				},
				{
					to: user._id,
					sender: id,
				},
			],
		},
		{
			content: true,
			createdAt: true,
			sender: true,
			onModel: true,
			to: true,
			type: true,
			updatedAt: true,
		},
		{
			sort: '-createdAt',
			skip,
			limit: MESSAGE_PER_PAGE,
			populate: 'sender',
		}
	)
		// .sort('-createdAt')
		// .skip(skip)
		// .limit(MESSAGE_PER_PAGE)
		// .populate('sender');
	return res.status(200).json(messages);
};
