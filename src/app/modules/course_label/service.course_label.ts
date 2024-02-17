import { PipelineStage, Types } from 'mongoose';
import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { ENUM_STATUS, ENUM_YN } from '../../../enums/globalEnums';
import ApiError from '../../errors/ApiError';
import { Course_label_SEARCHABLE_FIELDS } from './consent.course_label';
import { ICourse_label, ICourse_labelFilters } from './interface.course_label';
import { Course_label } from './model.course_label';
import { Course_labelPipeline } from './pipeline/Course_labelChildren';

const createCourse_labelByDb = async (
  payload: ICourse_label,
): Promise<ICourse_label> => {
  const find = await Course_label.findOne({
    title: new RegExp(payload.title, 'i'),
    isDelete: 'no',
    category: payload.category,
  });

  if (find) {
    throw new ApiError(400, 'This Course_label All Ready Exist');
  }
  const result = await Course_label.create(payload);
  return result;
};

//getAllCourse_labelFromDb
const getAllCourse_labelFromDb = async (
  filters: ICourse_labelFilters,
  paginationOptions: IPaginationOption,
): Promise<IGenericResponse<ICourse_label[]>> => {
  //****************search and filters start************/
  const { searchTerm, ...filtersData } = filters;

  filtersData.isDelete = filtersData.isDelete
    ? filtersData.isDelete
    : ENUM_YN.NO;
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: Course_label_SEARCHABLE_FIELDS.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) =>field === "category" ?   {
        [field]: new Types.ObjectId(value),
      }:  {
        [field]: value,
      }),
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

  // const result = await Course_label.find(whereConditions)
  //   .populate('thumbnail')
  //   .sort(sortConditions)
  //   .skip(Number(skip))
  //   .limit(Number(limit));
  const pipeline: PipelineStage[] = [
    { $match: whereConditions },
    { $sort: sortConditions },
    { $skip: Number(skip) || 0 },
    { $limit: Number(limit) || 99999 },
  ];

  // console.log(pipeline);
  const result = await Course_label.aggregate(pipeline);
  // console.log(result, 127);
  const total = await Course_label.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get single Course_labele form db
const getSingleCourse_labelFromDb = async (
  id: string,
): Promise<ICourse_label | null> => {
  const pipeline: PipelineStage[] = [
    { $match: { _id: new Types.ObjectId(id) } },
    ///***************** */ images field ******start
  ];

  const result = await Course_label.aggregate(pipeline);

  return result[0];
};

// update Course_labele form db
const updateCourse_labelFromDb = async (
  id: string,
  payload: Partial<ICourse_label>,
): Promise<ICourse_label | null> => {
  const result = await Course_label.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

// delete Course_labele form db
const deleteCourse_labelByIdFromDb = async (
  id: string,
): Promise<ICourse_label | null> => {
  const result = await Course_label.findOneAndDelete({ _id: id });
  return result;
};
//

//getAllCourse_labelChildrenFromDb
const getAllCourse_labelChildrenTitleFromDb = async (
  filters: ICourse_labelFilters,
  paginationOptions: IPaginationOption,
): Promise<IGenericResponse<ICourse_label[]>> => {
  //****************search and filters start************/
  const { searchTerm, ...filtersData } = filters;
  filtersData.status = filtersData.status
    ? filtersData.status
    : ENUM_STATUS.ACTIVE;
  filtersData.isDelete = filtersData.isDelete
    ? filtersData.isDelete
    : ENUM_YN.NO;
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: Course_label_SEARCHABLE_FIELDS.map(field => ({
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

  //****************search and filters end**********/

  //****************pagination start **************/
  const { page, limit, sortBy, sortOrder, skip } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: 1 | -1 } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  }
  //****************pagination end ***************/

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  // const result = await Course_label.find(whereConditions)
  //   .populate('thumbnail')
  //   .sort(sortConditions)
  //   .skip(Number(skip))
  //   .limit(Number(limit));
  const pipeline: PipelineStage[] = Course_labelPipeline.all({
    whereConditions,
    sortConditions,
    skip,
    limit,
  });

  // console.log(pipeline);
  const result = await Course_label.aggregate(pipeline);
  // console.log(result, 127);
  const total = await Course_label.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const Course_labelService = {
  createCourse_labelByDb,
  getAllCourse_labelFromDb,
  getSingleCourse_labelFromDb,
  updateCourse_labelFromDb,
  deleteCourse_labelByIdFromDb,
  getAllCourse_labelChildrenTitleFromDb,
};
