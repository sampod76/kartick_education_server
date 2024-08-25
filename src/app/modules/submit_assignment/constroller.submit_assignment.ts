/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';
// import { globalImport } from '../../../import/global_Import';
// import ApiError from '../../errors/ApiError';
import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';

import { SubmitAssignment_FILTERABLE_FIELDS } from './consent.submit_assignment';
import { ISubmitAssignment } from './interface.submit_assignment';
import { SubmitAssignmentService } from './service.submit_assignment';

// import { z } from 'zod'
const createSubmitAssignment = catchAsync(
  async (req: Request, res: Response) => {
    const { ...AssignmentData } = req.body;

    AssignmentData.author = req?.user?.id;
    const result =
      await SubmitAssignmentService.createSubmitAssignmentByDb(AssignmentData);

    sendResponse<ISubmitAssignment>(res, {
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
  },
);

const getAllSubmitAssignment = catchAsync(
  async (req: Request, res: Response) => {
    //****************search and filter start******* */
    const queryObject = req.query;
    console.log('🚀 ~ queryObject:', queryObject);

    const filters = pick(queryObject, SubmitAssignment_FILTERABLE_FIELDS);
    console.log('🚀 ~ filters:', filters);

    //****************pagination start************ */

    const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

    const result = await SubmitAssignmentService.getAllSubmitAssignmentFromDb(
      filters,
      paginationOptions,
    );

    sendResponse<ISubmitAssignment[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull Get Assignment Assignment',
      meta: result.meta,
      data: result.data,
    });
    // next();
  },
);

const getSingleSubmitAssignment = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    /*   if (!globalImport.ObjectId.isValid(id)) {
      throw new ApiError(400, 'invalid id sampod');
    } */

    const result =
      await SubmitAssignmentService.getSingleSubmitAssignmentFromDb(id);

    /* if (!result) {
      throw new ApiError(400, 'No data found');
    } */
    sendResponse<ISubmitAssignment>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull get Assignment Assignment',
      data: result,
    });
  },
);
const updateSubmitAssignment = catchAsync(
  async (req: Request, res: Response) => {
    console.log('🚀 ~ AssignmentData:', req.body);
    const { id } = req.params;
    const updateData = req.body;
    /*   if (!globalImport.ObjectId.isValid(id)) {
      throw new ApiError(400, 'invalid id sampod');
    } */

    const result = await SubmitAssignmentService.updateSubmitAssignmentFromDb(
      id,
      updateData,
    );

    /* if (!result) {
      throw new ApiError(400, 'No data found');
    } */
    sendResponse<ISubmitAssignment>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull update Assignment Assignment',
      data: result,
    });
  },
);

const deleteSubmitAssignment = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await SubmitAssignmentService.deleteSubmitAssignmentByIdFromDb(id);
    sendResponse<ISubmitAssignment>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull delete Assignment Assignment',
      data: result,
    });
  },
);
export const SubmitAssignmentController = {
  createSubmitAssignment,
  getAllSubmitAssignment,
  getSingleSubmitAssignment,
  updateSubmitAssignment,
  deleteSubmitAssignment,
};
