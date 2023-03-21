
export type Roles = 'ADMIN'| 'USER';

export const ROLESMAP = {
  admin: 'ADMIN',
  user: 'USER',
}
export const ROLES = Object.values(ROLESMAP);

export type GroupStatus = 'PRIVATE' | 'PUBLIC';

export const GROUP_STATUS_MAP = {
  private: 'PRIVATE',
  public: 'PUBLIC',
};
export const GROUP_STATUS = Object.values(GROUP_STATUS_MAP)


export type Message = 'FILE' | 'MESSAGE' | 'IMAGE' | 'VOICE';

export const MESSAGE_TYPE_MAP = {
  file: 'FILE',
  message: 'MESSAGE',
  image: 'IMAGE',
  voice: 'VOICE'
};

export const MESSAGE_TYPE = Object.values(MESSAGE_TYPE_MAP);

export const MESSAGE_PER_PAGE = 100;

export type Model = 'group' | 'user';
export type MessegeStatus = 'seen' | 'unseen';

export const MESSAGE_STATUS = ['seen', 'unseen']

export const OTP_LENGTH = 7;

export * from './mails';