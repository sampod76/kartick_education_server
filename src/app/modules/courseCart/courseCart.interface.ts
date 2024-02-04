import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type ICourseCartFilters = {
  searchTerm?: string;
  status?: string;
  course?: string;
  user?: string;
  delete?: 'yes' | 'no';
  isDelete?: string;
  // other query parameters
};

export type ICourseCart = {
  course: Types.ObjectId | IUser | string;
  user: Types.ObjectId | IUser |string;
  status: 'active' | 'deactivate' | 'save';
  isDelete: string;
};

export type CourseCartModel = Model<ICourseCart, Record<string, unknown>>;
