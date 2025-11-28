import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler.util';
import { addToBlacklist } from '../utils/tokenBlacklist.util';
import type {
  RegisterInput,
  LoginInput,
  UpdateProfileInput,
  ChangePasswordInput,
} from '../validators/auth.validator';

/**
 * 인증 컨트롤러 클래스
 * 인증 관련 API 엔드포인트 처리
 */
export class AuthController {
  /**
   * 회원가입
   * @param req - Express Request 객체
   * @param res - Express Response 객체
   * @param next - Express NextFunction
   */
  static register = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const data = req.validatedBody as RegisterInput;

      const result = await AuthService.register(data);

      res.status(201).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
        message: '회원가입이 완료되었습니다',
      });
    }
  );

  /**
   * 로그인
   * @param req - Express Request 객체
   * @param res - Express Response 객체
   * @param next - Express NextFunction
   */
  static login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { email, password } = req.validatedBody as LoginInput;

      const result = await AuthService.login(email, password);

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
   * 로그아웃
   * @param req - Express Request 객체
   * @param res - Express Response 객체
   * @param next - Express NextFunction
   */
  static logout = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // Authorization 헤더에서 토큰 추출
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        // 토큰을 블랙리스트에 추가하여 무효화
        addToBlacklist(token);
      }

      res.status(200).json({
        success: true,
        message: '로그아웃되었습니다',
      });
    }
  );

  /**
   * Access Token 갱신
   * @param req - Express Request 객체
   * @param res - Express Response 객체
   * @param next - Express NextFunction
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
   * @param req - Express Request 객체 (req.user는 authenticate 미들웨어에서 설정됨)
   * @param res - Express Response 객체
   * @param next - Express NextFunction
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
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          department: user.department,
          position: user.position,
          createdAt: user.createdAt,
        },
      });
    }
  );

  /**
   * 프로필 수정
   * @param req - Express Request 객체 (req.user는 authenticate 미들웨어에서 설정됨)
   * @param res - Express Response 객체
   * @param next - Express NextFunction
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
          name: user.name,
          avatar: user.avatar,
          department: user.department,
          position: user.position,
          updatedAt: user.updatedAt,
        },
        message: '프로필이 업데이트되었습니다',
      });
    }
  );

  /**
   * 비밀번호 변경
   * @param req - Express Request 객체 (req.user는 authenticate 미들웨어에서 설정됨)
   * @param res - Express Response 객체
   * @param next - Express NextFunction
   */
  static changePassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const { currentPassword, newPassword } = req.validatedBody as ChangePasswordInput;

      await AuthService.changePassword(userId, currentPassword, newPassword);

      res.status(200).json({
        success: true,
        message: '비밀번호가 변경되었습니다',
      });
    }
  );
}






