import { PipelineStage, Types } from 'mongoose';

import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { ENUM_YN } from '../../../enums/globalEnums';
import ApiError from '../../errors/ApiError';

import { Short_overview_SEARCHABLE_FIELDS } from './short_overview.constant';
import {
  IShort_overview,
  IShort_overviewFilters,
} from './short_overview.interface';
import { Short_overview } from './short_overview.model';

const createShort_overviewByDb = async (
  payload: IShort_overview,
): Promise<IShort_overview> => {
  const result = await Short_overview.create(payload);
  return result;
};

//getAllShort_overviewFromDb
const getAllShort_overviewFromDb = async (
  filters: IShort_overviewFilters,
  paginationOptions: IPaginationOption,
): Promise<IGenericResponse<IShort_overview[]>> => {
  //****************search and filters start************/
  const { searchTerm, select, ...filtersData } = filters;

  filtersData.isDelete = filtersData.isDelete
    ? filtersData.isDelete
    : ENUM_YN.NO;

  // Split the string and extract field names
  const projection: { [key: string]: number } = {};
  if (select) {
    console.log(select);
    const fieldNames = select?.split(',').map(field => field.trim());
    // Create the projection object
    fieldNames.forEach(field => {
      projection[field] = 1;
    });
  }

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: Short_overview_SEARCHABLE_FIELDS.map(field =>
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
  const result = await Short_overview.find(whereConditions)
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
    result = await Short_overview.find(whereConditions)
      .sort({ ...sortConditions })
      .skip(Number(skip))
      .limit(Number(limit))
      .select({ ...projection });
  } else {
    result = await Short_overview.aggregate(pipeline);
  }

  const total = await Short_overview.countDocuments(whereConditions);
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
const getSingleShort_overviewFromDb = async (
  id: string,
): Promise<IShort_overview | null> => {
  const result = await Short_overview.findById(id);
  return result;
};

// update e form db
const updateShort_overviewFromDb = async (
  id: string,
  payload: Partial<IShort_overview>,
): Promise<IShort_overview | null> => {
  const { demo_video, ...otherData } = payload;
  const updateData = { ...otherData };

  if (demo_video && Object.keys(demo_video).length > 0) {
    Object.keys(demo_video).forEach(key => {
      const demo_videoKey = `demo_video.${key}`; // `demo_video.status`
      (updateData as any)[demo_videoKey] =
        demo_video[key as keyof typeof demo_video];
    });
  }
  const result = await Short_overview.findOneAndUpdate(
    { _id: id },
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );
  if (!result) {
    throw new ApiError(500, 'Short_overview update fail!!😪😭😰');
  }
  return result;
};

// delete e form db
const deleteShort_overviewByIdFromDb = async (
  id: string,
  query: IShort_overviewFilters,
): Promise<IShort_overview | null> => {
  let result;
  // result = await Short_overview.findByIdAndDelete(id);
  if (query.delete === ENUM_YN.YES) {
    result = await Short_overview.findByIdAndDelete(id);
  } else {
    result = await Short_overview.findOneAndUpdate(
      { _id: id },
      { isDelete: ENUM_YN.YES },
    );
  }
  return result;
};

export const Short_overviewService = {
  createShort_overviewByDb,
  getAllShort_overviewFromDb,
  getSingleShort_overviewFromDb,
  deleteShort_overviewByIdFromDb,
  updateShort_overviewFromDb,
};
