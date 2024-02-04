import { Model } from 'mongoose';


export type UserName = {
  firstName: string;
  lastName: string;
};

export type ITrainer = {
  name: UserName; //embedded object
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  userId?: string;
  address?: string;
  img?: string;
  details?: string;
  user_bio?: string;
};

export type TrainerModel = Model<ITrainer, Record<string, unknown>>;

export type ITrainerFilters = {
  searchTerm?: string;
  id?: string;
  bloodGroup?: string;
  email?: string;
  phoneNumber?: string;
  delete?: 'yes' | 'no';
};
