import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError, InternalServerError } from './errors.util';
import { logger } from '../config/logger';
import { hashUserId } from './logMasking.util';

/**
 * JWT 토큰 페이로드 인터페이스
 */
interface TokenPayload {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * JWT 토큰 생성
 * @param userId - 사용자 ID
 * @param role - 사용자 역할
 * @returns JWT 토큰 문자열
 * @throws {InternalServerError} 토큰 생성에 실패한 경우
 */
export const generateToken = (userId: string, role: string): string => {
  try {
    const payload: Omit<TokenPayload, 'iat' | 'exp'> = {
      userId,
      role,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });

    return token;
  } catch (error) {
    logger.error('JWT 토큰 생성 실패', {
      userIdHash: hashUserId(userId),
      error: error instanceof Error ? error.message : String(error),
    });
    throw new InternalServerError('토큰 생성에 실패했습니다');
  }
};

/**
 * JWT 토큰 검증
 * @param token - 검증할 JWT 토큰
 * @returns 검증된 토큰 페이로드 (userId, role)
 * @throws {UnauthorizedError} 토큰이 유효하지 않거나 만료된 경우
 */
export const verifyToken = (token: string): { userId: string; role: string } => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;

    if (!decoded.userId || !decoded.role) {
      throw new UnauthorizedError('토큰 페이로드가 유효하지 않습니다');
    }

    return {
      userId: decoded.userId,
      role: decoded.role,
    };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }

    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('토큰이 만료되었습니다');
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('유효하지 않은 토큰입니다');
    }

    throw new UnauthorizedError('토큰 검증에 실패했습니다');
  }
};

/**
 * Refresh Token 생성
 * @param userId - 사용자 ID
 * @returns Refresh Token 문자열
 * @throws {InternalServerError} 리프레시 토큰 생성에 실패한 경우
 */
export const generateRefreshToken = (userId: string): string => {
  try {
    const payload = {
      userId,
      type: 'refresh',
    };

    const token = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    });

    return token;
  } catch (error) {
    logger.error('리프레시 토큰 생성 실패', {
      userIdHash: hashUserId(userId),
      error: error instanceof Error ? error.message : String(error),
    });
    throw new InternalServerError('리프레시 토큰 생성에 실패했습니다');
  }
};

/**
 * Refresh Token 검증
 * @param token - 검증할 Refresh Token
 * @returns 검증된 토큰 페이로드 (userId)
 * @throws {UnauthorizedError} 토큰이 유효하지 않거나 만료된 경우
 */
export const verifyRefreshToken = (token: string): { userId: string } => {
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as {
      userId: string;
      type: string;
    };

    if (!decoded.userId || decoded.type !== 'refresh') {
      throw new UnauthorizedError('토큰 페이로드가 유효하지 않습니다');
    }

    return {
      userId: decoded.userId,
    };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }

    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('리프레시 토큰이 만료되었습니다');
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('유효하지 않은 리프레시 토큰입니다');
    }

    throw new UnauthorizedError('리프레시 토큰 검증에 실패했습니다');
  }
};






