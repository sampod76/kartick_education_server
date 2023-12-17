import { Model, Types } from 'mongoose';
import { ICourse } from '../course/course.interface';
// import { IFileUploade } from '../fileUploade/interface.fileUploade';
// import { IUser } from '../users/users.interface';

export type IMilestoneFilters = {
  searchTerm?: string;
  status?: string;
  course?: string;
  select?: string;
  // other query parameters
};

export type IMilestoneSearchableField = {
  title?: string;
  details?: string;
};

export type IMilestone = {
  title: string;
  img: string;
  details?: string;
  author: Types.ObjectId;
  course: Types.ObjectId | ICourse | string;
  // sub1_Milestone_category_id: Types.ObjectId;
  status: 'active' | 'deactivate' | 'save';
  showing_number?: number;
  favorite: 'yes' | 'no';
  demo_video?: Record<string, string>;
  tags?: string[];
};

export type MilestoneModel = Model<IMilestone, Record<string, unknown>>;
