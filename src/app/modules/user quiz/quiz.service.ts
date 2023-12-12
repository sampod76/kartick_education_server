import { SortOrder } from 'mongoose';
import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { QUIZ_SEARCHABLE_FIELDS } from './quiz.consent';
import { IQuiz, IQuizFilters } from './quiz.interface';
import { Quiz } from './quiz.model';

const createQuizByDb = async (payload: IQuiz): Promise<IQuiz | null> => {
  const result = (await Quiz.create(payload)).populate({
    path: 'course',
    // select: { needsPasswordChange: 0, createdAt: 0, updatedAt: 0, __v: 0 },
    // populate: [
    //   {
    //     path: 'moderator',
    //     select: { createdAt: 0, updatedAt: 0, __v: 0 },
    //   }
    // ],
  });
  return result;
};

//getAllQuizFromDb
const getAllQuizFromDb = async (
  filters: IQuizFilters,
  paginationOptions: IPaginationOption
): Promise<IGenericResponse<IQuiz[]>> => {
  //****************search and filters start************/
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: QUIZ_SEARCHABLE_FIELDS.map(field =>
        //search array value
        field === 'tag'
          ? { [field]: { $in: [new RegExp(searchTerm, 'i')] } }
          : {
              [field]: new RegExp(searchTerm, 'i'),
            }
      ),
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

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  //****************pagination end ***************/

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Quiz.find(whereConditions)
    .sort(sortConditions)
    .skip(Number(skip))
    .limit(Number(limit));

  const total = await Quiz.countDocuments(whereConditions);
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
const getSingleQuizFromDb = async (id: string): Promise<IQuiz | null> => {
  const result = await Quiz.findById(id);
  return result;
};

// update e form db
const updateQuizFromDb = async (
  id: string,
  payload: Partial<IQuiz>
): Promise<IQuiz | null> => {
  const result = await Quiz.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

// delete e form db
const deleteQuizByIdFromDb = async (id: string): Promise<IQuiz | null> => {
  const result = await Quiz.findByIdAndDelete(id);
  return result;
};

export const QuizService = {
  createQuizByDb,
  getAllQuizFromDb,
  getSingleQuizFromDb,
  updateQuizFromDb,
  deleteQuizByIdFromDb,
};
