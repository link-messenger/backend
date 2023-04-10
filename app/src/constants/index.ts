export enum Roles {
	ADMIN = 'ADMIN',
	USER = 'USER',
}

export enum GroupStatus {
	PRIVATE = 'PRIVATE',
	PUBLIC = 'PUBLIC',
}

export enum MessageType {
	FILE = 'FILE',
	TEXT = 'TEXT',
	IMAGE = 'IMAGE',
	VOICE = 'VOICE',
}

export enum MessageStatus {
	SEEN = 'seen',
	UNSEEN = 'unseen',
}

export enum UserStatus {
	UNVERIFIED = 'UNVERIFIED',
	VERIFIED = 'VERIFIED',
	DELETED = 'DELETED',
}
export enum UserActivityStatus {
	ONLINE = 'ONLINE',
	OFFLINE = 'OFFLINE',
	BUSY = 'BUSY',
}

export const MESSAGE_PER_PAGE = 100;
export type Model = 'group' | 'user';
export const OTP_LENGTH = 7;


export * from './events';
export * from './mails';
