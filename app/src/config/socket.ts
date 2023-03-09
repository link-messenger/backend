import { Socket } from 'socket.io';
import { deleteMessage, editMessage, sendMesssage } from '../realtime';

export const onConnnect = async (socket: Socket) => {
	const uid: string = socket.handshake.auth.id;
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
		);
};
