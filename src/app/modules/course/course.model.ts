import { Schema, model } from 'mongoose';
import { STATUS_ARRAY } from '../../../constant/globalConstant';
import { ENUM_STATUS } from '../../../enums/globalEnums';
import { CourseModel, ICourse } from './course.interface';

const courseSchema = new Schema<ICourse, CourseModel>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    duration: {
      type: [Date],
    },
    level: {
      type: String,
    },

    status: {
      type: String,
      enum: STATUS_ARRAY,
      default: ENUM_STATUS.ACTIVE,
    },
    isDelete: {
      type: String,
      enum: ['yes', 'no'],
      default: 'no',
    },
  },
  {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
      virtuals: true,
    },
  },
);

export const Course = model<ICourse, CourseModel>('course', courseSchema);
