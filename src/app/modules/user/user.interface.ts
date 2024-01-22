import { Model, Types } from 'mongoose';

import { IAdmin } from '../admin/admin.interface';
// import { IModerator } from '../moderator/moderator.interface';
import { IStatus } from '../../interface/globalTypes';
import { ISeller } from '../seller/seller.interface';
import { IStudent } from '../student/student.interface';
import { ITrainer } from '../trainer/trainer.interface';
export type IRole =
  | 'superAdmin'
  | 'admin'
  | 'moderator'
  | 'student'
  | 'seller'
  | 'trainer'
  | 'teacher';

export type IUserFilters = {
  searchTerm?: string;
  delete?: 'yes' | 'no';
  role?: string;
  multipleRole?: string;
  status?: IStatus;
  isDelete?: string;
  author?: string;
};

export type IUser = {
  role: string;
  email: string;
  password: string;
  status: IStatus;
  blockingTimeout?: number;
  //
  userId?: string;
  admin?: Types.ObjectId | IAdmin;
  student?: Types.ObjectId | IStudent;
  trainer?: Types.ObjectId | ITrainer;
  seller?: Types.ObjectId | ISeller;
  //
  moderator?: Types.ObjectId | IAdmin;
  superAdmin?: Types.ObjectId | IAdmin;
  teacher?: Types.ObjectId | IAdmin;
  //
  author: Types.ObjectId | IUser; // this is author mines which person create this account--> this is IUser
  isDelete: string;
};

// export type UserModel = Model<IUser, Record<string, unknown>>;
export type UserModel = {
  isUserExistMethod(
    email: string,
  ): Promise<
    Pick<IUser, 'email' | 'password' | 'role' | 'status' | 'blockingTimeout' |'userId'>
  >;
  isPasswordMatchMethod(
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean | null>;
} & Model<IUser>;
