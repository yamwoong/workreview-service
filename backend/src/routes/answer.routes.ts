import { Router } from 'express';
import { AnswerController } from '../controllers/answer.controller';
import { authenticate } from '../middlewares/auth.middleware';
import {
  validateRequest,
  validateQuery,
} from '../middlewares/validation.middleware';
import {
  getAnswersQuerySchema,
  createAnswerSchema,
  updateAnswerSchema,
  setBestAnswerSchema,
} from '../validators/answer.validator';

const router = Router();

/**
 * 특정 질문의 답변 목록 조회
 * GET /api/questions/:questionId/answers
 */
router.get(
  '/questions/:questionId/answers',
  validateQuery(getAnswersQuerySchema),
  AnswerController.getAnswers
);

/**
 * 답변 생성
 * POST /api/questions/:questionId/answers
 */
router.post(
  '/questions/:questionId/answers',
  authenticate,
  validateRequest(createAnswerSchema),
  AnswerController.createAnswer
);

/**
 * 답변 수정
 * PUT /api/answers/:answerId
 */
router.put(
  '/answers/:answerId',
  authenticate,
  validateRequest(updateAnswerSchema),
  AnswerController.updateAnswer
);

/**
 * 답변 삭제
 * DELETE /api/answers/:answerId
 */
router.delete(
  '/answers/:answerId',
  authenticate,
  AnswerController.deleteAnswer
);

/**
 * Best Answer 설정/해제
 * PATCH /api/answers/:answerId/best
 */
router.patch(
  '/answers/:answerId/best',
  authenticate,
  validateRequest(setBestAnswerSchema),
  AnswerController.setBestAnswer
);

/**
 * 답변 좋아요
 * POST /api/answers/:answerId/like
 */
router.post('/answers/:answerId/like', AnswerController.likeAnswer);

export default router;
