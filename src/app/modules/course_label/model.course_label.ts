import { Schema, Types, model } from 'mongoose';
import { STATUS_ARRAY } from '../../../constant/globalConstant';
import { Course_labelModel, ICourse_label } from './interface.course_label';
const Course_labelSchema = new Schema<ICourse_label, Course_labelModel>(
  {
    title: {
      type: String,
      required: true,
      //unique: true,
      trim: true,
      index: true,
    },
    img: {
      type: String,
      trim: true,
    },
    category: {
      type: Types.ObjectId,
      ref: 'Category',
    },
    serial_number: {
      type: Number,

      default: 9999,
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

const ArchivedCourse_labelSchema = new Schema<ICourse_label, Course_labelModel>(
  {
    title: {
      type: String,
      required: true,
      //unique: true,
      trim: true,
      index: true,
    },
    img: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: STATUS_ARRAY,
      default: 'active',
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

// Course_labelSchema.pre('findOneAndDelete', async function (next) {
//   try {
//     // eslint-disable-next-line @typescript-eslint/no-this-alias
//     const dataId = this.getFilter();
//     console.log(dataId);
//     const { _id, ...data } = (await this.model.findOne({ _id: dataId?._id?._id }).lean()) as { _id: mongoose.Schema.Types.ObjectId; data: any };
//     console.log("🚀 ~ file: model.Course_label.ts:40 ~ _id:", data)
//     if (_id) {
//      await ArchivedCourse_label.create(data);
//       // or
//       // const result = await DeleteCourse_label.create(data);
//     }else{
//       throw new ApiError(400,"Not found this item")
//     }
//     next();
//   } catch (error: any) {
//     next(error);
//   }
// });

export const Course_label = model<ICourse_label, Course_labelModel>(
  'Course_label',
  Course_labelSchema,
);
export const ArchivedCourse_label = model<ICourse_label, Course_labelModel>(
  'ArchivedCourse_label',
  ArchivedCourse_labelSchema,
);
