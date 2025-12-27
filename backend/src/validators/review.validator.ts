import { z } from 'zod';

/**
 * 리뷰 목록 조회 쿼리 스키마
 */
export const getReviewsQuerySchema = z.object({
  store: z.string().optional(), // Store ID
  user: z.string().optional(), // User ID
  minRating: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .refine(
      (val) => val === undefined || (val >= 1 && val <= 5),
      '평점은 1과 5 사이여야 합니다'
    ),
  position: z.string().optional(),
  page: z
    .string()
    .optional()
    .default('1')
    .transform((val) => parseInt(val))
    .refine((val) => val > 0, '페이지는 1 이상이어야 합니다'),
  limit: z
    .string()
    .optional()
    .default('20')
    .transform((val) => parseInt(val))
    .refine(
      (val) => val > 0 && val <= 50,
      '페이지당 개수는 1~50 사이여야 합니다'
    ),
  sort: z
    .enum(['latest', 'rating', 'helpful'])
    .optional()
    .default('latest'),
});

/**
 * 리뷰 작성 스키마
 */
export const createReviewSchema = z
  .object({
    storeId: z
      .string({
        required_error: '리뷰 대상 직장은 필수입니다',
      })
      .min(1, 'Store ID는 필수입니다')
      .optional(),
    googlePlaceId: z.string().optional(),
    store: z.string().optional(), // Legacy support
    reviewMode: z
      .enum(['quick', 'detailed'])
      .optional()
      .default('quick'),
    rating: z
      .number({
        required_error: '평점은 필수입니다',
      })
      .min(1, '평점은 최소 1점 이상이어야 합니다')
      .max(5, '평점은 최대 5점까지 가능합니다'),
    wageType: z
      .enum(['below_minimum', 'minimum_wage', 'above_minimum'])
      .optional(),
    hourlyWage: z
      .number()
      .min(0, '시급은 0 이상이어야 합니다')
      .max(10000, '시급은 £10,000 이하여야 합니다')
      .optional(),
    content: z.preprocess(
      (val) => (typeof val === 'string' && val.trim() === '' ? undefined : val),
      z
        .string()
        .max(2000, '리뷰 내용은 최대 2000자까지 가능합니다')
        .optional()
    ),
    position: z.preprocess(
      (val) => (typeof val === 'string' && val.trim() === '' ? undefined : val),
      z
        .string()
        .min(2, '직책/포지션은 최소 2자 이상이어야 합니다')
        .max(100, '직책/포지션은 최대 100자까지 가능합니다')
        .optional()
    ),
    isAnonymous: z.boolean().default(false),
  })
  .refine(
    (data) => {
      // storeId, googlePlaceId, 또는 store 중 하나는 필수
      return data.storeId || data.googlePlaceId || data.store;
    },
    {
      message: '리뷰 대상 직장(storeId 또는 googlePlaceId)은 필수입니다',
      path: ['storeId'],
    }
  );

/**
 * 리뷰 수정 스키마
 */
export const updateReviewSchema = z.object({
  rating: z
    .number()
    .min(1, '평점은 최소 1점 이상이어야 합니다')
    .max(5, '평점은 최대 5점까지 가능합니다')
    .optional(),
  wageType: z
    .enum(['below_minimum', 'minimum_wage', 'above_minimum'])
    .optional(),
  hourlyWage: z
    .number()
    .min(0, '시급은 0 이상이어야 합니다')
    .max(10000, '시급은 £10,000 이하여야 합니다')
    .optional(),
  content: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() === '' ? undefined : val),
    z
      .string()
      .max(2000, '리뷰 내용은 최대 2000자까지 가능합니다')
      .optional()
  ),
  position: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() === '' ? undefined : val),
    z
      .string()
      .min(2, '직책/포지션은 최소 2자 이상이어야 합니다')
      .max(100, '직책/포지션은 최대 100자까지 가능합니다')
      .optional()
  ),
  isAnonymous: z.boolean().optional(),
});

/**
 * 도움됨 투표 스키마
 */
export const voteHelpfulSchema = z.object({
  helpful: z.boolean({
    required_error: '도움됨 여부는 필수입니다',
  }),
});

/**
 * 타입 추론
 */
export type GetReviewsQuery = z.infer<typeof getReviewsQuerySchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type VoteHelpfulInput = z.infer<typeof voteHelpfulSchema>;
