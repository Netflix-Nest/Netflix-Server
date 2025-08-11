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

export enum TokenType {
  VERIFY_ACCOUNT = 'VERIFY_ACCOUNT',
  RESET_PASSWORD = 'RESET_PASSWORD',
  OTHER = 'OTHER',
}

export enum StatusUser {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  BANNED = 'BANNED',
}
