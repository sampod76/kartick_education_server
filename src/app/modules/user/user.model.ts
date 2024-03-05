import { Schema, model } from 'mongoose';
import { IUser, IUserModel } from './user.interface';
import { ENUM_STATUS, ENUM_YN } from '../../../enums/globalEnums';

const userSchema = new Schema<IUser>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      firstName: {
        type: String,
        required: true,
      },
      middleName: {
        type: String,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    locationLink: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ENUM_STATUS,
    },
    isDelete: {
      type: String,
      enum: ENUM_YN,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtual: true,
    },
  },
);

export const User = model<IUser, IUserModel>('User', userSchema);
