import { Model } from 'mongoose';

export type UserName = {
  firstName: string;
  lastName: string;
};

export type ITrainer = {
  name: UserName; //embedded object
  gender: 'male' | 'female';
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  address: string;
  img: string;
  details?: string;
};

export type TrainerModel = Model<ITrainer, Record<string, unknown>>;

export type ITrainerFilters = {
  searchTerm?: string;
  id?: string;
  bloodGroup?: string;
  email?: string;
  phoneNumber?: string;
  delete?: 'yes' | 'no';
  status?:'active' | 'deactivate' | 'disabled' | 'block'
};
