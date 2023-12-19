import mongoose, { PipelineStage, Types } from 'mongoose';

import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { ENUM_STATUS, ENUM_YN } from '../../../enums/globalEnums';
import ApiError from '../../errors/ApiError';
import { MILESTONE_SEARCHABLE_FIELDS } from './milestone.constant';
import { IMilestone, IMilestoneFilters } from './milestone.interface';
import { Milestone } from './milestone.model';

const { ObjectId } = mongoose.Types;
const createMilestoneByDb = async (payload: IMilestone): Promise<IMilestone> => {
  const result = (await Milestone.create(payload)).populate([
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

//getAllMilestoneFromDb
const getAllMilestoneFromDb = async (
  filters: IMilestoneFilters,
  paginationOptions: IPaginationOption
): Promise<IGenericResponse<IMilestone[]>> => {
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
      $or: MILESTONE_SEARCHABLE_FIELDS.map(field =>
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
         field === 'course'
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
        from: 'courses',
        let: { id: '$course' },
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
        as: 'courseDetails',
      },
    },
    
    {
      $project: { course: 0 },
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
   
  ];

  let result = null;
  if (select) {
    result = await Milestone.find({})
      .sort({ title: 1 })
      .select({ ...projection });
  } else {
    result = await Milestone.aggregate(pipeline);
  }

  const total = await Milestone.countDocuments(whereConditions);
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
const getSingleMilestoneFromDb = async (id: string): Promise<IMilestone | null> => {
  const result = await Milestone.aggregate([
    { $match: { _id: new ObjectId(id) } },
  ]);

  return result[0];
};

// update e form db
const updateMilestoneFromDb = async (
  id: string,
  payload: Partial<IMilestone>
): Promise<IMilestone | null> => {
  const { demo_video, ...otherData } = payload;
  const updateData = { ...otherData };

  if (demo_video && Object.keys(demo_video).length > 0) {
    Object.keys(demo_video).forEach(key => {
      const demo_videoKey = `demo_video.${key}`; // `demo_video.status`
      (updateData as any)[demo_videoKey] = demo_video[key as keyof typeof demo_video];
    });
  }
  const result = await Milestone.findOneAndUpdate({ _id: id }, updateData, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new ApiError(500, 'Milestone update fail!!😪😭😰');
  }
  return result;
};

// delete e form db
const deleteMilestoneByIdFromDb = async (
  id: string,
  query: IMilestoneFilters
): Promise<IMilestone | null> => {
  let result;
  if (query.delete === ENUM_YN.YES) {
    result = await Milestone.findByIdAndDelete(id);
  } else {
    result = await Milestone.findOneAndUpdate({ status: ENUM_STATUS.DEACTIVATE });
  }
  return result;
};

// set user reviews e form db
const MilestoneReviewsByUserFromDb = async (): Promise<IMilestone | null> => {
  return null;
};

export const MilestoneService = {
  createMilestoneByDb,
  getAllMilestoneFromDb,
  getSingleMilestoneFromDb,
  updateMilestoneFromDb,
  deleteMilestoneByIdFromDb,
  MilestoneReviewsByUserFromDb,
};
