import { Model, Types } from 'mongoose';
import { IGender, IStatus } from '../../interface/globalTypes';

export type UserName = {
  firstName: string;
  lastName: string;
};

export type IAdmin = {
  name: UserName; //embedded object
  gender: IGender;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  address: string;
  courseId: Types.ObjectId;
  img: string;
};

export type AdminModel = Model<IAdmin, Record<string, unknown>>;

export type IAdminFilters = {
  searchTerm?: string;
  id?: string;
  bloodGroup?: string;
  email?: string;
  phoneNumber?: string;
  delete?: 'yes' | 'no';
  status?: IStatus;
  select?: string;
};
