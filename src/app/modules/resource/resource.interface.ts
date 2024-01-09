import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

import { IModule } from '../module/module.interface';

export type IResourceFilters = {
  searchTerm?: string;
  status?: string;
  select?: string;
  module?: string;
  delete?: "yes" | "no" ;
  // other query parameters
};

export type IResourceSearchableField = {
  title?: string;
  short_description?: string;
};

export type IResource = {
  title: string;
  imgs?: string[];
  details?: string;
  short_description?: string;
  
  author?: Types.ObjectId | IUser;
  module: Types.ObjectId | IModule | string;
  status: 'active' | 'deactivate' | 'save';
  demo_video?: Record<string, string>;
  videos?: object[];
  tags?: string[];
};

export type ResourceModel = Model<IResource, Record<string, unknown>>;
