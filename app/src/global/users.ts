
class OnlineUsers {
	private users = new Set();
	private static instance: OnlineUsers;

	private constructor() {}

	public static getInstance() {
		if (!OnlineUsers.instance) {
			OnlineUsers.instance = new OnlineUsers();
		}

		return OnlineUsers.instance;
	}

	public add(user: string) {
		this.users.add(user);
	}

	public remove(user: string) {
		this.users.delete(user);
	}

	public isOnline(user: string) {
		return this.users.has(user);
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