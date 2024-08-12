import { Schema, model } from 'mongoose';
import { STATUS_ARRAY } from '../../../constant/globalConstant';
import {
  ISubmitAssignment,
  SubmitAssignmentModel,
} from './interface.submit_assignment';

const mongooseFileSchema = new Schema(
  {
    original_filename: { type: String },
    fileType: {
      type: String,
    },
    category: { type: String },
    path: { type: String },
    server_url: { type: String },
    size: { type: Number },
  },
  { _id: false },
);
const SubmitAssignmentSchema = new Schema<
  ISubmitAssignment,
  SubmitAssignmentModel
>(
  {
    assignment: { type: Schema.Types.ObjectId, ref: 'Assignment' },
    accountCreateAuthor: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    authorEmail: { type: String },
    //
    marks: { type: Number },
    pdfs: { type: [mongooseFileSchema] },
    lesson: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Lesson',
    },
    module: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Module',
    },
    milestone: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Milestone',
    },
    course: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Course',
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
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

// SubmitAssignmentSchema.pre('findOneAndDelete', async function (next) {
//   try {
//     // eslint-disable-next-line @typescript-eslint/no-this-alias
//     const dataId = this.getFilter();
//     console.log(dataId);
//     const { _id, ...data } = (await this.model.findOne({ _id: dataId?._id?._id }).lean()) as { _id: mongoose.Schema.Types.ObjectId; data: any };
//     console.log("🚀 ~ file: model.SubmitAssignment.ts:40 ~ _id:", data)
//     if (_id) {
//      await ArchivedSubmitAssignment.create(data);
//       // or
//       // const result = await DeleteSubmitAssignment.create(data);
//     }else{
//       throw new ApiError(400,"Not found this item")
//     }
//     next();
//   } catch (error: any) {
//     next(error);
//   }
// });

export const SubmitAssignment = model<ISubmitAssignment, SubmitAssignmentModel>(
  'SubmitAssignment',
  SubmitAssignmentSchema,
);