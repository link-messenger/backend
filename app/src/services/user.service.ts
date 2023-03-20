import { Model } from "../constants";
import { Conversation, Group } from "../models";

export const findRelatedUsers = async (model: Model, to: string, uid: string) => {
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
