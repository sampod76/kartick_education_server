import { Schema, model } from 'mongoose';
import { STATUS_ARRAY } from '../../../constant/globalConstant';
import { ContactMailModel, IContactMail } from './interface.contactMail';
const ContactMailSchema = new Schema<IContactMail, ContactMailModel>(
  {
    name: {
      type: String,
      required: true,
      //unique: true,
      trim: true,
     
    },
    subject: {
      type: String,
   
      //unique: true,
      trim: true,
     
    },
    message: {
      type: String,
   
      //unique: true,
      trim: true,
     
    },
    email: {
      type: String,
      required: true,
      //unique: true,
      trim: true,
      index: true,
      lowercase: true,
    },
    images: [{
      type: String,
      trim: true,
    }],
    user: {
      type: Schema.Types.ObjectId,
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

const ArchivedContactMailSchema = new Schema<IContactMail, ContactMailModel>(
  {
    name: {
      type: String,
      required: true,
      //unique: true,
      trim: true,
     
    },
    subject: {
      type: String,
   
      //unique: true,
      trim: true,
     
    },
    message: {
      type: String,
   
      //unique: true,
      trim: true,
     
    },
    email: {
      type: String,
      required: true,
      //unique: true,
      trim: true,
      index: true,
      lowercase: true,
    },
    images: [{
      type: String,
      trim: true,
    }],
    user: {
      type: Schema.Types.ObjectId,
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

// ContactMailSchema.pre('findOneAndDelete', async function (next) {
//   try {
//     // eslint-disable-next-line @typescript-eslint/no-this-alias
//     const dataId = this.getFilter();
//     console.log(dataId);
//     const { _id, ...data } = (await this.model.findOne({ _id: dataId?._id?._id }).lean()) as { _id: mongoose.Schema.Types.ObjectId; data: any };
//     console.log("🚀 ~ file: model.ContactMail.ts:40 ~ _id:", data)
//     if (_id) {
//      await ArchivedContactMail.create(data);
//       // or
//       // const result = await DeleteContactMail.create(data);
//     }else{
//       throw new ApiError(400,"Not found this item")
//     }
//     next();
//   } catch (error: any) {
//     next(error);
//   }
// });

export const ContactMail = model<IContactMail, ContactMailModel>(
  'ContactMail',
  ContactMailSchema,
);
export const ArchivedContactMail = model<IContactMail, ContactMailModel>(
  'ArchivedContactMail',
  ArchivedContactMailSchema,
);
