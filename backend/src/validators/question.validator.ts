import { z } from 'zod';

/**
 * 질문 목록 조회 쿼리 스키마
 */
export const getQuestionsQuerySchema = z.object({
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
  sort: z.enum(['latest', 'mostAnswered']).optional().default('latest'),
});

/**
 * 질문 생성 스키마
 */
export const createQuestionSchema = z.object({
  title: z
    .string({
      required_error: '질문 제목은 필수입니다',
    })
    .max(200, '질문 제목은 최대 200자까지 가능합니다')
    .trim(),
  content: z
    .string({
      required_error: '질문 내용은 필수입니다',
    })
    .max(2000, '질문 내용은 최대 2000자까지 가능합니다')
    .trim(),
});

/**
 * 질문 수정 스키마
 */
export const updateQuestionSchema = z.object({
  title: z
    .string()
    .max(200, '질문 제목은 최대 200자까지 가능합니다')
    .trim()
    .optional(),
  content: z
    .string()
    .max(2000, '질문 내용은 최대 2000자까지 가능합니다')
    .trim()
    .optional(),
});

/**
 * 타입 추론
 */
export type GetQuestionsQuery = z.infer<typeof getQuestionsQuerySchema>;
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;
