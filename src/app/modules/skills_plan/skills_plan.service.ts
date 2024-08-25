import { PipelineStage, Types } from 'mongoose';

import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { ENUM_YN } from '../../../enums/globalEnums';
import ApiError from '../../errors/ApiError';

import { skills_plan_SEARCHABLE_FIELDS } from './skills_plan.constant';
import { ISkills_plan, ISkills_planFilters } from './skills_plan.interface';
import { Skills_plan } from './skills_plan.model';

const createSkills_planByDb = async (
  payload: ISkills_plan,
): Promise<ISkills_plan> => {
  const result = await Skills_plan.create(payload);
  return result;
};

//getAllSkills_planFromDb
const getAllSkills_planFromDb = async (
  filters: ISkills_planFilters,
  paginationOptions: IPaginationOption,
): Promise<IGenericResponse<ISkills_plan[]>> => {
  //****************search and filters start************/
  const { searchTerm, select, ...filtersData } = filters;

  filtersData.isDelete = filtersData.isDelete
    ? filtersData.isDelete
    : ENUM_YN.NO;

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
      $or: skills_plan_SEARCHABLE_FIELDS.map(field =>
        //search array value
        field === 'tags'
          ? { [field]: { $in: [new RegExp(searchTerm, 'i')] } }
          : {
              [field]: new RegExp(searchTerm, 'i'),
            },
      ),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) =>
        field === 'author'
          ? { [field]: new Types.ObjectId(value) }
          : { [field]: value },
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
  const result = await Skills_plan.find(whereConditions)
    .sort(sortConditions)
    .skip(Number(skip))
    .limit(Number(limit)); 
  */
  const pipeline: PipelineStage[] = [
    { $match: whereConditions },
    { $sort: sortConditions },
    { $skip: Number(skip) || 0 },
    { $limit: Number(limit) || 15 },
    // {
    //   $lookup: {
    //     from: 'users',
    //     let: { id: '$author' },
    //     pipeline: [
    //       {
    //         $match: {
    //           $expr: {
    //   $and: [{ $ne: ['$$id', undefined] }, { $eq: ['$_id', '$$id'] }],
    // },
    //           // Additional filter conditions for collection2
    //         },
    //       },
    //       // Additional stages for collection2
    //       // প্রথম লুকাপ চালানোর পরে যে ডাটা আসছে তার উপরে যদি আমি যেই কোন কিছু করতে চাই তাহলে এখানে করতে হবে |যেমন আমি এখানে project করেছি

    //       {
    //         $project: {
    //           password: 0,
    //         },
    //       },
    //     ],
    //     as: 'authorDetails',
    //   },
    // },

    // {
    //   $project: { author: 0 },
    // },
    // {
    //   $addFields: {
    //     author: {
    //       $cond: {
    //         if: { $eq: [{ $size: '$authorDetails' }, 0] },
    //         then: [{}],
    //         else: '$authorDetails',
    //       },
    //     },
    //   },
    // },

    // {
    //   $project: { authorDetails: 0 },
    // },
    // {
    //   $unwind: '$author',
    // },
  ];

  let result = null;
  if (select) {
    result = await Skills_plan.find(whereConditions)
      .sort({ ...sortConditions })
      .skip(Number(skip))
      .limit(Number(limit))
      .select({ ...projection });
  } else {
    result = await Skills_plan.aggregate(pipeline);
  }

  const total = await Skills_plan.countDocuments(whereConditions);
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
const getSingleSkills_planFromDb = async (
  id: string,
): Promise<ISkills_plan | null> => {
  const result = await Skills_plan.findById(id);
  return result;
};

// update e form db
const updateSkills_planFromDb = async (
  id: string,
  payload: Partial<ISkills_plan>,
): Promise<ISkills_plan | null> => {
  const { demo_video, ...otherData } = payload;
  const updateData = { ...otherData };

  if (demo_video && Object.keys(demo_video).length > 0) {
    Object.keys(demo_video).forEach(key => {
      const demo_videoKey = `demo_video.${key}`; // `demo_video.status`
      (updateData as any)[demo_videoKey] =
        demo_video[key as keyof typeof demo_video];
    });
  }
  const result = await Skills_plan.findOneAndUpdate({ _id: id }, updateData, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new ApiError(500, 'Skills_plan update fail!!😪😭😰');
  }
  return result;
};

// delete e form db
const deleteSkills_planByIdFromDb = async (
  id: string,
  query: ISkills_planFilters,
): Promise<ISkills_plan | null> => {
  let result;
  // result = await Skills_plan.findByIdAndDelete(id);
  if (query.delete === ENUM_YN.YES) {
    result = await Skills_plan.findByIdAndDelete(id);
  } else {
    result = await Skills_plan.findOneAndUpdate(
      { _id: id },
      { isDelete: ENUM_YN.YES },
    );
  }
  return result;
};

export const Skills_planService = {
  createSkills_planByDb,
  getAllSkills_planFromDb,
  getSingleSkills_planFromDb,
  deleteSkills_planByIdFromDb,
  updateSkills_planFromDb,
};
