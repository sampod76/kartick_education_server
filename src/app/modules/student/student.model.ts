import { Schema, model } from 'mongoose';
import { STATUS_ARRAY } from '../../../constant/globalConstant';
import { gender } from './student.constant';
import { IStudent, StudentModel } from './student.interface';

export const StudentSchema = new Schema<IStudent, StudentModel>(
  {
    name: {
      type: {
        firstName: {
          type: String,
        },
        lastName: {
          type: String,
          // required: true,
        },
      },
      required: true,
    },
    additionalRole: {
      type: String,
      default: 'student',
    },
    gender: {
      type: String,
      enum: gender,
    },
    dateOfBirth: {
      type: String,
    },
    userId: {
      type: String,
    },

    email: {
      type: String,
      //unique: true,
      // required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: STATUS_ARRAY,
      default: 'active',
    },
    address: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    img: {
      type: String,
      // required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Student = model<IStudent, StudentModel>('Student', StudentSchema);
