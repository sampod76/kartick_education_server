import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';

import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { Short_overview_FILTERABLE_FIELDS } from './short_overview.constant';
import { IShort_overview } from './short_overview.interface';
import { Short_overviewService } from './short_overview.service';

// import { z } from 'zod'
const createShort_overview = catchAsync(async (req: Request, res: Response) => {
  const { ...Short_overviewData } = req.body;
  const result =
    await Short_overviewService.createShort_overviewByDb(Short_overviewData);
  sendResponse<IShort_overview>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull create academic Short_overview',
    data: result,
  });
});

const getAllShort_overview = catchAsync(async (req: Request, res: Response) => {
  //****************search and filter start******* */
  // console.log(req.query);
  const queryObject = req.query;
  const filters = pick(queryObject, Short_overview_FILTERABLE_FIELDS);
  //****************pagination start************ */
  const paginationOptions = pick(queryObject, PAGINATION_FIELDS);
  const result = await Short_overviewService.getAllShort_overviewFromDb(
    filters,
    paginationOptions,
  );
  sendResponse<IShort_overview[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull Get academic Short_overview',
    meta: result.meta,
    data: result.data,
  });
  // next();
});

const getSingleShort_overview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await Short_overviewService.getSingleShort_overviewFromDb(id);
  sendResponse<IShort_overview>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get academic Short_overview',
    data: result,
  });
});

const updateShort_overview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const result = await Short_overviewService.updateShort_overviewFromDb(
    id,
    updateData,
  );

  sendResponse<IShort_overview>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull update academic Short_overview',
    data: result,
  });
});

const deleteShort_overview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await Short_overviewService.deleteShort_overviewByIdFromDb(
    id,
    req.query,
  );
  sendResponse<IShort_overview>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull delete academic Short_overview',
    data: result,
  });
});

export const Short_overviewController = {
  createShort_overview,
  getAllShort_overview,
  getSingleShort_overview,
  updateShort_overview,
  deleteShort_overview,
};
