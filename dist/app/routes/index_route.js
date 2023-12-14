"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { CategoryRoute } from '../modules/category/route.category';
const course_route_1 = require("../modules/course/course.route");
const deshbord_router_1 = require("../modules/deshbord/deshbord.router");
// import { FileUploadeRoute } from '../modules/fileUploade/route.fileUploade';
//https://docs.google.com/document/d/1gTsTpFvhfZB-2y0_BbZQVzmbG3YwsZwPrwAbsYqpOzM/edit
const router = express_1.default.Router();
const moduleRoutes = [
    // {
    //   path: '/users',
    //   route: UserRoute,
    // },
    {
        path: '/deshbord',
        route: deshbord_router_1.DeshbordRoute,
    },
    // {
    //   // only user login and refresh-token
    //   path: '/auth',
    //   route: AuthRouter,
    // },
    {
        path: '/course',
        route: course_route_1.CourseRoute,
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
exports.default = router;
