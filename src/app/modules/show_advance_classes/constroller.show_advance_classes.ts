import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';

import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { Show_advance_classes_FILTERABLE_FIELDS } from './constant.show_advance_classes';
import { IShow_advance_classes } from './interface.show_advance_classes';
import { Show_advance_classesService } from './service.show_advance_classes';

// import { z } from 'zod'
const createShow_advance_classes = catchAsync(
  async (req: Request, res: Response) => {
    const { ...Show_advance_classesData } = req.body;
    const result =
      await Show_advance_classesService.createShow_advance_classesByDb(
        Show_advance_classesData,
      );
    sendResponse<IShow_advance_classes>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull create academic Show_advance_classes',
      data: result,
    });
  },
);

const getAllShow_advance_classes = catchAsync(
  async (req: Request, res: Response) => {
    //****************search and filter start******* */
    // console.log(req.query);
    const queryObject = req.query;
    const filters = pick(queryObject, Show_advance_classes_FILTERABLE_FIELDS);
    //****************pagination start************ */
    const paginationOptions = pick(queryObject, PAGINATION_FIELDS);
    const result =
      await Show_advance_classesService.getAllShow_advance_classesFromDb(
        filters,
        paginationOptions,
      );
    sendResponse<IShow_advance_classes[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull Get academic Show_advance_classes',
      meta: result.meta,
      data: result.data,
    });
    // next();
  },
);

const getSingleShow_advance_classes = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await Show_advance_classesService.getSingleShow_advance_classesFromDb(id);
    sendResponse<IShow_advance_classes>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull get academic Show_advance_classes',
      data: result,
    });
  },
);

const updateShow_advance_classes = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const result =
      await Show_advance_classesService.updateShow_advance_classesFromDb(
        id,
        updateData,
      );

    sendResponse<IShow_advance_classes>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull update academic Show_advance_classes',
      data: result,
    });
  },
);

const deleteShow_advance_classes = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await Show_advance_classesService.deleteShow_advance_classesByIdFromDb(
        id,
        req.query,
      );
    sendResponse<IShow_advance_classes>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull delete academic Show_advance_classes',
      data: result,
    });
  },
);

export const Show_advance_classesController = {
  createShow_advance_classes,
  getAllShow_advance_classes,
  getSingleShow_advance_classes,
  updateShow_advance_classes,
  deleteShow_advance_classes,
};
