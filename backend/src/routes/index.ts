import { Router } from 'express';
import authRoutes from './auth.routes';
import storeRoutes from './store.routes';
import reviewRoutes from './review.routes';
import questionRoutes from './question.routes';
import answerRoutes from './answer.routes';

const router = Router();

/**
 * 인증 라우트
 * /api/auth
 */
router.use('/auth', authRoutes);

/**
 * 질문 라우트 (가게 라우트보다 먼저 등록 - 더 구체적인 경로)
 * /api/stores/:storeId/questions, /api/questions
 */
router.use(questionRoutes);

/**
 * 답변 라우트 (가게 라우트보다 먼저 등록 - 더 구체적인 경로)
 * /api/questions/:questionId/answers, /api/answers
 */
router.use(answerRoutes);

/**
 * 가게 라우트
 * /api/stores
 */
router.use('/stores', storeRoutes);

/**
 * 리뷰 라우트
 * /api/reviews
 */
router.use('/reviews', reviewRoutes);

/**
 * 사용자 라우트 (추후 구현)
 * /api/users
 */
// router.use('/users', userRoutes);

export default router;

























