import { Socket } from 'socket.io';
import { SOCKET_MESSAGE_EVENTS, UserActivityStatus } from '../constants';
import { onlineUsers } from '../global';
import { Conversation, User } from '../models';
import {
	deleteMessage,
	editMessage,
	joinUserGroup,
	leaveUserGroup,
	onConversationCreate,
	onUpdateUserStatus,
	sendMesssage,
	updateUserCurrentStatus,
} from '../realtime';
import { generateRedisTokenName } from '../utils';
import { getRedisClient } from './db';

export const onConnnect = async (socket: Socket) => {
	const uid: string = socket.handshake.auth.id;
	const token = socket.handshake.auth.token;
	const redis = getRedisClient();
	const tokenIsValid = await redis.get(generateRedisTokenName(uid));
	if (!tokenIsValid && token === tokenIsValid) {
		console.log('Invalid Token');
		socket.emit(SOCKET_MESSAGE_EVENTS.error, 'Invalid Token');
		socket.disconnect();
		return;
	}
	socket.join(uid);
	const user = await User.findById(uid);
	if (!user) {
		console.log('Invalid User');
		socket.emit(SOCKET_MESSAGE_EVENTS.error, 'Invalid User');
		socket.disconnect();
		return;
	}

	onlineUsers.set({
		uid,
		currentActive: '',
	});

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

	updateUserCurrentStatus({
		conversations,
		socket,
		status: user.activityStatus as UserActivityStatus,
		userStatus: user.activityStatus as UserActivityStatus,
	});

	socket
		.on(SOCKET_MESSAGE_EVENTS['message.send'], (message) =>
			sendMesssage({
				socket,
				message,
				uid,
			})
		)
		.on(SOCKET_MESSAGE_EVENTS['message.delete'], (message) =>
			deleteMessage({
				socket,
				message,
				uid,
			})
		)
		.on(SOCKET_MESSAGE_EVENTS['message.edit'], (message) =>
			editMessage({
				socket,
				message,
				uid,
			})
		)
		.on(
			SOCKET_MESSAGE_EVENTS['user.updateStatus'],
			(currentActive: UserActivityStatus) =>
				onUpdateUserStatus({ uid, currentActive, socket })
		)
		.on(SOCKET_MESSAGE_EVENTS['group.join'], (gid) =>
			joinUserGroup({ socket, grpid: gid, uid })
		)
		.on(SOCKET_MESSAGE_EVENTS['group.leave'], (gid) =>
			leaveUserGroup({ socket, grpid: gid, uid })
		)
		.on(SOCKET_MESSAGE_EVENTS['conversation.create'], (conversation, to) =>
			onConversationCreate({
				conversation,
				socket,
				to,
			})
		)
		.on(SOCKET_MESSAGE_EVENTS.disconnect, async () => {
			updateUserCurrentStatus({
				conversations,
				socket,
				status: UserActivityStatus.OFFLINE,
				userStatus: user.activityStatus as UserActivityStatus,
			});
			console.log(onlineUsers.getOnlineUsers());
			onlineUsers.remove(uid);
			socket.leave(uid);
		});
};
