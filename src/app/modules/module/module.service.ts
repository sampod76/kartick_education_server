import mongoose, { PipelineStage, Types } from 'mongoose';

import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { ENUM_STATUS, ENUM_YN } from '../../../enums/globalEnums';
import ApiError from '../../errors/ApiError';
import { MODULE_SEARCHABLE_FIELDS } from './module.constant';
import { IModule, IModuleFilters } from './module.interface';
import { Module } from './module.model';

const { ObjectId } = mongoose.Types;
const createModuleByDb = async (payload: IModule): Promise<IModule> => {
  const result = await Module.create(payload);
  return result;
};

//getAllModuleFromDb
const getAllModuleFromDb = async (
  filters: IModuleFilters,
  paginationOptions: IPaginationOption,
): Promise<IGenericResponse<IModule[]>> => {
  //****************search and filters start************/
  const { searchTerm, select, ...filtersData } = filters;
  filtersData.status = filtersData.status
    ? filtersData.status
    : ENUM_STATUS.ACTIVE;
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
      $or: MODULE_SEARCHABLE_FIELDS.map(field =>
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
        field === 'category'
          ? { [field]: new Types.ObjectId(value) }
          : field === 'course'
            ? { [field]: new Types.ObjectId(value) }
            : field === 'milestone'
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
        from: 'milestones',
        let: { id: '$milestone' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$_id', '$$id'] },
                  { $eq: ['$isDelete', ENUM_YN.NO] },
                ],
              },
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
        as: 'milestoneDetails',
      },
    },

    {
      $project: { milestone: 0 },
    },
    {
      $addFields: {
        milestone: {
          $cond: {
            if: { $eq: [{ $size: '$milestoneDetails' }, 0] },
            then: [{}],
            else: '$milestoneDetails',
          },
        },
      },
    },

    {
      $project: { milestoneDetails: 0 },
    },
    {
      $unwind: '$milestone',
    },
  ];

  let result = null;
  if (select) {
    result = await Module.find({})
      .sort({ title: 1 })
      .select({ ...projection });
  } else {
    result = await Module.aggregate(pipeline);
  }

  const total = await Module.countDocuments(whereConditions);
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
const getSingleModuleFromDb = async (
  id: string,
  query: IModuleFilters,
): Promise<IModule | null> => {
  let result;
  if (query['lesson_quiz'] === ENUM_YN.YES) {
    result = await Module.aggregate([
      { $match: { _id: new ObjectId(id) } },

      {
        $lookup: {
          from: 'lessons',
          let: { id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$module', '$$id'] },
                    { $eq: ['$isDelete', ENUM_YN.NO] },
                  ],
                },
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
          as: 'lessons',
        },
      },
      {
        $lookup: {
          from: 'quizzes',
          let: { id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$module', '$$id'] },
                    { $eq: ['$isDelete', ENUM_YN.NO] },
                  ],
                },
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
          as: 'quizzes',
        },
      },
    ]);
  } else {
    result = await Module.aggregate([
      { $match: { _id: new ObjectId(id) } },

      {
        $lookup: {
          from: 'milestones',
          let: { id: '$milestone' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$_id', '$$id'] },
                    { $eq: ['$isDelete', ENUM_YN.NO] },
                  ],
                },
                // Additional filter conditions for collection2
              },
            },
            // Additional stages for collection2
            {
              $lookup: {
                from: 'courses',
                let: { id: '$course' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$_id', '$$id'] },
                          { $eq: ['$isDelete', ENUM_YN.NO] },
                        ],
                      },
                      // Additional filter conditions for collection2
                    },
                  },
                  // Additional stages for collection2
                  {
                    $lookup: {
                      from: 'categories',
                      let: { id: '$category' },
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $and: [
                                { $eq: ['$_id', '$$id'] },
                                { $eq: ['$isDelete', ENUM_YN.NO] },
                              ],
                            },
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
                      as: 'categoryDetails',
                    },
                  },
                  {
                    $project: { category: 0 },
                  },
                  {
                    $addFields: {
                      category: {
                        $cond: {
                          if: { $eq: [{ $size: '$categoryDetails' }, 0] },
                          then: [{}],
                          else: '$categoryDetails',
                        },
                      },
                    },
                  },

                  {
                    $project: { categoryDetails: 0 },
                  },
                  {
                    $unwind: '$category',
                  },

                  //! ///////

                  {
                    $project: {
                      title: 1,
                      category: 1,
                    },
                  },
                ],
                as: 'courseDetails',
              },
            },
            {
              $project: { milestone: 0 },
            },
            {
              $addFields: {
                course: {
                  $cond: {
                    if: { $eq: [{ $size: '$courseDetails' }, 0] },
                    then: [{}],
                    else: '$courseDetails',
                  },
                },
              },
            },

            {
              $project: { courseDetails: 0 },
            },
            {
              $unwind: '$course',
            },

            //! ////////////////////////

            {
              $project: {
                title: 1,
                course: 1,
                milestone_number: 1,
              },
            },
          ],
          as: 'milestoneDetails',
        },
      },
      {
        $project: { milestone: 0 },
      },
      {
        $addFields: {
          milestone: {
            $cond: {
              if: { $eq: [{ $size: '$milestoneDetails' }, 0] },
              then: [{}],
              else: '$milestoneDetails',
            },
          },
        },
      },
      {
        $project: { milestoneDetails: 0 },
      },
      {
        $unwind: '$milestone',
      },
    ]);
  }

  return result[0];
};

// update e form db
const updateModuleFromDb = async (
  id: string,
  payload: Partial<IModule>,
): Promise<IModule | null> => {
  const { demo_video, ...otherData } = payload;
  const updateData = { ...otherData };
  if (demo_video && Object.keys(demo_video).length > 0) {
    Object.keys(demo_video).forEach(key => {
      const demo_videoKey = `demo_video.${key}`; // `demo_video.status`
      (updateData as any)[demo_videoKey] =
        demo_video[key as keyof typeof demo_video];
    });
  }

  const result = await Module.findOneAndUpdate({ _id: id }, updateData, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new ApiError(500, 'Module update fail!!😪😭😰');
  }
  return result;
};

// delete e form db
const deleteModuleByIdFromDb = async (
  id: string,
  query: IModuleFilters,
): Promise<IModule | null> => {
  let result;
  // result = await Module.findByIdAndDelete(id);
  if (query.delete === ENUM_YN.YES) {
    result = await Module.findByIdAndDelete(id);
  } else {
    result = await Module.findOneAndUpdate(
      { _id: id },
      { status: ENUM_STATUS.DEACTIVATE, isDelete: ENUM_YN.YES },
    );
  }
  return result;
};

// set user reviews e form db
const ModuleReviewsByUserFromDb = async (): Promise<IModule | null> => {
  return null;
};

export const ModuleService = {
  createModuleByDb,
  getAllModuleFromDb,
  getSingleModuleFromDb,
  updateModuleFromDb,
  deleteModuleByIdFromDb,
  ModuleReviewsByUserFromDb,
};
