import { Model, Types } from 'mongoose';

import { IPackage } from '../package/package.interface';
import { IUser } from '../user/user.interface';
import { ICourse } from '../course/course.interface';

export type IStudentPurchasePackageCourseFilters = {
  searchTerm?: string;
  status?: string;
  select?: string;
  package?: string;
  user?: string;
  //
  delete?: 'yes' | 'no';
  isDelete?: string;
};

export type IStudentPurchasePackageCourseSearchableField = {
  title?: string;
};

export type IStudentPurchasePackageCourse = {
  course: Types.ObjectId | ICourse | string;
  package: Types.ObjectId | IPackage | string;
  user: Types.ObjectId | IUser | string;
  author: Types.ObjectId | IUser | string;
  status: 'active' | 'deactivate' | 'save';
  isDelete: string;
};

export type StudentPurchasePackageCourseModel = Model<
  IStudentPurchasePackageCourse,
  Record<string, unknown>
>;
