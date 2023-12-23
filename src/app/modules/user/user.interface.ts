import { Model, Types } from 'mongoose';

import { IAdmin } from '../admin/admin.interface';
// import { IModerator } from '../moderator/moderator.interface';
import { ISeller } from '../seller/seller.interface';
import { IStudent } from '../student/student.interface';
import { ITrainer } from '../trainer/trainer.interface';
export type IRole = 'super_admin' | 'admin' | 'moderator' | 'student' | 'seller' |'trainer' |'teacher';

export type IStudentFilters = {
  searchTerm?: string;
  delete?: 'yes' | 'no';
  role?: IRole;
};


export type IUser = {
  role: string;
  email: string;
  password: string;
  status: 'active' | 'deactivate' | 'disabled' | 'block';
  blockingTimeout?: number;
  //
  admin?: Types.ObjectId | IAdmin;
  student?: Types.ObjectId | IStudent;
  trainer?: Types.ObjectId | ITrainer;
  seller?: Types.ObjectId | ISeller;
  //
  moderator?: Types.ObjectId | IAdmin;
  superAdmin?: Types.ObjectId | IAdmin;
  teacher?: Types.ObjectId | IAdmin;
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
