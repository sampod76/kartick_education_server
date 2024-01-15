import { Model, Types } from 'mongoose';
import { ICategory } from '../category/interface.category';
import { ICourse } from '../course/course.interface';
// import { IFileUploade } from '../fileUploade/interface.fileUploade';
// import { IUser } from '../users/users.interface';

export type IMilestoneFilters = {
  searchTerm?: string;
  status?: string;
  //
  course?: string;
  category?: string;
  milestone?: string;
  //
  select?: string;
  delete?: "yes" | "no" ;
  module?: 'yes' | 'no';
  isDelete?: string;
  // other query parameters
};

export type IMilestoneSearchableField = {
  title?: string;
  short_description?: string;
};

export type IMilestone = {
  title: string;
  imgs: string[];
  details?: string;
  short_description?: string;
  author: Types.ObjectId;
  //
  course: Types.ObjectId | ICourse | string;
  category: Types.ObjectId | ICategory | string;
  // sub1_Milestone_category_id: Types.ObjectId;
  status: 'active' | 'deactivate' | 'save';
  isDelete: string;
  milestone_number?: number;
  favorite: 'yes' | 'no';
  demo_video?: Record<string, string>;
  tags?: string[];
};

export type MilestoneModel = Model<IMilestone, Record<string, unknown>>;
