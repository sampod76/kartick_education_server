import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

// import { IFileUploade } from '../fileUploade/interface.fileUploade';
// import { IUser } from '../users/users.interface';
import { I_STATUS, I_YN } from '../../../constant/globalConstant';

export type ICourseFilters = {
  searchTerm?: string;

  select?: string;
  delete?: 'yes' | 'no';
  isDelete?: string;
  // other query parameters
};

export type ICourseSearchableField = {
  title?: string;
};

export type ICourse = {
  author: Types.ObjectId | IUser | string;
  vat?: number;
  duration?: string[];
  level?: string;
  status: I_STATUS;
  isDelete: I_YN;
};

export type CourseModel = Model<ICourse, Record<string, unknown>>;
