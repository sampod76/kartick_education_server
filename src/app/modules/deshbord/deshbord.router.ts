import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import { deshbord } from './deshbord.controller';

const router = express.Router();

router
  .route('/')
  .get(authMiddleware(ENUM_USER_ROLE.ADMIN), deshbord.getDeshbordData);

export const DeshbordRoute = router;
