import { z } from 'zod';
import { PURCHASE_PACKAGE_TYPES_ARRAY } from '../purchase_package/purchase_package.constant';

const productData = z.object({
  package: z.string({ required_error: 'Package is required' }),
  total_purchase_student: z.number({
    required_error: 'Total student is required',
  }),
  user: z.string().optional(),
  //
  membership: z.object({
    title: z.string({ required_error: 'Membership is required' }),
    uid: z.string().optional(),
  }),
  title: z.string({ required_error: 'Titel is required' }),
  date_range: z.array(z.string()).optional(),

  categories: z.array(
    z.object({
      category: z.string({ required_error: 'Subject is required' }),
      label: z.string().optional(),
      // //! -------if type is multiple select -----
    }),
  ),

  type: z.enum([...PURCHASE_PACKAGE_TYPES_ARRAY] as [string, ...string[]]),
});

const createPaymentStripeZodSchema = z.object({
  body: z.object({
    products: z.array(
      z.object({
        name: z.string({ required_error: 'Product name is required' }),
        img: z.string().url().optional(),
        price: z.number(),
        quantity: z.number().optional().default(1),
      }),
    ),
    data: productData.optional(),
  }),
});

// *****************************Paypal *******************

const createPaypalZodSchema = z.object({
  body: z.object({
    item_list: z
      .object({
        items: z.array(
          z.object({
            name: z.string(),
            sku: z.string().optional(),
            price: z.string().optional(),
            currency: z.string().optional(),
            quantity: z.number().optional(),
          }),
        ),
      })
      .optional(),
    amount: z
      .object({
        currency: z.string().optional(),
        total: z.string().optional(),
      })
      .optional(),
    description: z.string().optional(),
    //for
    data: productData,
  }),
});
const createPaypalByCourseZodSchema = z.object({
  body: z.object({
    item_list: z
      .object({
        items: z.array(
          z.object({
            name: z.string({ required_error: 'course name is required' }), //course title
            sku: z.string().optional(), //course id
            price: z.string().optional(),
            currency: z.string().optional(),
            quantity: z.number().optional(),
          }),
        ),
      })
      .optional(),
    amount: z
      .object({
        currency: z.string().optional(),
        total: z.string().optional(),
      })
      .optional(),
    description: z.string().optional(),
    //for
    data: z.object({
      courseId: z.string({ required_error: 'course is required' }),
      subscribe_duration_types: z.string().optional(), // monthly,yearly,biannual --> if exists
    }),
  }),
});

export const PaymentValidation = {
  createPaymentStripeZodSchema,
  createPaypalZodSchema,
  createPaypalByCourseZodSchema,
};
