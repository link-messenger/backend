import { Request, Response } from 'express';
import { NotFoundError, ServerError, UnauthorizedError } from '../errors';
import { onlineUsers } from '../global';
import { hasUser } from '../guards/server.guard';
import { User } from '../models';

export const getUserProfile = async (req: Request, res: Response) => {
	if (!hasUser(req)) throw new ServerError('oops! something went wrong');
	const { id } = req.user;

	const user = await User.findById(id, {
		password: false,
		email: false,
	});

	if (!user) throw new NotFoundError("user doesn't exist!");
	const status = onlineUsers.isOnline(user._id.toString())
		? 'online'
		: 'offline';

	res.json({
		_id: user.id,
		name: user.name,
		username: user.username,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
		avatar: user.avatar,
		status,
	});
};
