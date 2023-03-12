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

const emitMessage = async (msg, socket: Socket, e: string) => {
	if (msg.onModel === 'user') {
		socket.to(msg.to.toString()).emit(e, msg);
	} else {
		const group = await Group.findById(msg.to);
		if (!group) throw new NotFoundError('No Group Found');
		const len = group.members.length;
		const members = group.members;

		for (let i = 0; i < len; i++) {
			socket.to(members[i].user.toString()).emit(e, msg);
		}
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
