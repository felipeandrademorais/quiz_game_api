import { Role } from '@prisma/client';

export interface IUser {
  id: string;
  username: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserWithPassword extends IUser {
  password: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
}
