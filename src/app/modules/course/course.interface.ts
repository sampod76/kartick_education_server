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
  title?: string;
  details?: string;
};

export type ICourse = {
  title: string;
  img: string;
  details?: string;
  author: Types.ObjectId;
  category: Types.ObjectId;
  // sub1_course_category_id: Types.ObjectId;
  price: number;
  tax?: number;
  vat?: number;
  duration?: string;
  level?: string;
  price_type: 'free' | 'paid' | 'closed' | 'recurrig';
  status: 'active' | 'deactive' | 'save';
  //! incomplete
  demo_video?:Record<string,string>
};

export type CourseModel = Model<ICourse, Record<string, unknown>>;
