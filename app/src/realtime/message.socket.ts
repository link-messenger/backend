import { Socket } from 'socket.io';
import { MessageType, MessageStatus, Model, SOCKET_MESSAGE_EVENTS } from '../constants';
import { Message } from '../models';
import { findRelatedUsers } from '../services';
import { onlineUsers } from '../global';

interface IMessage {
	content: string;
	type: MessageType;
	to: string;
	model: Model;
}

export const sendMesssage = async ({
	socket,
	uid,
	message,
}: {
	socket: Socket;
	uid: string;
	message: IMessage;
}) => {
	if (message.content.trim().length === 0) return;
	let status = MessageStatus.UNSEEN;
	const members = await findRelatedUsers(message.model, message.to, uid);
	if (
		members.some((member) =>
			onlineUsers.isCurrentOnline({
				uid: member,
				currentActive: message.to,
			})
		)
	)
		status = MessageStatus.SEEN;

	const msgC = await Message.create({
		content: message.content,
		type: message.type,
		to: message.to,
		sender: uid,
		onModel: message.model,
		status: status,
	});
	msgC.save();
	const msg = await Message.findById(msgC._id).populate('sender');

	socket.emit(SOCKET_MESSAGE_EVENTS['message.sendConf'], msg);
	socket.to(members).emit(SOCKET_MESSAGE_EVENTS['message.recieve'], msg);
};

interface IDeleteMessage {
	mid: string;
	to: string;
	model: Model;
}
export const deleteMessage = async ({
	socket,
	uid,
	message,
}: {
	socket: Socket;
	uid: string;
	message: IDeleteMessage;
}) => {
	const members = await findRelatedUsers(message.model, message.to, uid);

	const msg = await Message.findOneAndDelete({
		_id: message.mid,
		to: message.to,
		sender: uid,
	});

	socket.emit(SOCKET_MESSAGE_EVENTS['message.deleteConf'], msg);
	socket.to(members).emit(SOCKET_MESSAGE_EVENTS['message.delete'], msg);
};

interface IEditMessage {
	content: string;
	to: string;
	mid: string;
	model: Model;
}

// TODO: complete this part!
export const editMessage = async ({
	socket,
	uid,
	message,
}: {
	socket: Socket;
	uid: string;
	message: IEditMessage;
}) => {
	const members = await findRelatedUsers(message.model, message.to, uid);
	const msg = await Message.findOneAndUpdate(
		{
			_id: message.mid,
			to: message.to,
			sender: uid,
		},
		{
			content: message.content,
		}
	);
	socket.emit(SOCKET_MESSAGE_EVENTS['message.editConf'], msg);
	socket.to(members).emit(SOCKET_MESSAGE_EVENTS['message.edit'], msg);
};
