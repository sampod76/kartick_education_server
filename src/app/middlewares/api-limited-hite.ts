import { NextFunction, Request, Response } from 'express';
import rateLimit, { MemoryStore } from 'express-rate-limit';
import { ParamsDictionary } from 'express-serve-static-core';

export const apiLimiter = (limite = 160) => {
  const limiter = rateLimit({
    // windowMs: 10 * 60 * 1000, // 10 minutes
    windowMs: 60 * 60 * 1000, // 1 hour
    max: limite, // Limit each IP to the specified number of requests per hour
    message: {
      success: false,
      message: `In 60 minutes you have already taken data ${limite} times in IP, try again after 60 minutes`,
    },
    standardHeaders: true,
    headers: true, // Return rate limit info in the `RateLimit-*` headers
    store: new MemoryStore(), // Use the in-memory store
  });

  return async (
    req: Request<ParamsDictionary, any, any, any, Record<string, any>>,
    res: Response<any>,
    next: NextFunction
  ) => {
    try {
      await limiter(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
