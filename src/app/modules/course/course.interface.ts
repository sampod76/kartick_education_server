import { Model, Types } from 'mongoose';
// import { IFileUploade } from '../fileUploade/interface.fileUploade';
// import { IUser } from '../users/users.interface';

export type ICourseFilters = {
  searchTerm?: string;
  price?: number;
  duration?: string;
  level?: string;
  status?: string;
  price_type?: string;
};

export type ICourseSearchableField = {
  title: string;
  price: string;
  level: string;
  status: string;
  details: string;
};

export type ICourse = {
  title: string;
  img: string;
  details: string;
  author_id: Types.ObjectId;
  main_course_category_id: Types.ObjectId;
  sub1_course_category_id: Types.ObjectId;
  price: number;
  duration: string;
  level: string;
  price_type: 'free' | 'paid' | 'open' | 'closed' | 'recurrig';
  status: 'active' | 'deactive' | 'save';
  //! incomplete
  demo_video_id: Types.ObjectId;
};

export type CourseModel = Model<ICourse, Record<string, unknown>>;
