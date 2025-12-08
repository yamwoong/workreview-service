import { Request, Response, NextFunction } from 'express';

/**
 * 비동기 Express 미들웨어 함수 타입
 * Express 미들웨어는 반환값을 사용하지 않으므로 Promise<void> 사용
 */
type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

/**
 * 비동기 Express 미들웨어 에러 처리 헬퍼
 * async 함수를 받아서 try-catch로 감싸고, 에러 발생 시 next(error) 호출
 *
 * @param fn - 비동기 Express 미들웨어 함수
 * @returns 에러 처리가 포함된 Express 미들웨어 함수
 *
 * @example
 * ```typescript
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await UserService.getUsers();
 *   res.json({ success: true, data: users });
 * }));
 * ```
 */
export const asyncHandler = (fn: AsyncRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};














