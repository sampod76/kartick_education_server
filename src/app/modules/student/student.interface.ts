import { Model } from 'mongoose';



export type UserName = {
  firstName: string;
  lastName: string;
};


export type IStudent = {
  name: UserName; //embedded object
  gender: 'male' | 'female';
  dateOfBirth: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  img?: string;
};


export type StudentModel = Model<IStudent, Record<string, unknown>>;

export type IStudentFilters = {
  searchTerm?: string;
  id?: string;
  gender?: string;
  dateOfBirth?: string;
};
