"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { CategoryRoute } from '../modules/category/route.category';
const auth_route_1 = require("../modules/auth/auth.route");
const route_category_1 = require("../modules/category/route.category");
const course_route_1 = require("../modules/course/course.route");
const lesson_route_1 = require("../modules/lesson/lesson.route");
const milestone_route_1 = require("../modules/milestone/milestone.route");
const module_route_1 = require("../modules/module/module.route");
const user_route_1 = require("../modules/user/user.route");
// import { FileUploadeRoute } from '../modules/fileUploade/route.fileUploade';
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/course',
        route: course_route_1.CourseRoute,
    },
    {
        path: '/milestone',
        route: milestone_route_1.MilestoneRoute,
    },
    {
        path: '/module',
        route: module_route_1.ModuleRoute,
    },
    {
        path: '/lesson',
        route: lesson_route_1.LessonRoute,
    },
    {
        path: '/user',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/category',
        route: route_category_1.CategoryRoute,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
