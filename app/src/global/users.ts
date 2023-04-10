
type UserStatus = {
	uid: string;
	currentActive: string;
}

class OnlineUsers {
	private users = new Map<string, string>();
	private static instance: OnlineUsers;

	private constructor() {}

	public static getInstance() {
		if (!OnlineUsers.instance) {
			OnlineUsers.instance = new OnlineUsers();
		}

		return OnlineUsers.instance;
	}

	public set(user: UserStatus) {
		this.users.set(user.uid, user.currentActive);
	}

	public remove(user: string) {
		this.users.delete(user);
	}

	public isOnline(user: string) {
		return this.users.has(user);
	}

	public isCurrentOnline(user: UserStatus) {
		const online = this.users.get(user.uid);
		return !!online && online === user.currentActive;
	}

	public getOnlineUsers() {
		return this.users;
	}

	public getOnlineUsersCount() {
		return this.users.size;
	}

	public clear() {
		this.users.clear();
	}
}


export const onlineUsers = OnlineUsers.getInstance();