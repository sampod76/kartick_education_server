import mongoose, { PipelineStage, Types } from 'mongoose';

import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { ENUM_STATUS, ENUM_YN } from '../../../enums/globalEnums';
import ApiError from '../../errors/ApiError';
import { SINGLE_QUIZ_SEARCHABLE_FIELDS } from './single_quiz.constant';
import { ISingleQuiz, ISingleQuizFilters } from './single_quiz.interface';
import { SingleQuiz } from './single_quiz.model';

const { ObjectId } = mongoose.Types;
const createSingleQuizByDb = async (
  payload: ISingleQuiz
): Promise<ISingleQuiz> => {
  const result = await SingleQuiz.create(payload);
  return result;
};

//getAllSingleQuizFromDb
const getAllSingleQuizFromDb = async (
  filters: ISingleQuizFilters,
  paginationOptions: IPaginationOption
): Promise<IGenericResponse<ISingleQuiz[]>> => {
  //****************search and filters start************/
  const { searchTerm, select, ...filtersData } = filters;

  // Split the string and extract field names
  const projection: { [key: string]: number } = {};
  if (select) {
    const fieldNames = select?.split(',').map(field => field.trim());
    // Create the projection object
    fieldNames.forEach(field => {
      projection[field] = 1;
    });
  }

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: SINGLE_QUIZ_SEARCHABLE_FIELDS.map(field =>
        //search array value
        field === 'tags'
          ? { [field]: { $in: [new RegExp(searchTerm, 'i')] } }
          : {
              [field]: new RegExp(searchTerm, 'i'),
            }
      ),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) =>
        field === 'module'
          ? { [field]: new Types.ObjectId(value) }
          : { [field]: value }
      ),
    });
  }

  //****************search and filters end**********/

  //****************pagination start **************/

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: 1 | -1 } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  }

  //****************pagination end ***************/

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  /* 
  const result = await Milestone.find(whereConditions)
    .sort(sortConditions)
    .skip(Number(skip))
    .limit(Number(limit)); 
  */
  const pipeline: PipelineStage[] = [
    { $match: whereConditions },
    { $sort: sortConditions },
    { $skip: Number(skip) || 0 },
    { $limit: Number(limit) || 15 },
    {
      $lookup: {
        from: 'modules',
        let: { id: '$module' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$id'] },
              // Additional filter conditions for collection2
            },
          },
          // Additional stages for collection2
          // প্রথম লুকাপ চালানোর পরে যে ডাটা আসছে তার উপরে যদি আমি যেই কোন কিছু করতে চাই তাহলে এখানে করতে হবে |যেমন আমি এখানে project করেছি

          // {
          //   $project: {
          //     __v: 0,
          //   },
          // },
        ],
        as: 'moduleDetails',
      },
    },

    {
      $project: { module: 0 },
    },
    {
      $addFields: {
        module: {
          $cond: {
            if: { $eq: [{ $size: '$moduleDetails' }, 0] },
            then: [{}],
            else: '$moduleDetails',
          },
        },
      },
    },
    {
      $project: { moduleDetails: 0 },
    },
    {
      $unwind: '$module',
    },
    //------------ quiz pipelines --------------------------------
    {
      $lookup: {
        from: 'quizzes',
        let: { id: '$quiz' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$id'] },
              // Additional filter conditions for collection2
            },
          },
        ],
        as: 'quizDetails',
      },
    },

    {
      $project: { quiz: 0 },
    },
    {
      $addFields: {
        quiz: {
          $cond: {
            if: { $eq: [{ $size: '$quizDetails' }, 0] },
            then: [{}],
            else: '$quizDetails',
          },
        },
      },
    },
    {
      $project: { quizDetails: 0 },
    },
    {
      $unwind: '$quiz',
    },
  ];

  let result = null;
  if (select) {
    result = await SingleQuiz.find({})
      .sort({ title: 1 })
      .select({ ...projection });
  } else {
    result = await SingleQuiz.aggregate(pipeline);
  }

  const total = await SingleQuiz.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get single e form db
const getSingleSingleQuizFromDb = async (
  id: string
): Promise<ISingleQuiz | null> => {
  const result = await SingleQuiz.aggregate([
    { $match: { _id: new ObjectId(id) } },
    {
      $lookup: {
        from: 'modules',
        let: { id: '$module' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$id'] },
              // Additional filter conditions for collection2
            },
          },
        ],
        as: 'moduleDetails',
      },
    },

    {
      $project: { module: 0 },
    },
    {
      $addFields: {
        module: {
          $cond: {
            if: { $eq: [{ $size: '$moduleDetails' }, 0] },
            then: [{}],
            else: '$moduleDetails',
          },
        },
      },
    },
    {
      $project: { moduleDetails: 0 },
    },
    {
      $unwind: '$module',
    },

    //------------ quiz pipelines --------------------------------
    {
      $lookup: {
        from: 'quizzes',
        let: { id: '$quiz' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$id'] },
              // Additional filter conditions for collection2
            },
          },
        ],
        as: 'quizDetails',
      },
    },

    {
      $project: { quiz: 0 },
    },
    {
      $addFields: {
        quiz: {
          $cond: {
            if: { $eq: [{ $size: '$quizDetails' }, 0] },
            then: [{}],
            else: '$quizDetails',
          },
        },
      },
    },
    {
      $project: { quizDetails: 0 },
    },
    {
      $unwind: '$quiz',
    },
  ]);

  return result[0];
};

// update e form db
const updateSingleQuizFromDb = async (
  id: string,
  payload: Partial<ISingleQuiz>
): Promise<ISingleQuiz | null> => {
  console.log('🚀 ~ file: single_quiz.service.ts:285 ~ id:', id);
  const { /* demo_video,  */ ...otherData } = payload;
  console.log('🚀 ~ file: single_quiz.service.ts:286 ~ payload:', payload);
  const updateData = { ...otherData };
  // if (demo_video && Object.keys(demo_video).length > 0) {
  //   Object.keys(demo_video).forEach(key => {
  //     const demo_videoKey = `demo_video.${key}`; // `demo_video.status`
  //     (updateData as any)[demo_videoKey] =
  //       demo_video[key as keyof typeof demo_video];
  //   });
  // }

  const result = await SingleQuiz.findByIdAndUpdate(new mongoose.Types.ObjectId(id), updateData);
  if (!result) {
    throw new ApiError(500, 'SingleQuiz update fail!!😪😭😰');
  }
  return result;
};

// delete e form db
const deleteSingleQuizByIdFromDb = async (
  id: string,
  query: ISingleQuizFilters
): Promise<ISingleQuiz | null> => {
  let result;
  if (query.delete === ENUM_YN.YES) {
    result = await SingleQuiz.findByIdAndDelete(id);
  } else {
    result = await SingleQuiz.findOneAndUpdate({
      status: ENUM_STATUS.DEACTIVATE,
    });
  }
  return result;
};

// set user reviews e form db
const SingleQuizReviewsByUserFromDb = async (): Promise<ISingleQuiz | null> => {
  return null;
};

export const SingleQuizService = {
  createSingleQuizByDb,
  getAllSingleQuizFromDb,
  getSingleSingleQuizFromDb,
  updateSingleQuizFromDb,
  deleteSingleQuizByIdFromDb,
  SingleQuizReviewsByUserFromDb,
};
