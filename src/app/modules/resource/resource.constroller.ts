import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';

import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { ResourceService } from './resource.service';
import { RESOURCE_FILTERABLE_FIELDS } from './resource.constant';
import { IResource } from './resource.interface';

// import { z } from 'zod'
const createResource = catchAsync(async (req: Request, res: Response) => {
  const { ...ResourceData } = req.body;

  const result = await ResourceService.createResourceByDb(ResourceData);

  sendResponse<IResource>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull create Resource',
    data: result,
  });
});

const getAllResource = catchAsync(async (req: Request, res: Response) => {
  //****************search and filter start******* */
  // console.log(req.query);
  const queryObject = req.query;

  const filters = pick(queryObject, RESOURCE_FILTERABLE_FIELDS);

  //****************pagination start************ */

  const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

  const result = await ResourceService.getAllResourceFromDb(
    filters,
    paginationOptions
  );

  sendResponse<IResource[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull Get  Resource',
    meta: result.meta,
    data: result.data,
  });
  // next();
});

const getSingleResource = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ResourceService.getSingleResourceFromDb(id);
  sendResponse<IResource>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get  Resource',
    data: result,
  });
});
const updateResource = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const result = await ResourceService.updateResourceFromDb(id, updateData);

  sendResponse<IResource>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull update  Resource',
    data: result,
  });
});

const deleteResource = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ResourceService.deleteResourceByIdFromDb(
    id,
    req.query
  );
  sendResponse<IResource>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull delete  Resource',
    data: result,
  });
});

const ResourceReviewsByUser = catchAsync(
  async (req: Request, res: Response) => {
    // const { id } = req.params;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await ResourceService.ResourceReviewsByUserFromDb();

    sendResponse<IResource>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull update reviews',
      data: result,
    });
  }
);
export const ResourceController = {
  createResource,
  getAllResource,
  getSingleResource,
  updateResource,
  deleteResource,
  ResourceReviewsByUser,
};
