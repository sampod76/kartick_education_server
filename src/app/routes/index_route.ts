import express from 'express';

// import { CategoryRoute } from '../modules/category/route.category';
import { AdminRoutes } from '../modules/admin/admin.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CategoryRoute } from '../modules/category/route.category';
import { CourseRoute } from '../modules/course/course.route';
import { LessonRoute } from '../modules/lesson/lesson.route';
import { MilestoneRoute } from '../modules/milestone/milestone.route';

import { StudentPurchasePackageCourseRoute } from '../modules/addStudentToPackageAndCourse/route.studentPurchaseCourseBuy';
import { CourseCartRoute } from '../modules/courseCart/courseCart.route';
import { Course_labelRoute } from '../modules/course_label/route.course_label';
import { FileUploadeRoute } from '../modules/fileUploade/route.fileUploade';
import { GlossaryRoute } from '../modules/glossary/glossary.route';
import { UserLoginHistoryRoutes } from '../modules/loginHistory/loginHistory.route';
import { ModuleRoute } from '../modules/module/module.route';
import { PackageRoute } from '../modules/package/package.route';
import { PaymentRoute } from '../modules/payment/payment.router';
import { PurchaseCourseRoute } from '../modules/purchase_courses/purchase_courses.route';
import { PurchasePackageRoute } from '../modules/purchase_package/purchase_package.route';
import { QuizRoute } from '../modules/quiz/quiz.route';
import { QuizSubmitRoute } from '../modules/quizSubmit/quizSubmit.route';
import { ResourceRoute } from '../modules/resource/resource.route';
import { SellerRoutes } from '../modules/seller/seller.route';
import { Short_overviewRoute } from '../modules/short_overview/short_overview.route';
import { Show_advance_classesRoute } from '../modules/show_advance_classes/route.show_advance_classes';
import { SingleQuizRoute } from '../modules/single_quiz/single_quiz.route';
import { Skills_planRoute } from '../modules/skills_plan/skills_plan.route';
import { StudentRoutes } from '../modules/student/student.route';
import { TrainerRoutes } from '../modules/trainer/trainer.route';
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
    path: '/purchase_courses',
    route: PurchaseCourseRoute,
  },
  {
    path: '/student_purchase_packages_course',
    route: StudentPurchasePackageCourseRoute,
  },
  {
    path: '/payment',
    route: PaymentRoute,
  },
  {
    path: '/login_history',
    route: UserLoginHistoryRoutes,
  },
  {
    path: '/course-cart',
    route: CourseCartRoute,
  },
  {
    path: '/upload',
    route: CourseCartRoute,
  },
  {
    path: '/show_advance_classes',
    route: Show_advance_classesRoute,
  },
  {
    path: '/skills_plan',
    route: Skills_planRoute,
  },
  {
    path: '/short_overview',
    route: Short_overviewRoute,
  },
  {
    path: '/course_label',
    route: Course_labelRoute,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
