import { Model, Types } from 'mongoose';

import { IAdmin } from '../admin/admin.interface';
import { IStudent } from '../student/student.interface';
import { IModerator } from '../Moderator/moderator.interface';

export type IUser = {
  role: string;
  email: string;
  password: string;
  student?: Types.ObjectId | IStudent;
  moderator?: Types.ObjectId | IModerator;
  admin?: Types.ObjectId | IAdmin;
};
export type UserModel = Model<IUser, Record<string, unknown>>;
