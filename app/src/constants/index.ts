
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
