import { Socket } from 'socket.io';
import { UnauthorizedError } from '../errors';
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
		console.log('InvalidToken');
		socket.to(uid).emit('error', 'Invalid Token');
		socket.disconnect();
	}
	await redis.incr('user-counter');
	socket.join(uid);
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
			await redis.decr('user-counter');
		});
};
