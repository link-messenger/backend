import { Socket } from 'socket.io';
import { onlineUsers } from '../global';
import { Conversation, User } from '../models';
import {
	deleteMessage,
	editMessage,
	joinUserGroup,
	leaveUserGroup,
	sendMesssage,
} from '../realtime';
import { generateRedisTokenName } from '../utils';
import { getRedisClient } from './db';

export const onConnnect = async (socket: Socket) => {
	const uid: string = socket.handshake.auth.id;
	const redis = getRedisClient();
	const tokenIsValid = await redis.get(generateRedisTokenName(uid));
	if (!tokenIsValid) {
		console.log('Invalid Token');
		socket.emit('error', 'Invalid Token');
		socket.disconnect();
	}
	socket.join(uid);
	onlineUsers.add(uid);
	console.log(onlineUsers.getOnlineUsers());
	const conversations = await Conversation.find(
		{
			users: {
				$elemMatch: {
					$eq: uid,
				},
			},
		},
		{
			_id: true,
			users: true,
		}
	).select({
		users: {
			$elemMatch: {
				$ne: uid,
			},
		},
	});
		for (const conversation of conversations) {
			socket
				.to(conversation.users[0].toString())
				.emit('user-status', {
					_id: conversation._id.toString(),
					status: 'online',
				});
		}

	socket
		.on('send-message', (message) =>
			sendMesssage({
				socket,
				message,
				uid,
			})
		)
		.on('delete-message', (message) =>
			deleteMessage({
				socket,
				message,
				uid,
			})
		)
		.on('edit-message', (message) =>
			editMessage({
				socket,
				message,
				uid,
			})
		)
		.on('join-group', (gid) => joinUserGroup({ socket, grpid: gid, uid }))
		.on('leave-group', (gid) => leaveUserGroup({ socket, grpid: gid, uid }))
		.on('disconnect', async () => {
			for (const conversation of conversations) {
				socket
					.to(conversation.users[0].toString())
					.emit('user-status', {_id:conversation._id.toString(), status: 'offline'});
			}
			console.log(onlineUsers.getOnlineUsers());
			onlineUsers.remove(uid);
			socket.leave(uid);
		});
};
