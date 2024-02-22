/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';
// import { globalImport } from '../../../import/global_Import';
// import ApiError from '../../errors/ApiError';
import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';

import { Types } from 'mongoose';
import { ENUM_STATUS, ENUM_YN } from '../../../enums/globalEnums';
import { ENUM_USER_ROLE } from '../../../enums/users';
import ApiError from '../../errors/ApiError';
import { StudentPurchasePackageCategoryCourse } from '../addStudentToPackageAndCourse/model.studentPurchaseCourseBuy';
import { Purchase_category } from '../purchase_category/purchase_category.model';
import { PurchasePackage } from '../purchase_package/purchase_package.model';
import { User } from '../user/user.model';
import { CATEGORY_FILTERABLE_FIELDS } from './consent.category';
import { ICategory } from './interface.category';
import { CategoryService } from './service.category';

// import { z } from 'zod'
const createCategory = catchAsync(async (req: Request, res: Response) => {
  const { ...categoryData } = req.body;
  const result = await CategoryService.createCategoryByDb(categoryData);

  sendResponse<ICategory>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull create category Category',
    data: result,
  });
  // next();
  /* res.status(200).send({
      success: true,
      data: result,
      message: 'successfull create category Category',
    }); */
});

const getAllCategory = catchAsync(async (req: Request, res: Response) => {
  //****************search and filter start******* */
  let queryObject = req.query;
  queryObject = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(queryObject).filter(([_, value]) => Boolean(value)),
  );
  const filters = pick(queryObject, CATEGORY_FILTERABLE_FIELDS);

  //****************pagination start************ */

  const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

  const result = await CategoryService.getAllCategoryFromDb(
    filters,
    paginationOptions,
  );

  sendResponse<ICategory[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull Get category Category',
    meta: result.meta,
    data: result.data,
  });
  // next();
});
const checkPurchaseCategory = catchAsync(
  async (req: Request, res: Response) => {

    let result2 = false;

    if (req?.user?.role === ENUM_USER_ROLE.STUDENT) {
      const checkCategory = await Purchase_category.findOne({
        category: new Types.ObjectId(req.params.id),
        user: new Types.ObjectId(req.user.id),
        isDelete: ENUM_YN.NO,
        status: ENUM_STATUS.ACTIVE,
      });
      if (checkCategory) {
        if (new Date(checkCategory?.expiry_date)?.getTime() < Date.now()) {
          throw new ApiError(400, 'Your package has expired please Renew it');
        } else {
          result2 = true;
        }
      }
      if (!result2) {
        const query: any = {};
      
        const getAuthor = await User.findOne({
          _id: req?.user?.id,
          isDelete: ENUM_YN.NO,
          status: ENUM_STATUS.ACTIVE,
        });
        console.log("🚀 ~ getAuthor:", getAuthor)
        if (getAuthor?.author) {
          //@ts-ignore
          query.author = getAuthor?.author
        }
        
        const checkPackage = await StudentPurchasePackageCategoryCourse.find({
          ...query,
          user: getAuthor?._id,
          isDelete: ENUM_YN.NO,
          status: ENUM_STATUS.ACTIVE,
        }).populate('sellerPackage');
        console.log("🚀 ~ checkPackage:", checkPackage)

        if (checkPackage.length) {
          checkPackage.forEach((data: any) => {
            // if (data?.sellerPackage && new Date(data.sellerPackage?.expiry_date)?.getTime() < Date.now()) {
            //   throw new ApiError(400, 'Your package has expired please Renew it');
            // }
            if (
              new Date(data?.sellerPackage?.expiry_date)?.getTime() > Date.now()
            ) {
              data?.sellerPackage?.categories?.forEach((data: any) => {
                if (data?.category?.toString() === req.params.id) {
                  result2 = true;
                }
              });
            }
          });
        }
      }
    } else if (req?.user?.role === ENUM_USER_ROLE.SELLER) {
      const checkPackage = await PurchasePackage.find({
        user: new Types.ObjectId(req?.user?.id),
        isDelete: ENUM_YN.NO,
        status: ENUM_STATUS.ACTIVE,
        'categories.category': new Types.ObjectId(req.params.id),
      });
      console.log('🚀 ~ checkPackage:', checkPackage);
      if (checkPackage.length) {
        checkPackage.forEach((data: any) => {
          if (new Date(data?.expiry_date)?.getTime() > Date.now()) {
            result2 = true;
          }
        });
      }
    } else if (req?.user?.role === ENUM_USER_ROLE.ADMIN) {
      result2 = true;
    }
    console.log('🚀 ~ result2:', result2);

    sendResponse<any>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull Get category Category',
      data: result2,
    });
    // next();
  },
);

const getAllCategoryChildrenTitle = catchAsync(
  async (req: Request, res: Response) => {
    //****************search and filter start******* */
    let queryObject = req.query;
    queryObject = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(queryObject).filter(([_, value]) => Boolean(value)),
    );
    const filters = pick(queryObject, CATEGORY_FILTERABLE_FIELDS);

    //****************pagination start************ */

    const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

    const result = await CategoryService.getAllCategoryChildrenTitleFromDb(
      filters,
      paginationOptions,
    );

    sendResponse<ICategory[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull Get category Category',
      meta: result.meta,
      data: result.data,
    });
    // next();
  },
);

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  /*   if (!globalImport.ObjectId.isValid(id)) {
      throw new ApiError(400, 'invalid id sampod');
    } */

  const result = await CategoryService.getSingleCategoryFromDb(id);

  /* if (!result) {
      throw new ApiError(400, 'No data found');
    } */
  sendResponse<ICategory>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get category Category',
    data: result,
  });
});
const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  /*   if (!globalImport.ObjectId.isValid(id)) {
      throw new ApiError(400, 'invalid id sampod');
    } */

  const result = await CategoryService.updateCategoryFromDb(id, updateData);

  /* if (!result) {
      throw new ApiError(400, 'No data found');
    } */
  sendResponse<ICategory>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull update category Category',
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryService.deleteCategoryByIdFromDb(id);
  sendResponse<ICategory>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull delete category Category',
    data: result,
  });
});
export const CategoryController = {
  createCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
  getAllCategoryChildrenTitle,
  checkPurchaseCategory,
};
