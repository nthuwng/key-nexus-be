export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  role: {
    _id: string;
    name: string;
  };
}
