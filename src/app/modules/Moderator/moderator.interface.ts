import { Model, Types } from 'mongoose';
import { ICourse } from '../course/course.interface';


export type UserName = {
  firstName: string;
  lastName: string;
  middleName?: string;
};

export type IModerator = {
  name: UserName; //embedded object
  gender: 'male' | 'female';
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  address: string;
  courseId: Types.ObjectId | ICourse
  img: string;
};

export type ModeratorModel = Model<IModerator, Record<string, unknown>>;

export type IModeratorFilters = {
  searchTerm?: string;
  id?: string;
  bloodGroup?: string;
  email?: string;
  phoneNumber?: string;
};
