/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';
// import { globalImport } from '../../../import/global_Import';
// import ApiError from '../../errors/ApiError';
import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';

import { ASSESSMENT_FILTERABLE_FIELDS } from './consent.assignment';
import { IAssignment } from './interface.assignment';
import { AssignmentService } from './service.assignment';

// import { z } from 'zod'
const createAssignment = catchAsync(async (req: Request, res: Response) => {
  const { ...AssignmentData } = req.body;
  const result = await AssignmentService.createAssignmentByDb(AssignmentData);

  sendResponse<IAssignment>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull create Assignment Assignment',
    data: result,
  });
  // next();
  /* res.status(200).send({
      success: true,
      data: result,
      message: 'successfull create Assignment Assignment',
    }); */
});

const getAllAssignment = catchAsync(async (req: Request, res: Response) => {
  //****************search and filter start******* */
  let queryObject = req.query;
  queryObject = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(queryObject).filter(([_, value]) => Boolean(value)),
  );
  const filters = pick(queryObject, ASSESSMENT_FILTERABLE_FIELDS);

  //****************pagination start************ */

  const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

  const result = await AssignmentService.getAllAssignmentFromDb(
    filters,
    paginationOptions,
  );

  sendResponse<IAssignment[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull Get Assignment Assignment',
    meta: result.meta,
    data: result.data,
  });
  // next();
});

const getSingleAssignment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  /*   if (!globalImport.ObjectId.isValid(id)) {
      throw new ApiError(400, 'invalid id sampod');
    } */

  const result = await AssignmentService.getSingleAssignmentFromDb(id);

  /* if (!result) {
      throw new ApiError(400, 'No data found');
    } */
  sendResponse<IAssignment>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get Assignment Assignment',
    data: result,
  });
});
const updateAssignment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  /*   if (!globalImport.ObjectId.isValid(id)) {
      throw new ApiError(400, 'invalid id sampod');
    } */

  const result = await AssignmentService.updateAssignmentFromDb(id, updateData);

  /* if (!result) {
      throw new ApiError(400, 'No data found');
    } */
  sendResponse<IAssignment>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull update Assignment Assignment',
    data: result,
  });
});

const deleteAssignment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AssignmentService.deleteAssignmentByIdFromDb(id);
  sendResponse<IAssignment>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull delete Assignment Assignment',
    data: result,
  });
});
export const AssignmentController = {
  createAssignment,
  getAllAssignment,
  getSingleAssignment,
  updateAssignment,
  deleteAssignment,
};
