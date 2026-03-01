import { z } from 'zod';

// Base review schema (common fields)
const baseReviewSchema = z.object({
  reviewMode: z.enum(['quick', 'detailed']).optional().default('quick'),
  rating: z
    .number()
    .min(1, { message: 'Rating must be at least 1 star' })
    .max(5, { message: 'Rating must be at most 5 stars' }),
  wageType: z.enum(['below_minimum', 'minimum_wage', 'above_minimum']).optional(),
  content: z
    .string()
    .refine((val) => !val || val.length <= 2000, {
      message: 'Review content must not exceed 2000 characters'
    })
    .optional(),
  position: z
    .string()
    .refine((val) => !val || val.length >= 2, {
      message: 'Position must be at least 2 characters'
    })
    .refine((val) => !val || val.length <= 100, {
      message: 'Position must not exceed 100 characters'
    })
    .optional(),
  isAnonymous: z.boolean().optional()
});

// Create review schema (includes store identification)
export const createReviewSchema = baseReviewSchema
  .extend({
    storeId: z.string().optional(),
    googlePlaceId: z.string().optional()
  })
  .refine(
    (data) => {
      // Must have either storeId or googlePlaceId
      return data.storeId || data.googlePlaceId;
    },
    {
      message: 'Either storeId or googlePlaceId is required',
      path: ['storeId']
    }
  );

// Update review schema (all fields optional except what's being updated)
export const updateReviewSchema = z
  .object({
    reviewMode: z.enum(['quick', 'detailed']).optional(),
    rating: z
      .number()
      .min(1, { message: 'Rating must be at least 1 star' })
      .max(5, { message: 'Rating must be at most 5 stars' })
      .optional(),
    wageType: z.enum(['below_minimum', 'minimum_wage', 'above_minimum']).optional(),
    content: z
      .string()
      .refine((val) => !val || val.length <= 2000, {
        message: 'Review content must not exceed 2000 characters'
      })
      .optional(),
    position: z
      .string()
      .refine((val) => !val || val.length >= 2, {
        message: 'Position must be at least 2 characters'
      })
      .refine((val) => !val || val.length <= 100, {
        message: 'Position must not exceed 100 characters'
      })
      .optional(),
    isAnonymous: z.boolean().optional()
  });

// Type exports
export type CreateReviewFormInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewFormInput = z.infer<typeof updateReviewSchema>;
