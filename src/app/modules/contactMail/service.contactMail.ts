import { PipelineStage, Types } from 'mongoose';
import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { ENUM_STATUS, ENUM_YN } from '../../../enums/globalEnums';
import { ContactMail_SEARCHABLE_FIELDS } from './consent.contactMail';
import { IContactMail, IContactMailFilters } from './interface.contactMail';
import { ContactMail } from './model.contactMail';


const createContactMailByDb = async (
  payload: IContactMail,
): Promise<IContactMail> => {

  const result = await ContactMail.create(payload);
  return result;
};

//getAllContactMailFromDb
const getAllContactMailFromDb = async (
  filters: IContactMailFilters,
  paginationOptions: IPaginationOption,
): Promise<IGenericResponse<IContactMail[]>> => {
  //****************search and filters start************/
  const { searchTerm, ...filtersData } = filters;

  filtersData.isDelete = filtersData.isDelete
    ? filtersData.isDelete
    : ENUM_YN.NO;
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: ContactMail_SEARCHABLE_FIELDS.map(field => ({
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

  // const result = await ContactMail.find(whereConditions)
  //   .populate('thumbnail')
  //   .sort(sortConditions)
  //   .skip(Number(skip))
  //   .limit(Number(limit));
  const pipeline: PipelineStage[] = [
    { $match: whereConditions },
    { $sort: sortConditions },
    { $skip: Number(skip) || 0 },
    { $limit: Number(limit) || 99999 },
      ///***************** */ category field ******start
    
  ];

  // console.log(pipeline);
  const result = await ContactMail.aggregate(pipeline);
  // console.log(result, 127);
  const total = await ContactMail.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get single ContactMaile form db
const getSingleContactMailFromDb = async (
  id: string,
): Promise<IContactMail | null> => {
  const pipeline: PipelineStage[] = [
    { $match: { _id: new Types.ObjectId(id) } },
    
  ];

  const result = await ContactMail.aggregate(pipeline);

  return result[0];
};

// update ContactMaile form db
const updateContactMailFromDb = async (
  id: string,
  payload: Partial<IContactMail>,
): Promise<IContactMail | null> => {
  const result = await ContactMail.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

// delete ContactMaile form db
const deleteContactMailByIdFromDb = async (
  id: string,
): Promise<IContactMail | null> => {
  const result = await ContactMail.findOneAndDelete({ _id: id });
  return result;
};
//

//getAllContactMailChildrenFromDb
const getAllContactMailChildrenTitleFromDb = async (
  filters: IContactMailFilters,
  paginationOptions: IPaginationOption,
): Promise<IGenericResponse<IContactMail[]>> => {
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
      $or: ContactMail_SEARCHABLE_FIELDS.map(field => ({
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

  // const result = await ContactMail.find(whereConditions)
  //   .populate('thumbnail')
  //   .sort(sortConditions)
  //   .skip(Number(skip))
  //   .limit(Number(limit));
  const pipeline: PipelineStage[] = [
    { $match: whereConditions },
    { $sort: sortConditions },
    { $skip: Number(skip) || 0 },
    { $limit: Number(limit) || 15 },
    
  ];
  // console.log(pipeline);
  const result = await ContactMail.aggregate(pipeline);
  // console.log(result, 127);
  const total = await ContactMail.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const ContactMailService = {
  createContactMailByDb,
  getAllContactMailFromDb,
  getSingleContactMailFromDb,
  updateContactMailFromDb,
  deleteContactMailByIdFromDb,
  getAllContactMailChildrenTitleFromDb,
};
