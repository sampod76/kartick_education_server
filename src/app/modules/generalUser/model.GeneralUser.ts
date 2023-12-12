import mongoose, { Schema, Types, model } from 'mongoose';
import { ENUM_USER_ROLE } from '../../../enums/users';
import { GENDER } from './constant.GeneralUser';
import { GeneralUserModel, IGeneralUser } from './interface.GeneralUser';
import { format } from 'date-fns';
const GeneralUserSchema = new Schema<IGeneralUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: GENDER,
    },
    role: {
      type: String,
      default: ENUM_USER_ROLE.GENERAL_USER,
    },
   
    dateOfBirth: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      // required: true,
    },
    phone: {
      type: String,
      unique: true,
      // required: true,
    },
    profileImage: {
      type: Types.ObjectId,
      ref: 'FileUploade',
      // required: true,
    },
    uid: {
      type: String,
      unique: true,
      required: [true, 'Uid must be provided'],
    },
    fcm_token: {
      type: String,
      unique: true,
    },
    deviceId: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'deactive'],
      default: 'active',
    },

    learnedToday: {
      type: {
        date: {
          type: Date,
        },
        time: {
          type: Number,
        },
      },
    },
    purchase_courses: [
      {
        course: { type: Types.ObjectId, ref: 'Course' },
        quiz: [],
        total_completed_lessions: [{ type: Types.ObjectId, ref: 'Lession' }],
      },
    ],
    
    subscribe: {
      startDate: {
        type: Date,
        default: () => {
          // Get the current date
          const today = new Date();
          const dateString = format(today, 'yyyy-MM-dd');
          return dateString;
        },
      },
      endDate: {
        type: Date,
      },
      // futures
      totalCourses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
       }]
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

GeneralUserSchema.statics.isUserExist = async function (
  id: string,
  courseId: string
): Promise<string | null> {
  const result = await GeneralUser.findById(id);
  const CourseIdExaite = result?.purchase_courses?.find(
    value => value.course === courseId
  );
  return CourseIdExaite?.course || null;
};

export const GeneralUser = model<IGeneralUser, GeneralUserModel>(
  'General_user',
  GeneralUserSchema
);
