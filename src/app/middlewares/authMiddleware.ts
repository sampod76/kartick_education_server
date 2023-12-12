import { NextFunction, Request, Response } from 'express';

import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import { jwtHelpers } from '../../helper/jwtHelpers';
import ApiError from '../errors/ApiError';
import firebaseAdmin from './firebaseAdmin';


const authMiddleware =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get authorization token
      let verifiedUser = null;
      const token = req.headers.authorization;
     
      const firebase_token = req.headers.firebase_token
  
      if(firebase_token){
        try {
          
          const decodedToken = await firebaseAdmin.auth().verifyIdToken(firebase_token as string);
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { name,email,uid,_id } = decodedToken
          // verifiedUser=decodedToken
          // if(!_id){
          //    await firebaseAdmin.auth().setCustomUserClaims("PRHvW67qPqQ4jX3iYmKyrF49b2w1",{_id:"6497ff5cd4516198fb1ac558",role:"admin"}); 
          // }
          console.log(decodedToken);
          // req.user=decodedToken
        } catch (error) {
          console.log("🚀 ~ file: authMiddleware.ts:36 ~ error:", error)
          throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
      
        }
       
      }
      // if (!token && !firebase_token) {
      //   throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
      // } 
   

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
      }


      // verify token only general user

      if (token) {
        verifiedUser = jwtHelpers.verifyToken(
          token,
          config.jwt.secret as Secret
        );
        req.user = verifiedUser;
      }
    


      // role diye guard korar jnno
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser?.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access');
      }

      //chack token user
      // if (
      //   !(await User.isUserExist(verifiedUser?.email)) &&
      //   !(await GeneralUser.findOne({ uid: verifiedUser?.uid }))
      // ) {
      //   throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access');
      // }
      next();
    } catch (error) {
      next(error);
    }
  };

export default authMiddleware;
