import { z } from 'zod';
import { surpriseBagFoodCategory } from './surprise.constant';

const surpriseZodSchema = z.object({
  body: z.object({
    shopId: z.string({
      required_error: 'Shop ID is required',
    }),
    shop_categoryId: z
      .string({
        required_error: 'Shop Category ID is required',
      })
      .optional(),
    userId: z.string({
      required_error: 'User ID is required',
    }),
    name: z.string({
      required_error: 'Name is required',
    }),
    bagNo: z.string({
      required_error: 'Bag No is required',
    }),
    validation: z.string({
      required_error: 'Validation is required',
    }),
    pickUpHour: z.string({
      required_error: 'Pick Up Hour is required',
    }),
    pricing: z.string({
      required_error: 'Pricing is required',
    }),
    deliveryCharge: z.string({
      required_error: 'Delivery Charge is required',
    }),
    description: z.string({
      required_error: 'Description is required',
    }),
    foodCategory: z.enum([...surpriseBagFoodCategory] as [string, ...string[]]),
    orderStatus: z.string({
      required_error: 'Order Status is required',
    }),
    qrCode: z.string({
      required_error: 'QR Code is required',
    }),
  }),
});
const updateSurpriseZodSchema = z.object({
  body: z.object({
    shopId: z
      .string({
        required_error: 'Shop ID is required',
      })
      .optional(),
    shop_categoryId: z
      .string({
        required_error: 'Shop Category ID is required',
      })
      .optional(),

    userId: z
      .string({
        required_error: 'User ID is required',
      })
      .optional(),
    name: z
      .string({
        required_error: 'Name is required',
      })
      .optional(),
    bagNo: z
      .string({
        required_error: 'Bag No is required',
      })
      .optional(),
    validation: z
      .string({
        required_error: 'Validation is required',
      })
      .optional(),
    pickUpHour: z
      .string({
        required_error: 'Pick Up Hour is required',
      })
      .optional(),
    pricing: z
      .string({
        required_error: 'Pricing is required',
      })
      .optional(),
    deliveryCharge: z
      .string({
        required_error: 'Delivery Charge is required',
      })
      .optional(),
    description: z
      .string({
        required_error: 'Description is required',
      })
      .optional(),
    foodCategory: z.enum([...surpriseBagFoodCategory] as [string, ...string[]]),
    orderStatus: z
      .string({
        required_error: 'Order Status is required',
      })
      .optional(),
    qrCode: z
      .string({
        required_error: 'QR Code is required',
      })
      .optional(),
  }),
});

export const SurpriseValidation = {
  surpriseZodSchema,
  updateSurpriseZodSchema,
};
