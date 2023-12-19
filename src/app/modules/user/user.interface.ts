import { Model, Types } from 'mongoose';

import { IAdmin } from '../admin/admin.interface';
import { IModerator } from '../moderator/moderator.interface';
import { IStudent } from '../student/student.interface';

export type IUser = {
  role: string;
  email: string;
  password: string;
  status: 'active' | 'deactivate' | 'disabled' | 'block';
  blockingTimeout?: number;
  student?: Types.ObjectId | IStudent;
  moderator?: Types.ObjectId | IModerator;
  superAdmin?: Types.ObjectId | IAdmin;
  admin?: Types.ObjectId | IAdmin;
  trainer?: Types.ObjectId | IAdmin;
  teacher?: Types.ObjectId | IAdmin;
  seller?: Types.ObjectId | IAdmin;
};
// export type UserModel = Model<IUser, Record<string, unknown>>;

export type UserModel = {
  isUserExistMethod(
    email: string
  ): Promise<
    Pick<IUser, 'email' | 'password' | 'role' | 'status' | 'blockingTimeout'>
  >;
  isPasswordMatchMethod(
    oldPassword: string,
    newPassword: string
  ): Promise<boolean | null>;
} & Model<IUser>;
