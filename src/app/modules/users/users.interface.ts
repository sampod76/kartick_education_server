// import { Model } from 'mongoose'

import { Model, Types } from 'mongoose';
import { IAdmin } from '../admin/admin.interface';
import { IGeneralUser } from '../generalUser/interface.GeneralUser';
import { IModerator } from '../moderator/moderator.interface';

export type IUser = {
  email: string;
  role: string;
  password: string;
  status?: 'active' | 'deactive';
  needsPasswordChange?: true | false;
  generalUser?: Types.ObjectId | IGeneralUser;
  moderator?: Types.ObjectId | IModerator;
  admin?: Types.ObjectId | IAdmin;
};

export type UserModel = {
  isUserExist(
    email: string
  ): Promise<Pick<
    IUser,
    'password' | 'needsPasswordChange' | 'role' | 'email'
  > | null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;
