import { Model } from 'mongoose';
import { ICourse } from '../course/course.interface';

type IOtherInfo = { uid: string; photoURL: string };

type IPurchaseCourses = {
  course: string;
  quiz?: [];
  total_completed_lessions?: string[];
};

export type IGeneralUser = {
  _id: string;
  // _id?: string;
  name: string; //embedded object
  gender?: 'male' | 'female';
  dateOfBirth?: string;
  password?: string;
  email?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  uid: string;
  fcm_token?: string;
  deviceId?: string;
  otherInfo?: IOtherInfo;
  role: string;
  subscribe?: {
    startDate: string;
    endDate: string;
    totalCourses?:[string|ICourse]
  };
  status?: 'active' | 'deactive';
  learnedToday?: {
    date?: string;
    time?: number;
  };
  purchase_courses?: IPurchaseCourses[];
};

export type GeneralUserModel = Model<IGeneralUser, Record<string, unknown>>;

export type IGeneralUserFilters = {
  searchTerm?: string;
  email?: string;
  phone?: string;
  status?: string;
  uid?: string;
};
