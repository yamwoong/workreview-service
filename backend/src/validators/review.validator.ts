import { z } from 'zod';

/**
 * Ratings 스키마 (4가지 평가 항목)
 */
const ratingsSchema = z.object({
  salary: z
    .number({
      required_error: '급여 평점은 필수입니다',
    })
    .min(1, '평점은 최소 1점 이상이어야 합니다')
    .max(5, '평점은 최대 5점까지 가능합니다'),
  restTime: z
    .number({
      required_error: '휴식시간 평점은 필수입니다',
    })
    .min(1, '평점은 최소 1점 이상이어야 합니다')
    .max(5, '평점은 최대 5점까지 가능합니다'),
  workEnv: z
    .number({
      required_error: '근무환경 평점은 필수입니다',
    })
    .min(1, '평점은 최소 1점 이상이어야 합니다')
    .max(5, '평점은 최대 5점까지 가능합니다'),
  management: z
    .number({
      required_error: '사장님 스타일 평점은 필수입니다',
    })
    .min(1, '평점은 최소 1점 이상이어야 합니다')
    .max(5, '평점은 최대 5점까지 가능합니다'),
});

/**
 * Work Period 스키마
 */
const workPeriodSchema = z.object({
  start: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  end: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val))
    .optional(),
});

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
    store: z
      .string({
        required_error: '리뷰 대상 직장은 필수입니다',
      })
      .min(1, 'Store ID는 필수입니다'),
    reviewMode: z
      .enum(['quick', 'detailed'], {
        required_error: '리뷰 모드는 필수입니다',
      })
      .default('quick'),
    ratings: ratingsSchema,
    wageType: z
      .enum(['custom', 'minimum_wage', 'average', 'above_average'])
      .optional(),
    hourlyWage: z
      .number()
      .min(0, '시급은 0 이상이어야 합니다')
      .max(100, '시급은 £100 이하여야 합니다')
      .optional(),
    content: z
      .string({
        required_error: '리뷰 내용은 필수입니다',
      })
      .min(10, '리뷰 내용은 최소 10자 이상이어야 합니다')
      .max(2000, '리뷰 내용은 최대 2000자까지 가능합니다')
      .trim(),
    workPeriod: workPeriodSchema.optional(),
    position: z
      .string({
        required_error: '직책/포지션은 필수입니다',
      })
      .min(1, '직책/포지션은 필수입니다')
      .max(100, '직책/포지션은 최대 100자까지 가능합니다')
      .trim(),
    pros: z
      .string()
      .max(1000, '장점은 최대 1000자까지 가능합니다')
      .trim()
      .optional(),
    cons: z
      .string()
      .max(1000, '단점은 최대 1000자까지 가능합니다')
      .trim()
      .optional(),
    isAnonymous: z.boolean().default(false),
  })
  .refine(
    (data) => {
      // detailed 모드일 때는 workPeriod 필수
      if (data.reviewMode === 'detailed' && !data.workPeriod) {
        return false;
      }
      return true;
    },
    {
      message: 'Detailed 리뷰는 근무 기간이 필수입니다',
      path: ['workPeriod'],
    }
  );

/**
 * 리뷰 수정 스키마
 */
export const updateReviewSchema = z.object({
  ratings: ratingsSchema.optional(),
  wageType: z
    .enum(['custom', 'minimum_wage', 'average', 'above_average'])
    .optional(),
  hourlyWage: z
    .number()
    .min(0, '시급은 0 이상이어야 합니다')
    .max(100, '시급은 £100 이하여야 합니다')
    .optional(),
  content: z
    .string()
    .min(10, '리뷰 내용은 최소 10자 이상이어야 합니다')
    .max(2000, '리뷰 내용은 최대 2000자까지 가능합니다')
    .trim()
    .optional(),
  workPeriod: workPeriodSchema.optional(),
  position: z
    .string()
    .min(1, '직책/포지션은 필수입니다')
    .max(100, '직책/포지션은 최대 100자까지 가능합니다')
    .trim()
    .optional(),
  pros: z
    .string()
    .max(1000, '장점은 최대 1000자까지 가능합니다')
    .trim()
    .optional(),
  cons: z
    .string()
    .max(1000, '단점은 최대 1000자까지 가능합니다')
    .trim()
    .optional(),
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
