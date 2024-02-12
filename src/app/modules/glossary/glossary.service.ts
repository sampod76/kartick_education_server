import mongoose, { PipelineStage, Types } from 'mongoose';

import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { ENUM_STATUS, ENUM_YN } from '../../../enums/globalEnums';
import ApiError from '../../errors/ApiError';
import { GLOSSARY_SEARCHABLE_FIELDS } from './glossary.constant';
import { IGlossary, IGlossaryFilters } from './glossary.interface';
import { Glossary } from './glossary.model';

const { ObjectId } = mongoose.Types;
const createGlossaryByDb = async (payload: IGlossary): Promise<IGlossary> => {
  const result = await Glossary.create(payload);
  return result;
};

//getAllGlossaryFromDb
const getAllGlossaryFromDb = async (
  filters: IGlossaryFilters,
  paginationOptions: IPaginationOption
): Promise<IGenericResponse<IGlossary[]>> => {
  //****************search and filters start************/
  const { searchTerm, select, ...filtersData } = filters;
  filtersData.status= filtersData.status ? filtersData.status : ENUM_STATUS.ACTIVE
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
      $or: GLOSSARY_SEARCHABLE_FIELDS.map(field =>
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

          {
            $project: {
              title: 1,
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
  ];

  let result = null;
  if (select) {
    result = await Glossary.find(whereConditions)
      .sort({ ...sortConditions })
      .skip(Number(skip))
      .limit(Number(limit))
      .select({ ...projection });
  } else {
    result = await Glossary.aggregate(pipeline);
  }

  const total = await Glossary.countDocuments(whereConditions);
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
const getSingleGlossaryFromDb = async (
  id: string
): Promise<IGlossary | null> => {

  const result = await Glossary.aggregate([
    { $match: { _id: new ObjectId(id) } },
    // {
    //   $lookup: {
    //     from: 'modules',
    //     let: { id: '$module' },
    //     pipeline: [
    //       {
    //         $match: {
    //           $expr: { $eq: ['$_id', '$$id'] },
    //           // Additional filter conditions for collection2
    //         },
    //       },
    //       {
    //         $project: {
    //           title: 1,
    //         },
    //       },
    //     ],
    //     as: 'moduleDetails',
    //   },
    // },

    // {
    //   $project: { module: 0 },
    // },
    // {
    //   $addFields: {
    //     module: {
    //       $cond: {
    //         if: { $eq: [{ $size: '$moduleDetails' }, 0] },
    //         then: [{}],
    //         else: '$moduleDetails',
    //       },
    //     },
    //   },
    // },

    // {
    //   $project: { moduleDetails: 0 },
    // },
    // {
    //   $unwind: '$module',
    // },
  ]);
  

  return result[0];
};

// update e form db
const updateGlossaryFromDb = async (
  id: string,
  payload: Partial<IGlossary>
): Promise<IGlossary | null> => {
  const { demo_video, ...otherData } = payload;
  const updateData = { ...otherData };
  if (demo_video && Object.keys(demo_video).length > 0) {
    Object.keys(demo_video).forEach(key => {
      const demo_videoKey = `demo_video.${key}`; // `demo_video.status`
      (updateData as any)[demo_videoKey] =
        demo_video[key as keyof typeof demo_video];
    });
  }

  const result = await Glossary.findOneAndUpdate({ _id: id }, updateData, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new ApiError(500, 'Glossary update fail!!😪😭😰');
  }
  return result;
};

// delete e form db
const deleteGlossaryByIdFromDb = async (
  id: string,
  query: IGlossaryFilters
): Promise<IGlossary | null> => {
  let result;
  // result = await Glossary.findByIdAndDelete(id);
  if (query.delete === ENUM_YN.YES) {
    result = await Glossary.findByIdAndDelete(id);
  }
   else {
    result = await Glossary.findOneAndUpdate(
     { _id: id },
      { status: ENUM_STATUS.DEACTIVATE, isDelete: ENUM_YN.YES }
    );
  }
  return result;
};

// set user reviews e form db
const GlossaryReviewsByUserFromDb = async (): Promise<IGlossary | null> => {
  return null;
};

export const GlossaryService = {
  createGlossaryByDb,
  getAllGlossaryFromDb,
  getSingleGlossaryFromDb,
  updateGlossaryFromDb,
  deleteGlossaryByIdFromDb,
  GlossaryReviewsByUserFromDb,
};
