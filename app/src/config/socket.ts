import { Socket } from 'socket.io';
import { UnauthorizedError } from '../errors';
import { deleteMessage, editMessage, sendMesssage } from '../realtime';
import { generateRedisTokenName } from '../utils';
import { getRedisClient } from './db';

export const onConnnect = async (socket: Socket) => {
	const uid: string = socket.handshake.auth.id;
	const redis = getRedisClient();
	const tokenIsValid = await redis.get(generateRedisTokenName(uid));
	await redis.incr('user-counter');
	if (!tokenIsValid) throw new UnauthorizedError('Invalid Token');
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
		.on('disconnect', async () => {
			await redis.decr('user-counter');
		});
};
