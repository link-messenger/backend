// TODO: sendMessage + deleteMessage + editMessage

import { Socket } from 'socket.io';
import { Message as MessageType } from '../constants';
import { NotFoundError } from '../errors';
import { Group, Message } from '../models';

interface IMessage {
	content: any;
	type: MessageType;
	to: string;
	model: 'group' | 'user';
}

// TODO: optimize query by moving map to db layer 
const emitMessage = async (msg, socket: Socket, e: string) => {
	if (msg.onModel === 'user') {
		console.log(msg);
		socket.to(msg.to.toString()).emit(e, msg);
	} else {
		const group = await Group.findById(msg.to);
		if (!group) throw new NotFoundError('No Group Found');
		const members = group.members.map(({ user }) => user.toString());
		socket.to(members).emit(e, msg);
	}
};

export const sendMesssage = async ({
	socket,
	uid,
	message,
}: {
	socket: Socket;
	uid: string;
	message: IMessage;
}) => {
	const msg = await (
		await Message.create({
			content: message.content,
			type: message.type,
			to: message.to,
			sender: uid,
			onModel: message.model,
		})
	).populate('sender');
	socket.emit('message-sent', msg);
	await emitMessage(msg, socket, 'recieve-message');
};

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
}) => {
	const msg = await Message.findOneAndDelete({
		_id: message.mid,
		to: message.to,
		sender: uid,
	});
	await emitMessage(msg, socket, 'delete-message');
};

interface IEditMessage {
	content: string;
	to: string;
	mid: string;
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
	await emitMessage(msg, socket, 'edit-message');
};
