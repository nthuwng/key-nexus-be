export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  roleId: {
    _id: string;
    name: string;
  };

  permissions?: {
    _id: string;
    key: string;
    method: string;
    module: string;
    description: string;
  }[];
}


export interface IUserProfile {
  _id: string;
  fullName: string;
  email: string
  gender: string;
  phone: string;
  status: string;
  roleId: {
    _id: string;
    name: string;
  };
  permissions?: {
    _id: string;
    key: string;
    method: string;
    module: string;
    description: string;
  }[];
}

//  _id: new ObjectId('69858b7c454b6325a001e42c'),
//   fullName: "I'm Normal User",
//   email: 'user@gmail.com',
//   gender: 'male',
//   phone: '0123456789',
//   status: 'ACTIVE',
//   tokenVersion: 0,
//   roleId: { _id: new ObjectId('69858b7c454b6325a001e427'), name: 'USER' },
//   isDeleted: false,
//   deletedAt: null,
//   __v: 0,
//   createdAt: 2026-02-06T06:34:36.361Z,
//   updatedAt: 2026-02-06T07:11:14.133Z,
//   refreshTokenHash: '$2b$10$vwXFao.yafBnvM9PMBEQeuyx2xks9M86pFrGBe3Eq6MMx4ewebhNK'