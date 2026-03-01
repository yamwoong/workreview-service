import { z } from 'zod';

/**
 * 답변 목록 조회 쿼리 스키마
 */
export const getAnswersQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((val) => parseInt(val))
    .refine((val) => val > 0, '페이지는 1 이상이어야 합니다'),
  limit: z
    .string()
    .optional()
    .default('10')
    .transform((val) => parseInt(val))
    .refine(
      (val) => val > 0 && val <= 50,
      '페이지당 개수는 1~50 사이여야 합니다'
    ),
  sort: z.enum(['latest', 'mostLiked']).optional().default('latest'),
});

/**
 * 답변 생성 스키마
 */
export const createAnswerSchema = z.object({
  content: z
    .string({
      required_error: '답변 내용은 필수입니다',
    })
    .max(2000, '답변 내용은 최대 2000자까지 가능합니다')
    .trim(),
});

/**
 * 답변 수정 스키마
 */
export const updateAnswerSchema = z.object({
  content: z
    .string()
    .max(2000, '답변 내용은 최대 2000자까지 가능합니다')
    .trim()
    .optional(),
});

/**
 * Best Answer 설정 스키마
 */
export const setBestAnswerSchema = z.object({
  isBestAnswer: z.boolean({
    required_error: 'Best Answer 여부는 필수입니다',
  }),
});

/**
 * 타입 추론
 */
export type GetAnswersQuery = z.infer<typeof getAnswersQuerySchema>;
export type CreateAnswerInput = z.infer<typeof createAnswerSchema>;
export type UpdateAnswerInput = z.infer<typeof updateAnswerSchema>;
export type SetBestAnswerInput = z.infer<typeof setBestAnswerSchema>;
