import { Request, Response } from 'express';
import { sort } from 'fast-sort';
import { Types } from 'mongoose';

import { ServerError } from '../errors';
import { hasUser } from '../guards/server.guard';
import { Conversation, Group, Message } from '../models';

export const getUserChatList = async (req: Request, res: Response) => {
	if (!hasUser(req)) throw new ServerError('oops! something went wrong');
	const user = req.user;
	const grps = await Group.find(
		{
			members: {
				$elemMatch: {
					user: user._id,
				},
			},
		},
		{
			_id: true,
			name: true,
			description: true,
			members: true,
			updatedAt: true,
			createdAt: true,
		}
	);

	const convs = await Conversation.find({
		users: {
			$elemMatch: {
				$eq: user._id,
			},
		},
	}).populate({
		path: 'users',
		select: '_id username name',
	});
	const combined: any[] = [];
	const lastMsgs = await Message.aggregate([
		{
			$match: {
				$or: [
					{
						to: {
							$in: grps.map((grp) => grp._id),
						},
					},
					{
						to: {
							$in: convs.map((conv) => conv._id),
						},
					},
				],
			},
		},
		{
			$sort: { createdAt: -1 },
		},
		{
			$group: {
				_id: '$to',
				unseen_count: {
					$sum: {
						$cond: [
							{
								$and: [
									{ $eq: ['$status', 'unseen'] },
									{ $ne: ['$sender', new Types.ObjectId(user._id)] },
								],
							},
							1,
							0,
						],
					},
				},
				last_message: { $first: '$$ROOT' },
			},
		},
		{
			$lookup: {
				from: 'users',
				localField: 'last_message.sender',
				foreignField: '_id',
				as: 'sender',
			},
		},
		{
			$unwind: '$sender',
		},
		{
			$project: {
				to: '$_id',
				last_message: {
					_id: '$last_message._id',
					content: '$last_message.content',
					createdAt: '$last_message.createdAt',
					sender: '$sender',
					status: '$last_message.status',
				},
				unseen_count: 1,
			},
		},
	]);
	const lastMsgsMap: Map<string, any> = lastMsgs.reduce((pre, cur) => {
		pre.set(cur.to.toString(), cur);
		return pre;
	}, new Map<string, any>());
	for (let i = 0; i < grps.length; i++) {
		const grp = grps[i];
		const lastAndUnseen = lastMsgsMap.get(grp._id.toString());
		const lastMsg = lastAndUnseen?.last_message;
		const sender = lastMsg?.sender;
		if (lastMsg) {
			combined.push({
				_id: grp._id,
				name: grp.name,
				description: grp.description,
				members: grp.members,
				createdAt: grp.createdAt,
				updatedAt: grp.updatedAt,
				type: 'group',
				lastMessage: {
					to: grp._id,
					content: lastMsg.content,
					createdAt: lastMsg.createdAt,
					updatedAt: lastMsg.upatedAt,
					sender: {
						_id: sender._id,
						name: sender.name,
						username: sender.username,
						updatedAt: sender.updatedAt,
					},
				},
				unseen: lastAndUnseen.unseen_count,
			});
			continue;
		}

		combined.push({
			_id: grp._id,
			name: grp.name,
			description: grp.description,
			members: grp.members,
			type: 'group',
			unseen: 0,
			updatedAt: grp.updatedAt,
		});
	}

	for (let i = 0; i < convs.length; i++) {
		const conv = convs[i];
		const lastAndUnseen = lastMsgsMap.get(conv._id.toString());
		const lastMsg = lastAndUnseen?.last_message;
		const sender = lastMsg?.sender;
		if (lastMsg) {
			combined.push({
				_id: conv._id,
				users: conv.users,
				type: 'user',
				lastMessage: {
					to: conv._id,
					content: lastMsg.content,
					createdAt: lastMsg.createdAt,
					updatedAt: lastMsg.updatedAt,
					sender: {
						_id: sender._id,
						name: sender.name,
						username: sender.username,
						updatedAt: sender.updatedAt,
					},
				},
				unseen: lastAndUnseen.unseen_count,
			});
			continue;
		}

		combined.push({
			_id: conv._id,
			users: conv.users,
			type: 'user',
			unseen: 0,
		});
	}

	const sorted = sort(combined).desc(
		(t) => t?.lastMessage?.createdAt || t?.updatedAt
	);

	return res.json(sorted);
};
