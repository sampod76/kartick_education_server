import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';

import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { Skills_planService } from './skills_plan.service';
import { skills_plan_FILTERABLE_FIELDS } from './skills_plan.constant';
import { ISkills_plan } from './skills_plan.interface';

// import { z } from 'zod'
const createSkills_plan = catchAsync(async (req: Request, res: Response) => {
  const { ...Skills_planData } = req.body;
  const result =
    await Skills_planService.createSkills_planByDb(Skills_planData);
  sendResponse<ISkills_plan>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull create academic Skills_plan',
    data: result,
  });
});

const getAllSkills_plan = catchAsync(async (req: Request, res: Response) => {
  //****************search and filter start******* */
  // console.log(req.query);
  const queryObject = req.query;
  const filters = pick(queryObject, skills_plan_FILTERABLE_FIELDS);
  //****************pagination start************ */
  const paginationOptions = pick(queryObject, PAGINATION_FIELDS);
  const result = await Skills_planService.getAllSkills_planFromDb(
    filters,
    paginationOptions,
  );
  sendResponse<ISkills_plan[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull Get academic Skills_plan',
    meta: result.meta,
    data: result.data,
  });
  // next();
});

const getSingleSkills_plan = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await Skills_planService.getSingleSkills_planFromDb(id);
  sendResponse<ISkills_plan>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get academic Skills_plan',
    data: result,
  });
});

const updateSkills_plan = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const result = await Skills_planService.updateSkills_planFromDb(
    id,
    updateData,
  );

  sendResponse<ISkills_plan>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull update academic Skills_plan',
    data: result,
  });
});

const deleteSkills_plan = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await Skills_planService.deleteSkills_planByIdFromDb(
    id,
    req.query,
  );
  sendResponse<ISkills_plan>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull delete academic Skills_plan',
    data: result,
  });
});

export const Skills_planController = {
  createSkills_plan,
  getAllSkills_plan,
  getSingleSkills_plan,
  updateSkills_plan,
  deleteSkills_plan,
};
