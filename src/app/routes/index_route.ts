import express from 'express';

// import { CategoryRoute } from '../modules/category/route.category';
import { CourseRoute } from '../modules/course/course.route';

// import { FileUploadeRoute } from '../modules/fileUploade/route.fileUploade';



//https://docs.google.com/document/d/1gTsTpFvhfZB-2y0_BbZQVzmbG3YwsZwPrwAbsYqpOzM/edit
const router = express.Router();

const moduleRoutes = [

  {
    path: '/course',
    route: CourseRoute,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
