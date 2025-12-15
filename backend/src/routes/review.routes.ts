import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller';
import { authenticate } from '../middlewares/auth.middleware';
import {
  validateRequest,
  validateQuery,
} from '../middlewares/validation.middleware';
import {
  getReviewsQuerySchema,
  createReviewSchema,
  updateReviewSchema,
  voteHelpfulSchema,
} from '../validators/review.validator';

const router = Router();

/**
 * 리뷰 목록 조회
 * GET /api/reviews
 */
router.get(
  '/',
  validateQuery(getReviewsQuerySchema),
  ReviewController.getReviews
);

/**
 * 리뷰 상세 조회
 * GET /api/reviews/:id
 */
router.get('/:id', ReviewController.getReviewById);

/**
 * 리뷰 작성
 * POST /api/reviews
 * 🔒 Requires Authentication
 */
router.post(
  '/',
  authenticate,
  validateRequest(createReviewSchema),
  ReviewController.createReview
);

/**
 * 리뷰 수정
 * PATCH /api/reviews/:id
 * 🔒 Requires Authentication
 */
router.patch(
  '/:id',
  authenticate,
  validateRequest(updateReviewSchema),
  ReviewController.updateReview
);

/**
 * 리뷰 삭제
 * DELETE /api/reviews/:id
 * 🔒 Requires Authentication
 */
router.delete('/:id', authenticate, ReviewController.deleteReview);

/**
 * 도움됨 투표
 * POST /api/reviews/:id/helpful
 * 🔒 Requires Authentication
 */
router.post(
  '/:id/helpful',
  authenticate,
  validateRequest(voteHelpfulSchema),
  ReviewController.voteHelpful
);

export default router;
