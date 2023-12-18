"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchivedCategory = exports.Category = void 0;
const mongoose_1 = require("mongoose");
const globalConstant_1 = require("../../../constant/globalConstant");
const modelObject = {
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
        enum: globalConstant_1.STATUS_ARRAY,
        default: 'active',
    },
};
const CategorySchema = new mongoose_1.Schema(modelObject, {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
        virtuals: true,
    },
});
const ArchivedCategorySchema = new mongoose_1.Schema(modelObject, {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
        virtuals: true,
    },
});
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
exports.Category = (0, mongoose_1.model)('Category', CategorySchema);
exports.ArchivedCategory = (0, mongoose_1.model)('ArchivedCategory', ArchivedCategorySchema);
