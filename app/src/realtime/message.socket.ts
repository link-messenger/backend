import { Socket } from 'socket.io';
import { Message as MessageType, Model, MessegeStatus } from '../constants';
import { Message } from '../models';
import { findRelatedUsers } from '../services';
import { onlineUsers } from '../global';

interface IMessage {
	content: any;
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
	let status: MessegeStatus = 'unseen';
	const members = await findRelatedUsers(message.model, message.to, uid);
	if (!members.length) return socket.emit('error', 'something went wrong');
	if (members.some((member) => onlineUsers.isOnline(member))) status = 'seen';

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

	socket.emit('message-sent', msg);
	socket.to(members).emit('recieve-message', msg);
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
	if (!members.length) return socket.emit('error', 'something went wrong');

	const msg = await Message.findOneAndDelete({
		_id: message.mid,
		to: message.to,
		sender: uid,
	});

	socket.to(members).emit('delete-message', msg);
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
	if (!members.length) return socket.emit('error', 'something went wrong');
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
	socket.emit('message-edited', msg);
	socket.to(members).emit('edit-message', msg);
};
