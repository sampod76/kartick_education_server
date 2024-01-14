import { Schema, model } from 'mongoose';
import { STATUS_ARRAY, YN_ARRAY } from '../../../constant/globalConstant';
import { COURSE_TYPES } from './course.constant';
import { CourseModel, ICourse } from './course.interface';

const courseSchema = new Schema<ICourse, CourseModel>(
  {
    title: {
      type: String,
      trim: true,
      index: true,
      required: true,
    },
    snid: {
      type: String,
    },
    img: {
      type: String,
    },
    details: {
      type: String,
      trim: true,
    },
    short_description: {
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
      required: true,
    },
    // sub1_course_category_id: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Category',
    // },
    price: {
      type: Number,
      min: 0,
    },
    duration: {
      type: [Date],
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
      enum: STATUS_ARRAY,
      default: 'active',
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    demo_video: {
      type: Object,
      default: {},
    },

    showing_number: {
      type: Number,
    },
    favorite: {
      type: String,
      enum: YN_ARRAY,
      default: 'no',
    },
    tags: [String],
  },
  {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
      virtuals: true,
    },
  }
);
courseSchema.statics.isCourseExistMethod = async function ({
  id,
  title,
}: {
  id?: string;
  title?: string;
}): Promise<Pick<ICourse, 'title'> | null> {
  let result = null;
  if (id) {
    result = await Course.findById(id);
  }
  if (title) {
    result = await Course.findOne(
      { title: new RegExp(title, 'i') },
      { title: 1 }
    );
  }

  return result;
};

export const Course = model<ICourse, CourseModel>('Course', courseSchema);
