import { PipelineStage, Types } from 'mongoose';
import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { ENUM_STATUS } from '../../../enums/globalEnums';
import { CATEGORY_SEARCHABLE_FIELDS } from './consent.category';
import { ICategory, ICategoryFilters } from './interface.category';
import { Category } from './model.category';
import { categoryPipeline } from './pipeline/categoryChildren';

const createCategoryByDb = async (payload: ICategory): Promise<ICategory> => {
  // const find = await Category.findOne({ title: payload.title, isDelete: true });
  // if (find) {
  //   throw new ApiError(400, 'This Category All Ready Exist');
  // }
  const result = await Category.create(payload);
  return result;
};

//getAllCategoryFromDb
const getAllCategoryFromDb = async (
  filters: ICategoryFilters,
  paginationOptions: IPaginationOption
): Promise<IGenericResponse<ICategory[]>> => {
  //****************search and filters start************/
  const { searchTerm, ...filtersData } = filters;
  filtersData.status = filtersData.status
    ? filtersData.status
    : ENUM_STATUS.ACTIVE;
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: CATEGORY_SEARCHABLE_FIELDS.map(field => ({
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
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: 1 | -1 } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  }
  //****************pagination end ***************/

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  // const result = await Category.find(whereConditions)
  //   .populate('thumbnail')
  //   .sort(sortConditions)
  //   .skip(Number(skip))
  //   .limit(Number(limit));
  const pipeline: PipelineStage[] = [
    { $match: whereConditions },
    { $sort: sortConditions },
    { $skip: Number(skip) || 0 },
    // { $limit: Number(limit) || 15 },
  ];

  // console.log(pipeline);
  const result = await Category.aggregate(pipeline);
  // console.log(result, 127);
  const total = await Category.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get single Categorye form db
const getSingleCategoryFromDb = async (
  id: string
): Promise<ICategory | null> => {
  const pipeline: PipelineStage[] = [
    { $match: { _id: new Types.ObjectId(id) } },
    ///***************** */ images field ******start
  ];

  const result = await Category.aggregate(pipeline);

  return result[0];
};

// update Categorye form db
const updateCategoryFromDb = async (
  id: string,
  payload: Partial<ICategory>
): Promise<ICategory | null> => {
  const result = await Category.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

// delete Categorye form db
const deleteCategoryByIdFromDb = async (
  id: string
): Promise<ICategory | null> => {
  const result = await Category.findOneAndDelete({ _id: id });
  return result;
};
//

//getAllCategoryChildrenFromDb
const getAllCategoryChildrenTitleFromDb = async (
  filters: ICategoryFilters,
  paginationOptions: IPaginationOption
): Promise<IGenericResponse<ICategory[]>> => {
  //****************search and filters start************/
  const { searchTerm, children, ...filtersData } = filters;
  filtersData.status = filtersData.status
    ? filtersData.status
    : ENUM_STATUS.ACTIVE;
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: CATEGORY_SEARCHABLE_FIELDS.map(field => ({
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
  const { page, limit, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: 1 | -1 } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  }
  //****************pagination end ***************/

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  // const result = await Category.find(whereConditions)
  //   .populate('thumbnail')
  //   .sort(sortConditions)
  //   .skip(Number(skip))
  //   .limit(Number(limit));
  const pipeline: PipelineStage[] =
    children === 'course'
      ? categoryPipeline.categoryCourse({ whereConditions, sortConditions })
      : children === 'course-milestone'
      ? categoryPipeline.categoryCourseMileston({
          whereConditions,
          sortConditions,
        })
      : children === 'course-milestone-module'
      ? categoryPipeline.categoryCourseMilestonModule({
          whereConditions,
          sortConditions,
        })
      : children === 'course-milestone-module-lessons'
      ? categoryPipeline.categoryCourseMilestonModuleLesson({
          whereConditions,
          sortConditions,
        })
      : children === 'course-milestone-module-lessons-quiz'
      ? categoryPipeline.all({ whereConditions, sortConditions })
      : categoryPipeline.all({ whereConditions, sortConditions });

  // console.log(pipeline);
  const result = await Category.aggregate(pipeline);
  // console.log(result, 127);
  const total = await Category.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const CategoryService = {
  createCategoryByDb,
  getAllCategoryFromDb,
  getSingleCategoryFromDb,
  updateCategoryFromDb,
  deleteCategoryByIdFromDb,
  getAllCategoryChildrenTitleFromDb,
};
