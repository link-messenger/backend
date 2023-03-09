// TODO: sendMessage + deleteMessage + editMessage

import { Socket } from 'socket.io';

interface IMessage {
	conent: any;
	type: 'message' | 'file' | 'image';
	to: string;
}

export const sendMesssage = async ({
	socket,
	uid,
	message,
}: {
	socket: Socket;
	uid: string;
	message: IMessage;
}) => {};

interface IDeleteMessage {
	mid: string;
	to: string;
}
export const deleteMessage = async ({
	socket,
	uid,
	message,
}: {
	socket: Socket;
	uid: string;
	message: IDeleteMessage;
}) => {};

interface IEditMessage extends IMessage {
	mid: string;
}
export const editMessage = async ({
	socket,
	uid,
	message,
}: {
	socket: Socket;
	uid: string;
	message: IEditMessage;
}) => {};
