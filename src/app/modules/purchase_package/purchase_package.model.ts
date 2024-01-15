import { Schema, model } from 'mongoose';
import { PACKAGE_TYPES_ARRAY } from './purchase_package.constant';
import { IPackage, PackageModel } from './purchase_package.interface';

const quizSubmitSchema = new Schema<IPackage, PackageModel>(
  {
    membership: {
      title: { type: String, required: true },
      uid: { type: String },
    },
    title: { type: String, required: true },
    img: { type: String },
    categories: [
      {
        category: { type: Schema.Types.ObjectId, ref: 'Category' },
        label: { type: String },
        //!----------- if type is multiple_select ----------
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
        //!---------------------------------------------------
      },
    ],
    date_range: [{ type: Date }],
    type: {
      type: String,
      enum: PACKAGE_TYPES_ARRAY,
      required: true,
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
    isDelete: { type: String, default: 'no' },
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
