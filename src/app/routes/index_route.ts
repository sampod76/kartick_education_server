import express from 'express';

// import { CategoryRoute } from '../modules/category/route.category';
import { AdminRoutes } from '../modules/admin/admin.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CategoryRoute } from '../modules/category/route.category';
import { CourseRoute } from '../modules/course/course.route';
import { LessonRoute } from '../modules/lesson/lesson.route';
import { MilestoneRoute } from '../modules/milestone/milestone.route';

import { FileUploadeRoute } from '../modules/fileUploade/route.fileUploade';
import { ModuleRoute } from '../modules/module/module.route';
import { QuizRoute } from '../modules/quiz/quiz.route';
import { SellerRoutes } from '../modules/seller/seller.route';
import { SingleQuizRoute } from '../modules/single_quiz/single_quiz.route';
import { StudentRoutes } from '../modules/student/student.route';
import { TrainerRoutes } from '../modules/trainer/trainer.route';
import { UserRoutes } from '../modules/user/user.route';
import { GlossaryRoute } from '../modules/glossary/glossary.route';
import { ResourceRoute } from '../modules/resource/resource.route';
import { QuizSubmitRoute } from '../modules/quizSubmit/quizSubmit.route';
import { PackageRoute } from '../modules/package/package.route';
import { PaymentRoute } from '../modules/payment/payment.router';
import { PurchasePackageRoute } from '../modules/purchase_package/purchase_package.route';
import { StudentPurchasePackageCourseRoute } from '../modules/addStudentToPackageAndCourse/studentPurchaseCourseBuy.route';

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
    path: '/quiz',
    route: QuizRoute,
  },
  {
    path: '/single-quiz',
    route: SingleQuizRoute,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/student',
    route: StudentRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/seller',
    route: SellerRoutes,
  },
  {
    path: '/trainer',
    route: TrainerRoutes,
  },

  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/category',
    route: CategoryRoute,
  },
  {
    path: '/glossary',
    route: GlossaryRoute,
  },
  {
    path: '/resource',
    route: ResourceRoute,
  },
  {
    path: '/upload',
    route: FileUploadeRoute,
  },
  {
    path: '/quiz_submit',
    route: QuizSubmitRoute,
  },
  {
    path: '/packages',
    route: PackageRoute,
  },
  {
    path: '/purchase_packages',
    route: PurchasePackageRoute,
  },
  {
    path: '/student_purchase_packages_course',
    route: StudentPurchasePackageCourseRoute,
  },
  {
    path: '/payment',
    route: PaymentRoute,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
