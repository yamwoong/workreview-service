import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler.util';
import { addToBlacklist } from '../utils/tokenBlacklist.util';
import type {
  RegisterInput,
  LoginInput,
  UpdateProfileInput,
  ChangePasswordInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
  ResendVerificationInput,
} from '../validators/auth.validator';

/**
 * 인증 컨트롤러 클래스
 */
export class AuthController {
  /**
   * 회원가입 — 이메일 인증 코드 발송 후 201 반환 (JWT 미포함)
   */
  static register = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const data = req.validatedBody as RegisterInput;

      const result = await AuthService.register(data);

      res.status(201).json({
        success: true,
        data: {
          message: result.message,
          email: result.email,
        },
        message: result.message,
      });
    }
  );

  /**
   * 로그인 (이메일 또는 username)
   */
  static login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { identifier, password } = req.validatedBody as LoginInput;

      const result = await AuthService.login(identifier, password);

      res.status(200).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });
    }
  );

  /**
   * 이메일 인증 — 코드 검증 후 JWT 발급
   */
  static verifyEmail = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { email, code } = req.validatedBody as VerifyEmailInput;

      const result = await AuthService.verifyEmail(email, code);

      res.status(200).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
        message: req.t('auth.emailVerified'),
      });
    }
  );

  /**
   * 인증 이메일 재발송
   */
  static resendVerification = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { email } = req.validatedBody as ResendVerificationInput;

      const result = await AuthService.resendVerification(email);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    }
  );

  /**
   * 로그아웃
   */
  static logout = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        addToBlacklist(token);
      }

      res.status(200).json({
        success: true,
        message: req.t('auth.logoutSuccess'),
      });
    }
  );

  /**
   * Access Token 갱신
   */
  static refreshToken = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { refreshToken } = req.body as { refreshToken: string };

      const result = await AuthService.refreshAccessToken(refreshToken);

      res.status(200).json({
        success: true,
        data: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });
    }
  );

  /**
   * 내 정보 조회
   */
  static getMe = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;

      const user = await AuthService.getMe(userId);

      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          avatar: user.avatar,
          department: user.department,
          position: user.position,
          points: user.points,
          trustScore: user.trustScore,
          badges: user.badges,
          reviewCount: user.reviewCount,
          helpfulVoteCount: user.helpfulVoteCount,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt,
        },
      });
    }
  );

  /**
   * 프로필 수정
   */
  static updateProfile = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const data = req.validatedBody as UpdateProfileInput;

      const user = await AuthService.updateProfile(userId, data);

      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          department: user.department,
          position: user.position,
          points: user.points,
          trustScore: user.trustScore,
          badges: user.badges,
          reviewCount: user.reviewCount,
          helpfulVoteCount: user.helpfulVoteCount,
          updatedAt: user.updatedAt,
        },
        message: req.t('auth.profileUpdateSuccess'),
      });
    }
  );

  /**
   * 비밀번호 변경
   */
  static changePassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const { currentPassword, newPassword } = req.validatedBody as ChangePasswordInput;

      await AuthService.changePassword(userId, currentPassword, newPassword);

      res.status(200).json({
        success: true,
        message: req.t('auth.passwordChangeSuccess'),
      });
    }
  );

  /**
   * 비밀번호 찾기
   */
  static forgotPassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { email } = req.validatedBody as ForgotPasswordInput;

      await AuthService.forgotPassword(email);

      res.status(200).json({
        success: true,
        message: req.t('auth.passwordResetEmailSent'),
      });
    }
  );

  /**
   * 비밀번호 재설정 토큰 검증
   */
  static verifyResetToken = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { token } = req.params;

      const result = await AuthService.verifyResetToken(token);

      res.status(200).json({
        success: true,
        valid: result.valid,
      });
    }
  );

  /**
   * 비밀번호 재설정
   */
  static resetPassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { token } = req.params;
      const { newPassword } = req.validatedBody as ResetPasswordInput;

      await AuthService.resetPassword(token, newPassword);

      res.status(200).json({
        success: true,
        message: req.t('auth.passwordResetSuccess'),
      });
    }
  );

  /**
   * Google OAuth 콜백 처리
   */
  static googleCallback = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const user = req.user as Express.User;

      if (!user) {
        res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
        return;
      }

      const result = await AuthService.generateTokensForUser(user);

      const redirectUrl = new URL('/oauth/callback', process.env.FRONTEND_URL);
      redirectUrl.searchParams.set('accessToken', result.accessToken);
      redirectUrl.searchParams.set('refreshToken', result.refreshToken);

      res.redirect(redirectUrl.toString());
    }
  );
}
