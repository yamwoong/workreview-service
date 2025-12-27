import { Router } from 'express';
import { QuestionController } from '../controllers/question.controller';
import { authenticate } from '../middlewares/auth.middleware';
import {
  validateRequest,
  validateQuery,
} from '../middlewares/validation.middleware';
import {
  getQuestionsQuerySchema,
  createQuestionSchema,
  updateQuestionSchema,
} from '../validators/question.validator';

const router = Router();

/**
 * 특정 매장의 질문 목록 조회
 * GET /api/stores/:storeId/questions
 */
router.get(
  '/stores/:storeId/questions',
  validateQuery(getQuestionsQuerySchema),
  QuestionController.getQuestions
);

/**
 * 질문 생성
 * POST /api/stores/:storeId/questions
 */
router.post(
  '/stores/:storeId/questions',
  authenticate,
  validateRequest(createQuestionSchema),
  QuestionController.createQuestion
);

/**
 * 질문 상세 조회
 * GET /api/questions/:questionId
 */
router.get('/questions/:questionId', QuestionController.getQuestion);

/**
 * 질문 수정
 * PUT /api/questions/:questionId
 */
router.put(
  '/questions/:questionId',
  authenticate,
  validateRequest(updateQuestionSchema),
  QuestionController.updateQuestion
);

/**
 * 질문 삭제
 * DELETE /api/questions/:questionId
 */
router.delete(
  '/questions/:questionId',
  authenticate,
  QuestionController.deleteQuestion
);

export default router;
