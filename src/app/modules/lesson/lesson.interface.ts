import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

import { IModule } from '../module/module.interface';
import { ICategory } from '../category/interface.category';
import { ICourse } from '../course/course.interface';
import { IMilestone } from '../milestone/milestone.interface';

export type ILessonFilters = {
  searchTerm?: string;
  status?: string;
  select?: string;
  //
  category?: string;
  course?: string;
  milestone?: string;
  module?: string;
  //
  delete?: "yes" | "no" ;
  isDelete?: string;
  // other query parameters
};

export type ILessonSearchableField = {
  title?: string;
  details?: string;
};

export type ILesson = {
  title: string;
  imgs?: string[];
  details?: string;
  short_description?: string;
  lecture: number;
  lesson_number: number;
  author?: Types.ObjectId | IUser;
  category: Types.ObjectId | ICategory | string;
  course: Types.ObjectId | ICourse | string;
  milestone: Types.ObjectId | IMilestone | string;
  module: Types.ObjectId | IModule | string;
  status: 'active' | 'deactivate' | 'save';
  isDelete: boolean;
  demo_video?: Record<string, string>;
  videos?: object[];
  tags?: string[];
};

export type LessonModel = Model<ILesson, Record<string, unknown>>;
