import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

import { IModule } from '../module/module.interface';

export type IGlossaryFilters = {
  searchTerm?: string;
  status?: string;
  select?: string;
  module?: string;
  delete?: "yes" | "no" ;
  // other query parameters
};

export type IGlossarySearchableField = {
  title?: string;
  details?: string;
};

export type IGlossary = {
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

export type GlossaryModel = Model<IGlossary, Record<string, unknown>>;
