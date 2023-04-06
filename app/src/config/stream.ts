import { Socket } from 'socket.io';
import { getRedisClient } from '.';
import { activeStreams, StreamServer } from '../global';
import { generateRedisTokenName, getStreamKey } from '../utils';

export const configStream = () => {
	const server = StreamServer.getInstance().getServer();

	server.on('prePublish', async (id, streamPath, args) => {
		const session = server.getSession(id);
		const key = getStreamKey(streamPath);
		if (!key) {
			// @ts-expect-error
			return session.reject();
		}
		const stream = activeStreams.getStream(key);
		if (!stream || stream.status === 'active') {
			// @ts-expect-error
			return session.reject();
		}

		activeStreams.add(key, {
			id: stream.id,
			status: 'active',
		});
		console.log(
			`[NodeEvent on prePublish] stream with id=${stream.id} and key=${key} has started`
		);
	});

	server.on('donePublish', (id, streamPath, args) => {
		const key = getStreamKey(streamPath) as string;
		activeStreams.remove(key);
		console.log(`[NodeEvent on prePublish] key=${key} has been destroyed`);
	});
};

export const onConnectStream = async (socket: Socket) => {
	const uid: string = socket.handshake.auth.id;
	const redis = getRedisClient();
	const tokenIsValid = await redis.get(generateRedisTokenName(uid));
	if (!tokenIsValid) {
		console.log('Invalid Token');
		socket.emit('error', 'Invalid Token');
		socket.disconnect();
	}
	const unParsedUser = await redis.get(uid);
	if (!unParsedUser) {
		console.log('Invalid User');
		socket.emit('error', 'Invalid User');
		socket.disconnect();
		return;
	}
	const user = JSON.parse(unParsedUser);
	socket
		.on('join-stream', async (key) => {
			const isOnline = activeStreams.getStatus(key) === 'active';
			if (!isOnline) {
				return;
			}
			socket.join(key);
			const num = await redis.incr(key);
			socket.to(key).emit('viewer-update', num);
		})
		.on('leave-stream', async (key) => {
			const isOnline = activeStreams.getStatus(key) === 'active';
			if (!isOnline) {
				return;
			}
			socket.leave(key);
			const num = await redis.decr(key);
			socket.to(key).emit('viewer-update', num);
		})
		.on('stream-message', async (key, message) => {
			const isOnline = activeStreams.getStatus(key) === 'active';
			if (!isOnline) {
				return;
			}
			socket.to(key).emit('stream-message', {
				message,
				user: {
					username: user.username,
					_id: user._id,
				},
			});
		})
		.on('viewer-count', async(key) => { 
			const isOnline = activeStreams.getStatus(key) === 'active';
			if (!isOnline) {
				return;
			}
			const num = await redis.get(key);
			socket.emit('viewer-update', parseInt(num || '0'));
		});
};
