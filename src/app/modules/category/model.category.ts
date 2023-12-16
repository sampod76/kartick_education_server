import { Schema, model } from 'mongoose';
import { STATUS } from '../../../constant/globalConstant';
import { CategoryModel, ICategory } from './interface.category';

const CategorySchema = new Schema<ICategory, CategoryModel>(
  {
    title: {
      type: String,
      required: true,
      //unique: true,
      trim: true,
    },
    img: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: STATUS,
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
