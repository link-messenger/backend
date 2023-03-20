import { Request, Response } from 'express';
import { MESSAGE_PER_PAGE } from '../constants';
import { ServerError } from '../errors';
import { hasUser } from '../guards/server.guard';
import { Message } from '../models';

export const getLastMessages = async (req: Request, res: Response) => {
	if (!hasUser(req)) throw new ServerError('oops! something went wrong');
	const { id } = req.params;
	const { page } = req.query;
	const p_num = (page ?? 1).toString();
	const skip = (parseInt(p_num) - 1) * MESSAGE_PER_PAGE;

	const count = await Message.count({
		to: id,
	});
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
	return res
		.status(200)
		.json({ messages, count: Math.ceil(count / MESSAGE_PER_PAGE) });
};
