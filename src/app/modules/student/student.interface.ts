import { Model, Types } from 'mongoose';

import { ICourse } from '../course/course.interface';

export type UserName = {
  firstName: string;
  lastName: string;
  middleName?: string;
};


export type IStudent = {
  name: UserName; //embedded object
  gender: 'male' | 'female';
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  address: string;
  courseId?: Types.ObjectId | ICourse 
  img?: string;
};


export type StudentModel = Model<IStudent, Record<string, unknown>>;

export type IStudentFilters = {
  searchTerm?: string;
  id?: string;
  bloodGroup?: string;
  email?: string;
  phoneNumber?: string;
};
