// TODO: Add user + remove user

import { Socket } from 'socket.io';
import { getRedisClient } from '../config';
import { SOCKET_MESSAGE_EVENTS } from '../constants';
import { NotFoundError } from '../errors';
import { Group } from '../models';

interface IGroupUser {
	socket: Socket;
	uid: string;
	grpid: string;
}

const emitToGrp = (grp, usr, socket: Socket, e: string) => {
	const members = grp.members.map(({ user }) => {
		if(user._id === usr._id) return;
		return user.toString();
	});
	socket.to(members).emit(e, { group: grp, user: usr });
};

export const joinUserGroup = async ({ socket, grpid, uid }: IGroupUser) => {
	const grp = await Group.findOneAndUpdate(
		{
			_id: grpid,
			members: {
				$not: {
					$elemMatch: {
						user: uid,
					},
				},
			},
		},
		{
			$push: {
				members: [
					{
						user: uid,
					},
				],
			},
		},
		{
			new: true,
		}
	);
	if (!grp) {
		const isJoined = await Group.findOne({
			_id: grpid,
			members: {
				$elemMatch: {
					user: uid,
				},
			},
		});
		if (!isJoined) {
			console.error('not found');
			return;
		}
		return socket.emit(SOCKET_MESSAGE_EVENTS['group.alreadyJoined'], isJoined);
	}
	const redis = getRedisClient();
	const user = await redis.get(uid);
	socket.emit(SOCKET_MESSAGE_EVENTS['group.joinConfirm'], grp);
	emitToGrp(grp, JSON.parse(user ?? ''), socket, SOCKET_MESSAGE_EVENTS['group.joined']);
};

export const leaveUserGroup = async ({ socket, grpid, uid }: IGroupUser) => {
	const grp = await Group.findByIdAndUpdate(
		grpid,
		{
			$pull: {
				members: {
					user: uid,
				}
			},
		},
		{
			new: true,
		}
	);
	const redis = getRedisClient();
	const user = await redis.get(uid);
	socket.emit(SOCKET_MESSAGE_EVENTS['group.leftConfirm'], grp);
	emitToGrp(grp, JSON.parse(user ?? ''), socket, SOCKET_MESSAGE_EVENTS['group.left']);
};
