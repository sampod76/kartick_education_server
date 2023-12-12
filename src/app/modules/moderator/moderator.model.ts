import { Schema, Types, model } from 'mongoose';
import { ENUM_USER_ROLE } from '../../../enums/users';
import { IModerator, ModeratorModel } from './moderator.interface';

const ModeratorSchema = new Schema<IModerator, ModeratorModel>(
  {
    name: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    role: {
      type: String,
      default: ENUM_USER_ROLE.MODERATOR,
    },

    email: {
      type: String,
      unique: true,
      // required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      // required: true,
    },
    uid: {
      type: String,
      unique: true,
    },
    emergencyphone: {
      type: String,
    },

    address: {
      type: String,
    },

    designation: {
      type: String,
    },
    profileImage: {
      type: Types.ObjectId,
      ref: 'FileUploade',
      // required: true,
    },
    status: {
      type: String,
      enum: ['active', 'deactive'],
      default: 'active',
    },
    // academicModerator: {
    //   type: Types.ObjectId,
    //   ref: 'AcademicModerator',
    //   required: true,
    // },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Moderator = model<IModerator, ModeratorModel>(
  'Moderator',
  ModeratorSchema
);
