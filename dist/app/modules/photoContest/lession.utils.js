"use strict";
// import { Lession } from './photoContest.model';
// export const findLastLessionId = async (courseId: string) => {
//   const lastLessionId = await Lession.findOne(
//     { courseId },
//     { lessionId: 1, _id: 0 }
//   )
//     .sort({ createdAt: -1 })
//     .lean();
//   return lastLessionId?.lessionId
//     ? lastLessionId.lessionId.substring(5)
//     : undefined;
// };
// export const generateLessionId = async (courseId: string): Promise<string> => {
//   const currentId =
//     (await findLastLessionId(courseId)) || (0).toString().padStart(3, '0');
//   // increment by 1
//   const incrementId = (Number(currentId) + 1).toString().padStart(3, '0');
//   const modifiId = `C-${Number(courseId)}-${incrementId}`;
//   return modifiId;
// };
