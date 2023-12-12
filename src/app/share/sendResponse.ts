import { Response } from 'express';

type IApiResponse<T> = {
  statusCode?: number;
  success: boolean;
  message?: string | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data?: T | null; //এটা আমরা জানি না এটা একটা সিঙ্গেল অবজেক্ট হতে পারে একটা array  হতে পারে
};

const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  const responseData: IApiResponse<T> = {
    statusCode: data.statusCode || 200,
    success: data.success,
    message: data.message || null,
    meta: data.meta || null || undefined,
    data: data.data || null,
  };
  res.status(data.statusCode || 200).send(responseData);
};

export default sendResponse;
