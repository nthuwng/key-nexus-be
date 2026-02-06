export const INIT_PERMISSIONS = [
  // Module USERS
  {
    name: 'Create User',
    key: 'users.create',
    method: 'POST',
    module: 'USERS',
    description: 'Cho phép tạo mới người dùng',
  },
  {
    name: 'Update User',
    key: 'users.update',
    method: 'PATCH',
    module: 'USERS',
    description: 'Cho phép cập nhật thông tin người dùng',
  },
  {
    name: 'View Users',
    key: 'users.view',
    method: 'GET',
    module: 'USERS',
    description: 'Cho phép xem danh sách người dùng',
  },
  {
    name: 'Detail Users',
    key: 'users.detail',
    method: 'GET',
    module: 'USERS',
    description: 'Cho phép xem chi tiết người dùng',
  },
  {
    name: 'Delete User',
    key: 'users.delete',
    method: 'DELETE',
    module: 'USERS',
    description: 'Cho phép xóa người dùng',
  },

  // Module ROLES
  {
    name: 'Create Role',
    key: 'roles.create',
    method: 'POST',
    module: 'ROLES',
    description: 'Cho phép tạo mới vai trò',
  },
  {
    name: 'View Roles',
    key: 'roles.view',
    method: 'GET',
    module: 'ROLES',
    description: 'Cho phép xem danh sách vai trò',
  },

  // Module PERMISSIONS
  {
    name: 'View Permissions',
    key: 'permissions.view',
    method: 'GET',
    module: 'PERMISSIONS',
    description: 'Cho phép xem danh sách quyền',
  },
];

export const SUPER_ADMIN_ROLE = 'SUPER_ADMIN';
export const USER_ROLE = 'USER';
