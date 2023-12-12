import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodEffects } from 'zod';

//
const validateRequestZod =
  (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });
      return next();
    } catch (error) {
      next(error);
    }
  };

export default validateRequestZod;

/*
 ফাংশনের ভিতর থেকে অন্য আরেকটি ফাংশন রিটার্ন করার অনেকগুলো কারণ আছে | এখানে যেটি ব্যবহার করা হয়েছে আমাদের রাউর থেকে যখন কোন ফাংশন ডিক্লেয়ার করা হয় তখন ওই ফাংশনে কোন প্যারামিটার নেই না বাই ডিফল্ট  | 
 2.শুধুমাত্র তিনটা জিনিস নাই তাও কন্ট্রোলারে , req,res,next
 3.a ক্ষেত্রে আমরা আমাদের একটা ফাংশন নিয়েছি, যারও ভিতর থেকে আরেকটা ফাংশন রিটার্ন করেছি , সেই ফাংশনটা আবার এই তিনটা জিনিসের (req,res,next) রিটার্ন করতেছে 

 */
