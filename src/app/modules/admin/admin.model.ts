import { Schema, model } from 'mongoose';
import { GENDER_ARRAY, STATUS_ARRAY } from '../../../constant/globalConstant';
import { AdminModel, IAdmin } from './admin.interface';

const AdminSchema = new Schema<IAdmin, AdminModel>(
  {
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    additionalRole: {
      type: String,
      default: 'admin',
    },
    dateOfBirth: {
      type: String,
    },
    gender: {
      type: String,
      enum: GENDER_ARRAY,
    },
    email: {
      type: String,
      //unique: true,
      required: true,
    },
    phoneNumber: {
      type: String,
      //unique: true,
      required: true,
    },
    address: {
      type: String,
    },
    isDelete: {
      type: String,
      enum: ['yes', 'no'],
      default: 'no',
    },
    status: {
      type: String,
      enum: STATUS_ARRAY,
      default: 'active',
    },
    img: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const Admin = model<IAdmin, AdminModel>('Admin', AdminSchema);
