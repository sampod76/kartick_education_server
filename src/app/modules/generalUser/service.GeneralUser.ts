/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status';
import { SortOrder, Types } from 'mongoose';
import { ENUM_USER_ROLE } from '../../../enums/users';
import { paginationHelper } from '../../../helper/paginationHelper';
import ApiError from '../../errors/ApiError';
import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { GeneralUserSearchableFields } from './constant.GeneralUser';
import { IGeneralUser, IGeneralUserFilters } from './interface.GeneralUser';
import { GeneralUser } from './model.GeneralUser';
// import { IPurchased_courses } from '../purchased_courses/purchased_courses.interface';
// const {ObjectId}=mongoose.Types

const createGeneralUserByFirebaseFromDb = async (
  payload: IGeneralUser,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  req:any
): Promise<IGeneralUser | null> => {
  //
  const removeFalseValue = (obj: any) => {
    const falseValues = [undefined, '', 'undefined', null, 'null'];
    for (const key in obj) {
      if (falseValues.includes(obj[key])) {
        delete obj[key];
      }
    }
  };
  removeFalseValue(payload);
  
 
  let result = null;
    // result = await GeneralUser.findOne( { $or: [{ uid: req?.user?.uid }, { email: payload?.email }] },);
    // result = await GeneralUser.findOne( { uid:req?.user?.uid },);
    result = await GeneralUser.findOne( { uid:payload?.uid },);

  if (!result?.uid) {
    // create new user

    // payload.uid=req?.user?.uid
    // payload.email=req?.user?.email
    // removeFalseValue(payload)
    result = await GeneralUser.create(payload);
  } else {
    const data: any = {
      fcm_token: payload?.fcm_token,
    };
    if (payload?.uid) {
      // data.uid = req?.user?.uid;
      data.uid = payload?.uid;
    }
    if (payload?.email) {
      // data.email = req?.user?.email;
      data.email = payload?.email;
    }

    result = await GeneralUser.findOneAndUpdate(
      { uid:payload?.uid },
      data,
      {new: true,runValidators:true}
    );
  }
 
  return result;
};



const getAllGeneralUsersFromDb = async (
  filters: IGeneralUserFilters,
  paginationOptions: IPaginationOption
): Promise<IGenericResponse<IGeneralUser[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: GeneralUserSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await GeneralUser.find(whereConditions)
    .populate('profileImage')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await GeneralUser.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleGeneralUserFromDb = async (
  id: string
): Promise<IGeneralUser | null> => {
  const result = await GeneralUser.findById(id)
    .populate('purchase_courses.course', 'courseId title thumbnail createdAt')
    .populate('profileImage');

  return result;
};

// user to course
const getUserToCourseFromDb = async (
  id: string
): Promise<IGeneralUser[] | null> => {
  const result = await GeneralUser.aggregate([
    { $match: { _id: new Types.ObjectId(id) } },
    {
      $unwind: '$purchase_courses', // এটার মাধ্যমে আমরা কোন একটা array multipal ভ্যালুগুলাকে তার parent সাথে  আলাদা আলাদা করে প্রত্যেকটা ডকুমেন্ট তৈরি করা
    },
    {
      $lookup: {
        from: 'courses',
        let: { id: '$purchase_courses.course' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$id'] },
              // Additional filter conditions for collection2
            },
          },

          // Additional stages for collection2
          // প্রথম লুকাপ চালানোর পরে যে ডাটা আসছে তার উপরে যদি আমি যেই কোন কিছু করতে চাই তাহলে এখানে করতে হবে |যেমন আমি এখানে project করেছি
          {
            $project: {
              password: 0,
              document: 0,
            },
          },
        ],
        as: 'course',
      },
    },
    {
      $unwind: '$course', // এটার মাধ্যমে আমরা কোন একটা array multipal ভ্যালুগুলাকে তার parent সাথে  আলাদা আলাদা করে প্রত্যেকটা ডকুমেন্ট তৈরি করা
    },
    {
      $lookup: {
        from: 'lessions',
        let: { id: '$course._id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$course', '$$id'] },
              // Additional filter conditions for collection2
            },
          },
        ],
        as: 'lessions',
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        purchase_courses: 1,
        course: { _id: 1, title: 1, thumbnail: 1, price: 1 },
        lessions: { _id: 1, title: 1, vedio: 1, course: 1 },
      },
    },
  ]);

  return result;
};

// update user course vedio or quiz
const updateCourseVedioOrQuizFromDb = async (
  id: string,
  payload: any
): Promise<IGeneralUser | null> => {
  const { course_id, lessionId, quiz, learnedToday } = payload;
  let result = null;
  if (course_id && lessionId) {
    result = await GeneralUser.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        'purchase_courses.course': course_id,
        'purchase_courses.total_completed_lessions': { $ne: lessionId },
      },
      {
        $push: {
          'purchase_courses.$.total_completed_lessions': lessionId,
        },
        learnedToday,
      },
      {
        new: true,
      }
    );
  }
  if (quiz) {
    result = await GeneralUser.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        'purchase_courses.course': new Types.ObjectId(course_id),
        // quiz: { $size: 0 },
      },
      {
        $set: {
          'purchase_courses.$.quiz': quiz,
        },
      },
      {
        new: true,
      }
    );
    // .projection({name:1, active:1, purchase_courses:1});
  }
  if (!result) {
    throw new ApiError(400, 'Something is going wrong!!');
  }

  return result;
};

// module 15 --> 14,15 vedio
const updateGeneralUserFromDb = async (
  id: string,
  payload: Partial<IGeneralUser>,
  req: any
): Promise<IGeneralUser | null> => {
  const resultFind = (await GeneralUser.findById(id)) as IGeneralUser & {
    _id: Types.ObjectId;
  };

  if (!resultFind?._id) {
    throw new ApiError(httpStatus.NOT_FOUND, 'GeneralUser not found !');
  }

  if (
    String(resultFind?._id)!== req?.user?._id &&
    req.user.role !== ENUM_USER_ROLE.ADMIN
  ) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Unauthorise person!');
  }

  const { ...GeneralUserData } = payload;
  const updatedGeneralUserData: Partial<IGeneralUser> = { ...GeneralUserData };

  const result = await GeneralUser.findOneAndUpdate(
    { _id: id },
    updatedGeneralUserData,
    {
      new: true,
    }
  );
  return result;
};

const deleteGeneralUserFromDb = async (
  id: string
): Promise<IGeneralUser | null> => {
  const result = await GeneralUser.findByIdAndDelete(id);
  return result;
};

export const GeneralUserService = {
  createGeneralUserByFirebaseFromDb,
  getAllGeneralUsersFromDb,
  getSingleGeneralUserFromDb,
  getUserToCourseFromDb,
  updateGeneralUserFromDb,
  updateCourseVedioOrQuizFromDb,
  deleteGeneralUserFromDb,
};
