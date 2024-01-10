import { Model, Types } from 'mongoose';
import { IMilestone } from '../milestone/milestone.interface';
import { IUser } from '../user/user.interface';
import { ICourse } from '../course/course.interface';
import { ICategory } from '../category/interface.category';


export type IModuleFilters = {
  searchTerm?: string;
  status?: string;
  milestone?: string;
  select?: string;
  delete?: "yes" | "no" ;
  lesson_quiz?: "yes" | "no" ;
  // other query parameters
};

export type IModuleSearchableField = {
  title?: string;
  details?: string;
};

export type IModule = {
  title: string;
  imgs?: string[];
  details?: string;
  short_description?: string;
  author?: Types.ObjectId | IUser;
  category: Types.ObjectId | ICategory | string;
  course: Types.ObjectId | ICourse | string;
  milestone: Types.ObjectId | IMilestone | string;
  status: 'active' | 'deactivate' | 'save';
  module_number?: number;
  demo_video?: Record<string, string>;
  tags?: string[];
};

export type ModuleModel = Model<IModule, Record<string, unknown>>;
