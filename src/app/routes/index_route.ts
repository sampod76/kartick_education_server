import express from 'express';

// import { CategoryRoute } from '../modules/category/route.category';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CategoryRoute } from '../modules/category/route.category';
import { CourseRoute } from '../modules/course/course.route';
import { UserRoutes } from '../modules/user/user.route';

// import { FileUploadeRoute } from '../modules/fileUploade/route.fileUploade';

//https://docs.google.com/document/d/1gTsTpFvhfZB-2y0_BbZQVzmbG3YwsZwPrwAbsYqpOzM/edit
const router = express.Router();

const moduleRoutes = [
  {
    path: '/course',
    route: CourseRoute,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/category',
    route: CategoryRoute,
  },

];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
