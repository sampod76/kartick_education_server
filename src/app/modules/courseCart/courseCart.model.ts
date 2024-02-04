import { Schema, model } from 'mongoose';
import { STATUS_ARRAY } from '../../../constant/globalConstant';
import { CourseCartModel, ICourseCart } from './courseCart.interface';

const CourseCartSchema = new Schema<ICourseCart, CourseCartModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    status: {
      type: String,
      enum: STATUS_ARRAY,
      default: 'active',
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

export const CourseCart = model<ICourseCart, CourseCartModel>('CourseCart', CourseCartSchema);
