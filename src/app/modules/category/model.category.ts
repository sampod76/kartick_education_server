import { Schema, Types, model } from 'mongoose';
import { CategoryModel, ICategory } from './interface.category';

const CategorySchema = new Schema<ICategory, CategoryModel>(
  {
    title: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
    },
    thumbnail: {
      type: Types.ObjectId,
      ref: 'FileUploade',
    },
    status: {
      type: String,
      default: 'active',
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

export const Category = model<ICategory, CategoryModel>(
  'Category',
  CategorySchema
);
