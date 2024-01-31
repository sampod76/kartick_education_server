import mongoose, { PipelineStage, Types } from 'mongoose';

import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { ENUM_STATUS, ENUM_YN } from '../../../enums/globalEnums';
import ApiError from '../../errors/ApiError';
import { QUIZ_SUBMIT_SEARCHABLE_FIELDS } from './quizSubmit.constant';
import { IQuizSubmit, IQuizSubmitFilters } from './quizSubmit.interface';
import { QuizSubmit } from './quizSubmit.model';

const { ObjectId } = mongoose.Types;
const createQuizSubmitByDb = async (
  payload: IQuizSubmit,
  user: any,
): Promise<IQuizSubmit | null> => {
  const findSubmitQuiz = await QuizSubmit.findOne({
    quiz: new Types.ObjectId(payload.quiz as string),
    singleQuiz: new Types.ObjectId(payload.singleQuiz as string),
    user: new Types.ObjectId(user.id as string),
  });

  let result;
  if (findSubmitQuiz) {
    throw new ApiError(400, 'You are already submit this quiz');
  } else {
    result = (await QuizSubmit.create({ ...payload, user: user.id })).populate(
      'singleQuiz',
    );
  }

  // if (findSubmitQuiz) {
  //   // Use findOneAndUpdate to update and get the updated document
  //   // const findExisting = findSubmitQuiz?.userSubmitQuizzes?.find(
  //   //   (data: any) =>
  //   //     data?.singleQuizId === payload.userSubmitQuizzes[0]?.singleQuizId
  //   // );

  //   // let updateResult;
  //   // if (!findExisting) {
  //   //   updateResult = await QuizSubmit.findOneAndUpdate(
  //   //     { _id: findSubmitQuiz._id },
  //   //     { $push: { userSubmitQuizzes: { $each: payload.userSubmitQuizzes } } },
  //   //     { new: true } // Return the updated document
  //   //   ).populate('userSubmitQuizzes.singleQuizId');
  //   // }
  //   // result = updateResult || null; // If updateResult is null, set result to null
  // } else {
  //   result = (await QuizSubmit.create({ ...payload, user: user.id })).populate(
  //     'userSubmitQuizzes.singleQuizId'
  //   );
  // }

  return result;
};

//getAllQuizFromDb
const getAllQuizSubmitFromDb = async (
  filters: IQuizSubmitFilters,
  paginationOptions: IPaginationOption,
): Promise<IGenericResponse<IQuizSubmit[]>> => {
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
      $or: QUIZ_SUBMIT_SEARCHABLE_FIELDS.map(field =>
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
              : field === 'module'
                ? { [field]: new Types.ObjectId(value) }
                : field === 'lesson'
                  ? { [field]: new Types.ObjectId(value) }
                  : field === 'quiz'
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
  ];

  let result = null;
  if (select) {
    result = await QuizSubmit.find({})
      .sort({ title: 1 })
      .select({ ...projection });
  } else {
    result = await QuizSubmit.aggregate(pipeline);
  }

  const total = await QuizSubmit.countDocuments(whereConditions);
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
const getQuizSubmitVerifyFromDb = async (
  id: string,
  user: any,
): Promise<IQuizSubmit[] | null> => {
  const findSubmitQuiz = await QuizSubmit.find({
    quiz: new Types.ObjectId(id as string),
    user: new Types.ObjectId(user.id as string),
  }).populate('singleQuiz');

  return findSubmitQuiz;
};
const getQuizSubmitSingelFromDb = async (
  id: string,
): Promise<IQuizSubmit | null> => {
  const result = await QuizSubmit.aggregate([
    { $match: { _id: new ObjectId(id) } },
  ]);

  return result[0];
};

// delete e form db
const deleteQuizSubmitByIdFromDb = async (
  id: string,
  query: IQuizSubmitFilters,
): Promise<IQuizSubmit | null> => {
  let result;
  console.log(query, 'query');
  if (query.delete === ENUM_YN.YES) {
    result = await QuizSubmit.findByIdAndDelete(id);
  } else {
    result = await QuizSubmit.findOneAndUpdate(
      { _id: id },
      { status: ENUM_STATUS.DEACTIVATE, isDelete: ENUM_YN.YES },
    );
  }
  return result;
};

export const QuizSubmitService = {
  createQuizSubmitByDb,
  getAllQuizSubmitFromDb,
  getQuizSubmitSingelFromDb,
  deleteQuizSubmitByIdFromDb,
  getQuizSubmitVerifyFromDb,
};
