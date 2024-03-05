import { z } from 'zod';

const shopZodSchema = z.object({
  body: z.object({
    userId: z
      .string({
        required_error: 'User ID is required',
      })
      .optional(),
    name: z.string({
      required_error: 'Name is required',
    }),
    category: z.string({
      required_error: 'Category is required',
    }),
    weekend: z.string({
      required_error: 'Weekend is required',
    }),
    images: z.object({
      url1: z.string({
        required_error: 'URL is required',
      }),
      url2: z.string().optional(),
      url3: z.string().optional(),
    }),
    address: z.string({
      required_error: 'Address is required',
    }),
    locationLink: z.string({
      required_error: 'Location Link is required',
    }),
    about: z.string({
      required_error: 'About is required',
    }),
    serialNumber: z.string({
      required_error: 'Serial Number is required',
    }),
  }),
});

const updateShopZodSchema = z.object({
  body: z.object({
    userId: z.string().optional(),
    name: z.string().optional(),
    category: z.string().optional(),
    weekend: z.string().optional(),
    images: z
      .object({
        url1: z.string().optional(),
        url2: z.string().optional(),
        url3: z.string().optional(),
      })
      .optional(),
    address: z.string().optional(),
    locationLink: z.string().optional(),
    about: z.string().optional(),
    serialNumber: z.string().optional(),
  }),
});

export const ShopValidation = {
  shopZodSchema,
  updateShopZodSchema,
};
