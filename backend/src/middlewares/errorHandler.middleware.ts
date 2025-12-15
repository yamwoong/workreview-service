import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors.util';
import { logger } from '../config/logger';
import mongoose from 'mongoose';

/**
 * 민감한 정보를 마스킹하는 함수
 * 비밀번호, 토큰 등 민감한 필드를 [REDACTED]로 대체
 */
function sanitizeRequestBody(body: unknown): unknown {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sanitized = { ...body } as Record<string, unknown>;
  const sensitiveFields = [
    'password',
    'currentPassword',
    'newPassword',
    'token',
    'refreshToken',
    'accessToken',
    'authorization',
  ];

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  }

  return sanitized;
}

/**
 * Mongoose Duplicate Key Error 타입 가드
 */
function isMongooseDuplicateKeyError(
  err: unknown
): err is mongoose.Error & { code: number } {
  return (
    err instanceof mongoose.Error &&
    'code' in err &&
    typeof (err as { code?: number }).code === 'number'
  );
}

/**
 * AppError with details 타입 가드
 */
function hasDetails(err: Error): err is Error & { details: unknown } {
  return 'details' in err && err.details !== undefined && err.details !== null;
}

/**
 * 전역 에러 핸들러 미들웨어
 * 모든 에러를 일관된 형식으로 처리하고 응답합니다.
 *
 * @param err - 에러 객체
 * @param req - Express Request 객체
 * @param res - Express Response 객체
 * @param next - Express NextFunction
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // AppError 인스턴스 처리
  if (err instanceof AppError) {
    logger.warn('애플리케이션 에러 발생', {
      code: err.code,
      message: err.message,
      statusCode: err.statusCode,
      path: req.path,
      method: req.method,
    });

    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(hasDetails(err) ? { details: err.details } : {}),
      },
    });
  }

  // Zod 검증 에러 처리
  if (err instanceof ZodError) {
    logger.warn('Zod 검증 에러 발생', {
      errors: err.issues,
      path: req.path,
      method: req.method,
    });

    const details = err.issues.map((error) => ({
      field: error.path.join('.'),
      message: error.message,
    }));

    return res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: '입력값 검증에 실패했습니다',
        details,
      },
    });
  }

  // Mongoose 에러 처리
  if (err instanceof mongoose.Error) {
    // ValidationError
    if (err instanceof mongoose.Error.ValidationError) {
      logger.warn('Mongoose 검증 에러 발생', {
        errors: err.errors,
        path: req.path,
        method: req.method,
      });

      const details = Object.values(err.errors).map((error) => ({
        field: error.path ?? 'unknown',
        message: error.message,
      }));

      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '입력값 검증에 실패했습니다',
          details,
        },
      });
    }

    // CastError (잘못된 ObjectId)
    if (err instanceof mongoose.Error.CastError) {
      logger.warn('Mongoose Cast 에러 발생', {
        kind: err.kind,
        value: err.value,
        path: req.path,
        method: req.method,
      });

      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: '유효하지 않은 ID 형식입니다',
        },
      });
    }

    // Duplicate key error (11000)
    if (isMongooseDuplicateKeyError(err) && err.code === 11000) {
      logger.warn('중복 키 에러 발생', {
        path: req.path,
        method: req.method,
      });

      return res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: '이미 존재하는 리소스입니다',
        },
      });
    }
  }

  // JWT 에러 처리
  if (err.name === 'JsonWebTokenError') {
    logger.warn('JWT 에러 발생', {
      name: err.name,
      message: err.message,
      path: req.path,
      method: req.method,
    });

    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: '유효하지 않은 토큰입니다',
      },
    });
  }

  if (err.name === 'TokenExpiredError') {
    logger.warn('JWT 토큰 만료', {
      name: err.name,
      path: req.path,
      method: req.method,
    });

    return res.status(401).json({
      success: false,
      error: {
        code: 'TOKEN_EXPIRED',
        message: '토큰이 만료되었습니다',
      },
    });
  }

  // 예상치 못한 에러
  logger.error('예상치 못한 에러 발생', {
    errorName: err.name,
    errorMessage: err.message,
    errorStack: err.stack,
    path: req.path,
    method: req.method,
    body: sanitizeRequestBody(req.body),
    query: req.query,
    params: req.params,
    userAgent: req.get('user-agent'),
    ip: req.ip,
  });

  // 프로덕션에서는 상세 정보 숨기기
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: '서버 오류가 발생했습니다',
      ...(isDevelopment
        ? {
            details: {
              message: err.message,
              stack: err.stack,
            },
          }
        : {}),
    },
  });
};


















