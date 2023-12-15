import { Model, Types } from 'mongoose';


export type UserName = {
  firstName: string;
  lastName: string;
  middleName: string;
};

export type IAdmin = {
  name: UserName; //embedded object
  gender: 'male' | 'female';
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  address: string;
  courseId: Types.ObjectId 
  img: string;
};

export type AdminModel = Model<IAdmin, Record<string, unknown>>;

export type IAdminFilters = {
  searchTerm?: string;
  id?: string;
  bloodGroup?: string;
  email?: string;
  phoneNumber?: string;
};
