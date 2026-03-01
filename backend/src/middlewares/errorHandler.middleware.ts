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
  // req.t가 아직 초기화되지 않은 경우를 위한 폴백
  const translate = (key: string, fallback: string): string => {
    try {
      return typeof req.t === 'function' ? req.t(key) : fallback;
    } catch {
      return fallback;
    }
  };

  // AppError 인스턴스 처리
  if (err instanceof AppError) {
    logger.warn('애플리케이션 에러 발생', {
      code: err.code,
      message: err.message,
      statusCode: err.statusCode,
      path: req.path,
      method: req.method,
    });

    // i18nKey가 있으면 번역, 없으면 원본 메시지 사용
    const message = err.i18nKey ? translate(err.i18nKey, err.message) : err.message;

    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message,
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
        message: translate('validation.required', 'Validation failed'),
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
          message: translate('validation.required', 'Validation failed'),
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
          message: translate('validation.invalidId', 'Invalid ID format'),
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
          message: translate('server.badRequest', 'Bad request'),
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
        message: translate('auth.invalidToken', 'Invalid token'),
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
        message: translate('auth.tokenExpired', 'Token expired'),
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
      message: translate('server.internalError', 'Internal server error'),
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



































