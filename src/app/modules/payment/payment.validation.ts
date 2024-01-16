import { z } from 'zod';

const createPaymentZodSchema = z.object({
    body: z.object({
        products: z.array(
          z.object({
            name: z.string({required_error:"Product name is required"}),
            img: z.string().url().optional(),
            price: z.number(),
            quantity: z.number().optional().default(1),
          })
        ),
        data:z.object({
            
        }).optional()
      }),
});

// *****************************payple *******************

const createPaypleZodSchema = z.object({
  body: z.object({
    item_list: z
      .object({
        items: z.array(
          z.object({
            name: z.string(),
            sku: z.string().optional(),
            price: z.string(),
            currency: z.string().optional(),
            quantity: z.number().optional(),
          })
        ),
      })
      .optional(),
    amount: z.object({
      currency: z.string().optional(),
      total: z.string({ required_error: 'amount is required' }),
    }),
    description: z.string().optional(),
  }),
});

export const PaymentValidation = {
  createPaymentZodSchema,
  createPaypleZodSchema,
};
