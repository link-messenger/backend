import { Request, Response } from 'express';
import { GroupStatus } from '../constants';
import { Group, User } from '../models';

export const searchChatController = async (req: Request, res: Response) => {
	const { name } = req.query;
	const groups = await Group.find({
		$or: [
			{
				status: GroupStatus.PUBLIC,
				name: {
					$regex: '.*' + name + '.*',
					$options: 'i'
				},
			},
			{
				link: name,
			},
		],
	});
	const users = await User.find({
		$or: [
			{
				name: {
					$regex: '.*' + name + '.*',
				},
			},
			{
				username: {
					$regex: '.*' + name + '.*',
				},
			},
		],
	});
	const trimmedG = groups.map((group) => ({
		_id: group._id,
		name: group.name,
		link: group.link,
		description: group.description,
		createdAt: group.createdAt,
		updatedAt: group.updatedAt,
		members: [],
		type: 'group',
	}));
	const trimmedU = users.map((user) => ({
		_id: user._id,
		name: user.name,
		username: user.username,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
		type: 'user',
	}));
	return res.status(200).json({
		groups: trimmedG,
		users: trimmedU,
	});
};
