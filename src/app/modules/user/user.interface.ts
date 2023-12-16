import { Model, Types } from 'mongoose';

import { IModerator } from '../Moderator/moderator.interface';
import { IAdmin } from '../admin/admin.interface';
import { IStudent } from '../student/student.interface';

export type IUser = {
  role: string;
  email: string;
  password: string;
  student?: Types.ObjectId | IStudent;
  moderator?: Types.ObjectId | IModerator;
  admin?: Types.ObjectId | IAdmin;
};
// export type UserModel = Model<IUser, Record<string, unknown>>;

export type UserModel = {
  isUserExistMethod(
    email: string
  ): Promise<Pick<IUser, 'email' | 'password' | 'role'>>;
  isPasswordMatchMethod(
    oldPassword: string,
    newPassword: string
  ): Promise<boolean | null>;
} & Model<IUser>;
