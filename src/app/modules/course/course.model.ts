import { Schema, model } from 'mongoose';
import { CourseModel, ICourse } from './course.interface';

const courseSchema = new Schema<ICourse, CourseModel>(
  {
    title: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: false,
    },
    details: {
      type: String,
      required: true,
    },
    author_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    main_course_category_id: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    sub1_course_category_id: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    price_type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    demo_video_id: {
      type: Schema.Types.ObjectId,
      required: true,
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
