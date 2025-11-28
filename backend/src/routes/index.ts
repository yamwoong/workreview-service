import { Router } from 'express';
import authRoutes from './auth.routes';

const router = Router();

/**
 * 인증 라우트
 * /api/auth
 */
router.use('/auth', authRoutes);

/**
 * 사용자 라우트 (추후 구현)
 * /api/users
 */
// router.use('/users', userRoutes);

/**
 * 리뷰 라우트 (추후 구현)
 * /api/reviews
 */
// router.use('/reviews', reviewRoutes);

/**
 * 댓글 라우트 (추후 구현)
 * /api/comments
 */
// router.use('/comments', commentRoutes);

export default router;






