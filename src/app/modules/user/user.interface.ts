import { Model } from 'mongoose';
import { ENUM_STATUS, ENUM_YN } from '../../../enums/globalEnums';

export type IUserAccountStatus = 'active' | 'inactive' | 'block';

export type IUser = {
  _id: string;
  userId: string;
  fullName: {
    firstName: string;
    middleName?: string;
    lastName: string;
  };
  email: string;
  role: string;
  password: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  profileImage: string;
  address: string;
  locationLink: string;
  status: ENUM_STATUS;
  isDelete: ENUM_YN;
};
export type IUserModel = Model<IUser, Record<string, unknown>>;
