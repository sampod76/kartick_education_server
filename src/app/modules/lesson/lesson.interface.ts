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
  author?: Types.ObjectId | IUser;
  module: Types.ObjectId | IModule | string;
  status: 'active' | 'deactivate' | 'save';
  module_number?: number;
  demo_video?: Record<string, string>;
  tags?: string[];
};

export type ModuleModel = Model<IModule, Record<string, unknown>>;
