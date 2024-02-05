import { PipelineStage, Types } from 'mongoose';

import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { ENUM_YN } from '../../../enums/globalEnums';
import ApiError from '../../errors/ApiError';

import { Show_advance_classes_SEARCHABLE_FIELDS } from './constant.show_advance_classes';
import { IShow_advance_classes, IShow_advance_classesFilters } from './interface.show_advance_classes';
import { Show_advance_classes } from './model.show_advance_classes';

const createShow_advance_classesByDb = async (
  payload: IShow_advance_classes,
): Promise<IShow_advance_classes> => {
  const result = await Show_advance_classes.create(payload);
  return result;
};

//getAllShow_advance_classesFromDb
const getAllShow_advance_classesFromDb = async (
  filters: IShow_advance_classesFilters,
  paginationOptions: IPaginationOption,
): Promise<IGenericResponse<IShow_advance_classes[]>> => {
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
      $or: Show_advance_classes_SEARCHABLE_FIELDS.map(field =>
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
  const result = await Show_advance_classes.find(whereConditions)
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
    //           $expr: { $eq: ['$_id', '$$id'] },
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
    result = await Show_advance_classes.find(whereConditions)
      .sort({ ...sortConditions })
      .skip(Number(skip))
      .limit(Number(limit))
      .select({ ...projection });
  } else {
    result = await Show_advance_classes.aggregate(pipeline);
  }

  const total = await Show_advance_classes.countDocuments(whereConditions);
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
const getSingleShow_advance_classesFromDb = async (
  id: string,
): Promise<IShow_advance_classes | null> => {
  const result = await Show_advance_classes.findById(id);
  return result;
};

// update e form db
const updateShow_advance_classesFromDb = async (
  id: string,
  payload: Partial<IShow_advance_classes>,
): Promise<IShow_advance_classes | null> => {
  const { demo_video, ...otherData } = payload;
  const updateData = { ...otherData };

  if (demo_video && Object.keys(demo_video).length > 0) {
    Object.keys(demo_video).forEach(key => {
      const demo_videoKey = `demo_video.${key}`; // `demo_video.status`
      (updateData as any)[demo_videoKey] =
        demo_video[key as keyof typeof demo_video];
    });
  }
  const result = await Show_advance_classes.findOneAndUpdate({ _id: id }, updateData, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new ApiError(500, 'Show_advance_classes update fail!!😪😭😰');
  }
  return result;
};

// delete e form db
const deleteShow_advance_classesByIdFromDb = async (
  id: string,
  query: IShow_advance_classesFilters,
): Promise<IShow_advance_classes | null> => {
  let result;
  result = await Show_advance_classes.findByIdAndDelete(id);
  if (query.delete === ENUM_YN.YES) {
    result = await Show_advance_classes.findByIdAndDelete(id);
  } else {
    result = await Show_advance_classes.findOneAndUpdate(
      { _id: id },
      { isDelete: ENUM_YN.YES },
    );
  }
  return result;
};

export const Show_advance_classesService = {
  createShow_advance_classesByDb,
  getAllShow_advance_classesFromDb,
  getSingleShow_advance_classesFromDb,
  deleteShow_advance_classesByIdFromDb,
  updateShow_advance_classesFromDb,
};
