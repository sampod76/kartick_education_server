import express from 'express';

// import { CategoryRoute } from '../modules/category/route.category';

import { AuthRoutes } from '../modules/auth/auth.route';

import { CourseRoute } from '../modules/course/course.route';

import { FileUploadeRoute } from '../modules/fileUploade/route.fileUploade';

import { UserLoginHistoryRoutes } from '../modules/loginHistory/loginHistory.route';
import { shopRoutes } from '../modules/shop_info/shop.route';
import { surpriseBagRoutes } from '../modules/surprise_bag/surprise.route';
import { userRoutes } from '../modules/user/user.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/course',
    route: CourseRoute,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/upload',
    route: FileUploadeRoute,
  },
  {
    path: '/login_history',
    route: UserLoginHistoryRoutes,
  },

  {
    path: '/shops',
    route: shopRoutes,
  },
  {
    path: '/surprise-bag',
    route: surpriseBagRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
