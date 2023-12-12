import { Request, Response, NextFunction, RequestHandler } from 'express';

const catchAsync = (fullFunctionBody: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fullFunctionBody(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export default catchAsync;
