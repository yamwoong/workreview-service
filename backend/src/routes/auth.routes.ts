import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import {
  loginRateLimiter,
  registerRateLimiter,
  passwordChangeRateLimiter,
} from '../middlewares/rateLimit.middleware';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '../validators/auth.validator';

const router = Router();

/**
 * 회원가입
 * POST /api/auth/register
 */
router.post(
  '/register',
  registerRateLimiter,
  validateRequest(registerSchema),
  AuthController.register
);

/**
 * 로그인
 * POST /api/auth/login
 */
router.post(
  '/login',
  loginRateLimiter,
  validateRequest(loginSchema),
  AuthController.login
);

/**
 * 로그아웃
 * POST /api/auth/logout
 * 🔒 Requires Authentication
 */
router.post('/logout', authenticate, AuthController.logout);

/**
 * Access Token 갱신
 * POST /api/auth/refresh
 */
router.post('/refresh', AuthController.refreshToken);

/**
 * 내 정보 조회
 * GET /api/auth/me
 * 🔒 Requires Authentication
 */
router.get('/me', authenticate, AuthController.getMe);

/**
 * 프로필 수정
 * PATCH /api/auth/me
 * 🔒 Requires Authentication
 */
router.patch(
  '/me',
  authenticate,
  validateRequest(updateProfileSchema),
  AuthController.updateProfile
);

/**
 * 비밀번호 변경
 * PUT /api/auth/me/password
 * 🔒 Requires Authentication
 */
router.put(
  '/me/password',
  authenticate,
  passwordChangeRateLimiter,
  validateRequest(changePasswordSchema),
  AuthController.changePassword
);

export default router;






