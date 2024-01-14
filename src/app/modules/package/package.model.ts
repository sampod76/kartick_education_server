import { Schema, model } from 'mongoose';
import { PACKAGE_TYPES_ARRAY } from './package.constant';
import { IPackage, PackageModel } from './package.interface';

const quizSubmitSchema = new Schema<IPackage, PackageModel>(
  {
    membership: {
      title: { type: String, required: true },
      uid: { type: String },
    },
    title: { type: String, required: true },
    img: { type: String },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    date_range: [{ type: String }],
    type: {
      type: String,
      enum: PACKAGE_TYPES_ARRAY,
    },
    status: {
      type: String,
      enum: ['active', 'deactivate', 'save'],
      default: 'active',
    },
    biannual: {
      price: { type: Number },
      each_student_increment: { type: Number },
    },
    monthly: {
      price: { type: Number },
      each_student_increment: { type: Number },
    },
    yearly: {
      price: { type: Number },
      each_student_increment: { type: Number },
    },
    isDelete: { type: String, default: 'yes' },
  },
  {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
      virtuals: true,
    },
  }
);

export const Package = model<IPackage, PackageModel>(
  'Package',
  quizSubmitSchema
);
