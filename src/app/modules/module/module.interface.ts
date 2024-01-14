import { Model, Types } from 'mongoose';
import { IMilestone } from '../milestone/milestone.interface';
import { IUser } from '../user/user.interface';
import { ICourse } from '../course/course.interface';
import { ICategory } from '../category/interface.category';


export type IModuleFilters = {
  searchTerm?: string;
  status?: string;
  category?: string;
  course?: string;
  milestone?: string;

  select?: string;
  delete?: "yes" | "no" ;
  lesson_quiz?: "yes" | "no" ;
  isDelete?: string;
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
  //
  category: Types.ObjectId | ICategory | string;
  course: Types.ObjectId | ICourse | string;
  milestone: Types.ObjectId | IMilestone | string;
  //
  status: 'active' | 'deactivate' | 'save';
  isDelete: boolean;
  module_number?: number;
  demo_video?: Record<string, string>;
  tags?: string[];
};

export type ModuleModel = Model<IModule, Record<string, unknown>>;
