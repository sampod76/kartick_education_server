import { Model, Types } from 'mongoose';
import { ENUM_YN } from '../../../enums/globalEnums';
import { IUser } from '../user/user.interface';

export type UserName = {
  firstName: string;
  lastName: string;
};

export type IStudent = {
  name: UserName; //embedded object
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  email: string;
  additionalRole: string;
  phoneNumber?: string;
  address?: string;
  status: string;
  img?: string;
  userId?: string;
  author: Types.ObjectId | IUser | string;
  isDelete: ENUM_YN.NO | ENUM_YN.YES;
};

export type StudentModel = Model<IStudent, Record<string, unknown>>;

export type IStudentFilters = {
  searchTerm?: string;
  id?: string;
  gender?: string;
  dateOfBirth?: string;
  email?: string;
  delete?: 'yes' | 'no';
};
