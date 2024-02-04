import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';

import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { GLOSSARY_FILTERABLE_FIELDS } from './glossary.constant';
import { IGlossary } from './glossary.interface';
import { GlossaryService } from './glossary.service';

// import { z } from 'zod'
const createGlossary = catchAsync(async (req: Request, res: Response) => {
  const { ...GlossaryData } = req.body;

  const result = await GlossaryService.createGlossaryByDb(GlossaryData);

  sendResponse<IGlossary>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull create Glossary',
    data: result,
  });
});

const getAllGlossary = catchAsync(async (req: Request, res: Response) => {
  //****************search and filter start******* */
  // console.log(req.query);
  const queryObject = req.query;

  const filters = pick(queryObject, GLOSSARY_FILTERABLE_FIELDS);

  //****************pagination start************ */

  const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

  const result = await GlossaryService.getAllGlossaryFromDb(
    filters,
    paginationOptions
  );

  sendResponse<IGlossary[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull Get  Glossary',
    meta: result.meta,
    data: result.data,
  });
  // next();
});

const getSingleGlossary = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await GlossaryService.getSingleGlossaryFromDb(id);
  sendResponse<IGlossary>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get  Glossary',
    data: result,
  });
});
const updateGlossary = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const result = await GlossaryService.updateGlossaryFromDb(id, updateData);

  sendResponse<IGlossary>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull update  Glossary',
    data: result,
  });
});

const deleteGlossary = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await GlossaryService.deleteGlossaryByIdFromDb(
    id,
    req.query
  );
  sendResponse<IGlossary>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull delete  Glossary',
    data: result,
  });
});

const GlossaryReviewsByUser = catchAsync(
  async (req: Request, res: Response) => {
    // const { id } = req.params;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await GlossaryService.GlossaryReviewsByUserFromDb();

    sendResponse<IGlossary>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull update reviews',
      data: result,
    });
  }
);
export const GlossaryController = {
  createGlossary,
  getAllGlossary,
  getSingleGlossary,
  updateGlossary,
  deleteGlossary,
  GlossaryReviewsByUser,
};
