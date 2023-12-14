import express from 'express';

// import { CategoryRoute } from '../modules/category/route.category';
import { CourseRoute } from '../modules/course/course.route';
import { DeshbordRoute } from '../modules/deshbord/deshbord.router';
// import { FileUploadeRoute } from '../modules/fileUploade/route.fileUploade';



//https://docs.google.com/document/d/1gTsTpFvhfZB-2y0_BbZQVzmbG3YwsZwPrwAbsYqpOzM/edit
const router = express.Router();

const moduleRoutes = [
  // {
  //   path: '/users',
  //   route: UserRoute,
  // },

  {
    path: '/deshbord',
    route: DeshbordRoute,
  },

 
  // {
  //   // only user login and refresh-token
  //   path: '/auth',
  //   route: AuthRouter,
  // },
  {
    path: '/course',
    route: CourseRoute,
  },

  // {
  //   path: '/category',
  //   route: CategoryRoute,
  // },
  // {
  //   path: '/payment',
  //   route: PaymentRoute,
  // },
 
  // {
  //   path: '/upload',
  //   route: FileUploadeRoute,
  // },
 
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
