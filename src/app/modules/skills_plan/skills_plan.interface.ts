import { Model, Types } from 'mongoose';
// import { IFileUploade } from '../fileUploade/interface.fileUploade';
// import { IUser } from '../users/users.interface';

export type ISkills_planFilters = {
  searchTerm?: string;
  title?: string;

  status?: string;
  page?: string;
  select?: string;
  delete?: 'yes' | 'no';
  isDelete?: string;
  // other query parameters
};

export type ISkills_planSearchableField = {
  title?: string;
};

export type ISkills_plan = {
  title: string;
  imgs: string[];
  imageTitle: string;
  page?: string;
  points: string[];
  details?: string;
  short_description?: string;
  author: Types.ObjectId;
  // sub1_Skills_plan_category_id: Types.ObjectId;
  status: 'active' | 'deactivate' | 'save' | 'disable';
  demo_video?: Record<string, string>;
  tags?: string[];
  isDelete: string;
};

// export type Skills_planModel = Model<ISkills_plan, Record<string, unknown>>;
export type Skills_planModel = {
  isSkills_planExistMethod({
    id,
    title,
  }: {
    id?: string;
    title?: string;
  }): Promise<Pick<ISkills_plan, 'title'>>;
} & Model<ISkills_plan>;
