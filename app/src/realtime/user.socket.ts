import { Socket } from 'socket.io';
import { SOCKET_MESSAGE_EVENTS, UserActivityStatus } from '../constants';
import { onlineUsers } from '../global';

export const onUpdateUserStatus = async ({
	socket,
	uid,
	currentActive,
}: {
	socket: Socket;
	uid: string;
	currentActive: string;
}) => {
	onlineUsers.set({
		uid,
		currentActive,
	});
};

export const updateUserCurrentStatus = ({
	conversations,
	socket,
	status,
	userStatus,
}: {
	userStatus: UserActivityStatus;
	status: UserActivityStatus;
	conversations: (import('mongoose').Document<
		unknown,
		{},
		{ createdAt: NativeDate; updatedAt: NativeDate } & {
			users: import('mongoose').Types.ObjectId[];
		}
	> &
		Omit<
			{ createdAt: NativeDate; updatedAt: NativeDate } & {
				users: import('mongoose').Types.ObjectId[];
			} & { _id: import('mongoose').Types.ObjectId },
			never
		>)[];
	socket: Socket;
}) => {
	if (userStatus !== UserActivityStatus.OFFLINE) {
		for (const conversation of conversations) {
			socket
				.to(conversation.users[0].toString())
				.emit(SOCKET_MESSAGE_EVENTS['user.status'], {
					_id: conversation._id.toString(),
					status: status,
				});
		}
	}
};
