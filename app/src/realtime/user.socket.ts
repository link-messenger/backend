import { Socket } from "socket.io";
import { Model } from "../constants";
import { onlineUsers } from "../global";
import { findRelatedUsers } from "../services";


interface IOnlineUser {
	type: Model;
	id: string;
}



export const onlineUser = async ({
	socket,
	uid,
	user,
}: {
	socket: Socket;
	uid: string;
	user: IOnlineUser;
}) => {
	const members = await findRelatedUsers(user.type, user.id, uid);
	if (!members.length) return socket.emit('error', 'something went wrong');

	onlineUsers.add(user.id);
	socket.to(members).emit('user-online', user.id);
};
