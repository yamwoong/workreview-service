import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../utils/errors.util';
import { asyncHandler } from '../utils/asyncHandler.util';
import { logger } from '../config/logger';

/**
 * Zod 검증 미들웨어
 * req.body를 주어진 스키마로 검증하고, 실패 시 ValidationError 발생
 *
 * @param schema - Zod 검증 스키마
 * @returns Express 미들웨어 함수
 *
 * @example
 * ```typescript
 * router.post('/register', validateRequest(registerSchema), authController.register);
 * ```
 */
export const validateRequest = <T>(schema: ZodSchema<T>) => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        // req.body를 스키마로 검증
        const validatedData: T = await schema.parseAsync(req.body);

        // 검증된 데이터를 req.validatedBody에 저장 (타입 안전)
        req.validatedBody = validatedData;

        // 호환성을 위해 req.body도 업데이트
        req.body = validatedData;

        next();
      } catch (error) {
        if (error instanceof ZodError) {
          // Zod 에러를 ValidationError로 변환 (Zod v3에서는 issues 사용)
          const details = error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          }));

          logger.error('Request body validation failed', {
            path: req.path,
            method: req.method,
            validationErrors: details,
            receivedData: req.body,
          });

          throw new ValidationError('입력값 검증에 실패했습니다', details);
        }

        // 예상치 못한 에러
        throw error;
      }
    }
  );
};

/**
 * Zod 쿼리 파라미터 검증 미들웨어
 * req.query를 주어진 스키마로 검증하고, 실패 시 ValidationError 발생
 *
 * @param schema - Zod 검증 스키마
 * @returns Express 미들웨어 함수
 *
 * @example
 * ```typescript
 * router.get('/stores', validateQuery(getStoresQuerySchema), storeController.getStores);
 * ```
 */
export const validateQuery = <T>(schema: ZodSchema<T>) => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        // req.query를 스키마로 검증
        const validatedData: T = await schema.parseAsync(req.query);

        // 검증된 데이터를 req.validatedQuery에 저장 (타입 안전)
        req.validatedQuery = validatedData;

        next();
      } catch (error) {
        if (error instanceof ZodError) {
          // Zod 에러를 ValidationError로 변환 (Zod v3에서는 issues 사용)
          const details = error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          }));

          throw new ValidationError('쿼리 파라미터 검증에 실패했습니다', details);
        }

        // 예상치 못한 에러
        throw error;
      }
    }
  );
};



































