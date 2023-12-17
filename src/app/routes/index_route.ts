import express from 'express';

// import { CategoryRoute } from '../modules/category/route.category';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CategoryRoute } from '../modules/category/route.category';
import { CourseRoute } from '../modules/course/course.route';
import { LessonRoute } from '../modules/lesson/lesson.route';
import { MilestoneRoute } from '../modules/milestone/milestone.route';
import { ModuleRoute } from '../modules/module/module.route';
import { UserRoutes } from '../modules/user/user.route';

// import { FileUploadeRoute } from '../modules/fileUploade/route.fileUploade';


const router = express.Router();

const moduleRoutes = [
  {
    path: '/course',
    route: CourseRoute,
  },
  {
    path: '/milestone',
    route: MilestoneRoute,
  },
  {
    path: '/module',
    route: ModuleRoute,
  },
  {
    path: '/lesson',
    route: LessonRoute,
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
