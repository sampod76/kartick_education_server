"use strict";
// import { Admin } from '../admin/admin.model';
// import { GeneralUser } from '../generalUser/model.GeneralUser';
// import { Moderator } from '../moderator/moderator.model';
// import { Course } from '../course/course.model';
// import { Lession } from '../lession/lession.model';
// import { Purchased_courses } from '../purchased_courses/purchased_courses.model';
// const deshbordFromDb = async (): Promise<any> => {
//   const totalUser = await GeneralUser.countDocuments();
//   const totalAdmin = await Admin.countDocuments();
//   const totalModarator = await Moderator.countDocuments();
//   const totalCourse = await Course.countDocuments();
//   const recentPublishCourse = await Course.find()
//     .sort({ createdAt: -1 })
//     .limit(15);
//   const recentPublishLession = await Lession.find()
//     .sort({ createdAt: -1 })
//     .limit(15);
//   // const res;
//   // const totalPurchase = await Purchased_courses.countDocuments();
//   // const totalAmount = await Purchased_courses.aggregate([
//   //   { $group: { _id: null, totalPrice: { $sum: '$payment.total' } } },
//   // ]);
//   const totalPurchasedHistery = await Purchased_courses.aggregate([
//     {
//       $facet: {
//         totalPurchaseCount: [{ $match: {} }, { $count: 'totalPurchase' }],
//         totalPurchaseAmount: [
//           { $group: { _id: null, totalPrice: { $sum: '$payment.total' } } },
//         ],
//         recentPurchase: [
//           { $match: {} },
//           { $sort: { createdAt: -1 } },
//           { $limit: 15 },
//         ],
//       },
//     },
//   ]);
//   return {
//     totalUser,
//     totalAdmin,
//     totalModarator,
//     totalCourse,
//     // totalPurchase,
//     totalPurchasedHistery,
//     recentPublishCourse,
//     recentPublishLession,
//   };
// };
// export const deshbordService = {
//   deshbordFromDb,
// };
