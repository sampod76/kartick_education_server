import mongoose, { PipelineStage, Types } from 'mongoose';

import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { ENUM_STATUS, ENUM_YN } from '../../../enums/globalEnums';
import ApiError from '../../errors/ApiError';
import { LESSON_SEARCHABLE_FIELDS } from './lesson.constant';
import { ILesson, ILessonFilters } from './lesson.interface';
import { Lesson } from './lesson.model';

const { ObjectId } = mongoose.Types;
const createLessonByDb = async (payload: ILesson): Promise<ILesson> => {
  const result = (await Lesson.create(payload)).populate([
    {
      path: 'author',
      select: {
        needsPasswordChange: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      },
    },
  ]);
  return result;
};

//getAllLessonFromDb
const getAllLessonFromDb = async (
  filters: ILessonFilters,
  paginationOptions: IPaginationOption
): Promise<IGenericResponse<ILesson[]>> => {
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
      $or: LESSON_SEARCHABLE_FIELDS.map(field =>
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
   
  ];

  let result = null;
  if (select) {
    result = await Lesson.find({})
      .sort({ title: 1 })
      .select({ ...projection });
  } else {
    result = await Lesson.aggregate(pipeline);
  }

  const total = await Lesson.countDocuments(whereConditions);
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
const getSingleLessonFromDb = async (
  id: string
): Promise<ILesson | null> => {
  const result = await Lesson.aggregate([
    { $match: { _id: new ObjectId(id) } },
  ]);

  return result[0];
};

// update e form db
const updateLessonFromDb = async (
  id: string,
  payload: Partial<ILesson>
): Promise<ILesson | null> => {
  const { demo_video, ...otherData } = payload;
  const updateData = { ...otherData };
  if (demo_video && Object.keys(demo_video).length > 0) {
    Object.keys(demo_video).forEach(key => {
      const demo_videoKey = `demo_video.${key}`; // `demo_video.status`
      (updateData as any)[demo_videoKey] =
        demo_video[key as keyof typeof demo_video];
    });
  }

  const result = await Lesson.findOneAndUpdate({ _id: id }, updateData, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new ApiError(500, 'Lesson update fail!!😪😭😰');
  }
  return result;
};

// delete e form db
const deleteLessonByIdFromDb = async (
  id: string,
  query: ILessonFilters
): Promise<ILesson | null> => {
  let result;
  if (query.delete === ENUM_YN.YES) {
    result = await Lesson.findByIdAndDelete(id);
  } else {
    result = await Lesson.findOneAndUpdate({ status: ENUM_STATUS.DEACTIVATE });
  }
  return result;
};

// set user reviews e form db
const LessonReviewsByUserFromDb = async (): Promise<ILesson | null> => {
  return null;
};

export const LessonService = {
  createLessonByDb,
  getAllLessonFromDb,
  getSingleLessonFromDb,
  updateLessonFromDb,
  deleteLessonByIdFromDb,
  LessonReviewsByUserFromDb,
};
