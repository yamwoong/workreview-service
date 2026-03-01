import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.util';
import { UserModel } from '../models/User.model';
import { asyncHandler } from '../utils/asyncHandler.util';
import { isBlacklisted } from '../utils/tokenBlacklist.util';

/**
 * JWT 토큰 인증 미들웨어
 * Authorization 헤더에서 Bearer 토큰을 추출하고 검증한 후,
 * 사용자 정보를 req.user에 저장합니다.
 *
 * @throws {UnauthorizedError} 토큰이 없거나 유효하지 않은 경우
 * @throws {UnauthorizedError} 사용자가 비활성화된 경우
 */
export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Authorization 헤더에서 토큰 추출
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('인증 토큰이 필요합니다');
    }

    const token = authHeader.substring(7); // 'Bearer ' 제거

    // 토큰 블랙리스트 확인
    if (isBlacklisted(token)) {
      throw new UnauthorizedError('만료된 토큰입니다');
    }

    // 토큰 검증
    let payload: { userId: string; role: string };
    try {
      payload = verifyToken(token);
    } catch (error) {
      throw new UnauthorizedError('유효하지 않은 토큰입니다');
    }

    // 사용자 조회 (필요한 필드만 조회 + lean으로 성능 최적화)
    const user = await UserModel.findById(payload.userId)
      .select('email username role isActive')
      .lean();

    if (!user) {
      throw new UnauthorizedError('사용자를 찾을 수 없습니다');
    }

    // 사용자 활성 상태 확인
    if (!user.isActive) {
      throw new UnauthorizedError('비활성화된 계정입니다');
    }

    // req.user에 사용자 정보 저장
    req.user = {
      id: String(user._id),
      email: user.email,
      username: user.username,
      role: user.role,
    };

    next();
  }
);

/**
 * 역할 기반 권한 확인 미들웨어 팩토리
 * 특정 역할만 접근 가능하도록 제한합니다.
 *
 * @param roles - 허용된 역할 배열
 * @returns Express 미들웨어 함수
 *
 * @example
 * ```typescript
 * router.get('/admin', authenticate, authorize('admin'), adminController.getDashboard);
 * router.get('/manager', authenticate, authorize('admin', 'manager'), managerController.getData);
 * ```
 */
export const authorize = (...roles: string[]) => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // authenticate 미들웨어가 먼저 실행되어야 함
      if (!req.user) {
        throw new UnauthorizedError('인증이 필요합니다');
      }

      // 사용자 역할이 허용된 역할 목록에 있는지 확인
      if (!roles.includes(req.user.role)) {
        throw new ForbiddenError('접근 권한이 없습니다');
      }

      next();
    }
  );
};



































