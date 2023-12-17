import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';
import { IMilestone } from '../milestone/milestone.interface';


export type IModuleFilters = {
  searchTerm?: string;
  status?: string;
  select?: string;
  
  // other query parameters
};

export type IModuleSearchableField = {
  title?: string;
  details?: string;
};

export type IModule = {
  title: string;
  img?: string;
  details?: string;
  author?: Types.ObjectId | IUser;
  milestone: Types.ObjectId | IMilestone | string;
  status: 'active' | 'deactivate' | 'save';
  module_number?: number;
  demo_video?: Record<string, string>;
  tags?: string[];
};

export type ModuleModel = Model<IModule, Record<string, unknown>>;
