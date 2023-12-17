import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

import { IModule } from '../module/module.interface';

export type ILessonFilters = {
  searchTerm?: string;
  status?: string;
  select?: string;
  module?: string;
  // other query parameters
};

export type ILessonSearchableField = {
  title?: string;
  details?: string;
};

export type ILesson = {
  title: string;
  img?: string;
  details?: string;
  lecture: number;
  lesson_number: number;
  author?: Types.ObjectId | IUser;
  module: Types.ObjectId | IModule | string;
  status: 'active' | 'deactivate' | 'save';
  demo_video?: Record<string, string>;
  video?: string;
  tags?: string[];
};

export type LessonModel = Model<ILesson, Record<string, unknown>>;
