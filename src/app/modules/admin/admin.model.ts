import { Schema, model } from 'mongoose';
import { ENUM_USER_ROLE } from '../../../enums/users';
import { AdminModel, IAdmin } from './admin.interface';

const AdminSchema = new Schema<IAdmin, AdminModel>(
  {
    name: {
      type: String,
      trim: true,
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
      default: ENUM_USER_ROLE.ADMIN,
    },
    uid: {
      type: String,
      unique: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
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
      type: String,
      // required: true,
    },
    status: {
      type: String,
      enum: ['active', 'deactive'],
      default: 'active',
    },
    // academicAdmin: {
    //   type: Types.ObjectId,
    //   ref: 'AcademicAdmin',
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

export const Admin = model<IAdmin, AdminModel>('Admin', AdminSchema);
