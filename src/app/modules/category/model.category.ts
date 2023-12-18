import { Schema, model } from 'mongoose';
import { STATUS_ARRAY } from '../../../constant/globalConstant';
import { CategoryModel, ICategory } from './interface.category';

const CategorySchema = new Schema<ICategory, CategoryModel>(
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
  }
);


// CategorySchema.pre('findOneAndDelete', async function (next) {
//   try {
//     // eslint-disable-next-line @typescript-eslint/no-this-alias
//     const dataId = this.getFilter();
//     console.log(dataId);
//     const { _id, ...data } = (await this.model.findOne({ _id: dataId?._id?._id }).lean()) as { _id: mongoose.Schema.Types.ObjectId; data: any };
//     console.log("🚀 ~ file: model.category.ts:40 ~ _id:", data)
//     if (_id) {
//      await ArchivedCategory.create(data);
//       // or
//       // const result = await DeleteCategory.create(data);
//     }else{
//       throw new ApiError(400,"Not found this item")
//     }
//     next();
//   } catch (error: any) {
//     next(error);
//   }
// });

export const Category = model<ICategory, CategoryModel>(
  'Category',
  CategorySchema
);
