export interface IUser {
  id: number;
  email: string;
  fullName: string;
  role: string;
  avatar: string;
}

export interface IUserDecorator {
  userId: number;
  email: string;
  role: string;
  fullName: string;
}

export interface ILogin {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}
