"use strict";
// import { z } from 'zod';
// const createPaymentZodSchema = z.object({
//   body: z.object({
//     paymentAmount: z.number({ required_error: 'amount is required' }),
//     // password: z.string({ required_error: 'Password is required' }),
//   }),
// });
// // *****************************payple *******************
// const createPaypleZodSchema = z.object({
//   body: z.object({
//     item_list: z
//       .object({
//         items: z.array(
//           z.object({
//             name: z.string(),
//             sku: z.string().optional(),
//             price: z.string(),
//             currency: z.string().optional(),
//             quantity: z.number().optional(),
//           })
//         ),
//       })
//       .optional(),
//     amount: z.object({
//       currency: z.string().optional(),
//       total: z.string({ required_error: 'amount is required' }),
//     }),
//     description: z.string().optional(),
//   }),
// });
// export const PaymentValidation = {
//   createPaymentZodSchema,
//   createPaypleZodSchema,
// };
