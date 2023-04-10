import { Model,  UserActivityStatus } from '../constants';
import { NotFoundError } from '../errors';
import { onlineUsers } from '../global';
import { Conversation, Group, User } from '../models';

export const findRelatedUsers = async (
	model: Model,
	to: string,
	uid: string
) => {
	let members: string[] = [];
	if (model === 'group') {
		const group = await Group.findById(to);
		if (!group) return [];
		for (const member of group.members) {
			if (member.user.toString() === uid) continue;
			members.push(member.user.toString());
		}
		return members;
	}

	const conv = await Conversation.findById(to);
	if (!conv) return [];
	for (const member of conv.users) {
		if (member.toString() === uid) continue;
		members.push(member.toString());
	}
	return members;
};

export const setUserCurrentStatus = async (
	status: UserActivityStatus,
	uid: string
) => {
	const userUpdated = await User.findByIdAndUpdate(uid, {
		$set: {
			activityStatus: status,
		},
	});
};

export const getUserCurrentStatus = async (currentId: string, uid: string) => {
	const user = await User.findById(uid);
	if (!user) throw new NotFoundError('user was not found');
	const status = onlineUsers.isCurrentOnline({
		currentActive: currentId,
		uid,
	});

	return status ? user.activityStatus : UserActivityStatus.OFFLINE;
};
