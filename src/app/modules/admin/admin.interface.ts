import { Model } from 'mongoose';

export type IAdmin = {
  name: string;
  profileImage?: string;
  dateOfBirth?: string;
  email: string;
  uid: string;
  phone: string;
  emergencyphone?: string;
  gender?: 'male' | 'female';
  address?: string;
  designation?: string;
  role?: string;
  status?: string;
};

export type AdminModel = Model<IAdmin, Record<string, unknown>>;

export type IAdminFilters = {
  searchTerm?: string;
  id?: string;
  email?: string;
  phone?: string;
  emergencyphone?: string;
  gender?: 'male' | 'female';
  designation?: string;
  status?: string;
};
