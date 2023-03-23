import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { MESSAGE_PER_PAGE } from '../constants';
import { ServerError } from '../errors';
import { hasUser } from '../guards/server.guard';
import { Message } from '../models';

export const getLastMessages = async (req: Request, res: Response) => {
	if (!hasUser(req)) throw new ServerError('oops! something went wrong');
	const user = req.user;
	const { id } = req.params;
	const { page } = req.query;
	const p_num = (!!page ? page : 1).toString();
	const skip = (parseInt(p_num) - 1) * MESSAGE_PER_PAGE;
	const count = await Message.count({ to: id });
	Message.updateMany(
		{
			to: id,
			
			sender: {
				$ne: user._id,
			},
			status: 'unseen',
		},
		{
			$set: {
				status: 'seen',
			},
		}
	);
	const messages = await Message.find(
		{
			to: id,
		},
		{
			__v: 0,
			onModel: 0,
		},
		{
			sort: '-createdAt',
			skip: skip,
			limit: MESSAGE_PER_PAGE,
			populate: {
				path: 'sender',
				select: '_id name username avatar',
			},
		}
	);
	const sortedByDate = new Map<string, any[]>();
	for (let i = 0; i < messages.length; i++) {
		const date = messages[i].createdAt.toLocaleDateString('en-US', {
			month: 'numeric',
			day: 'numeric',
			year: 'numeric',
		});
		if (!sortedByDate.has(date)) {
			sortedByDate.set(date, []);
		}
		// @ts-expect-error
		sortedByDate.get(date).push(messages[i]);
	}

	return res.status(200).json({
		data: Object.fromEntries(sortedByDate),
		pages: Math.ceil(count / MESSAGE_PER_PAGE),
	});
};
