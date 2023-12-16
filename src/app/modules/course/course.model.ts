import { Schema, model } from 'mongoose';
import { STATUS } from '../../../constant/globalConstant';
import { COURSE_TYPES } from './course.constant';
import { CourseModel, ICourse } from './course.interface';

const courseSchema = new Schema<ICourse, CourseModel>(
  {
    title: {
      type: String,
      trim: true,
    },
    img: {
      type: String,
    },
    details: {
      type: String,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    // sub1_course_category_id: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Category',
    // },
    price: {
      type: Number,
      min:0
    },
    duration: {
      type: String,
    },
    level: {
      type: String,
    },
    price_type: {
      type: String,
      enum: COURSE_TYPES,
      default: 'paid',
    },
    status: {
      type: String,
      enum: STATUS,
      default: 'active',
    },
    demo_video: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
      virtuals: true,
    },
  }
);

export const Course = model<ICourse, CourseModel>('Course', courseSchema);
