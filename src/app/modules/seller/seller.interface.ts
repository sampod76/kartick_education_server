import { Model } from 'mongoose';

export type UserName = {
  firstName: string;
  lastName: string;
};

export type ISeller = {
  name: UserName; //embedded object
  gender: 'male' | 'female';
  dateOfBirth: string;
  email: string;
  additionalRole: string;
  userId?: string;
  phoneNumber: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  address: string;
  img: string;
  details?: string;
  user_bio?: string;
  isDelete: string;
  status: string;
};

export type SellerModel = Model<ISeller, Record<string, unknown>>;

export type ISellerFilters = {
  searchTerm?: string;
  id?: string;
  bloodGroup?: string;
  email?: string;
  phoneNumber?: string;
  delete?: 'yes' | 'no';
  isDelete?: string;
  status?: 'active' | 'deactivate' | 'disabled' | 'block';
};
