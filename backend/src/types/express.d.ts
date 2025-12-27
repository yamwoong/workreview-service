import { IUser } from '../models/User.model';

/**
 * Express Request 타입 확장
 * - req.user: 인증된 사용자 정보
 * - req.validatedBody: Zod 검증을 통과한 데이터 (타입 안전)
 * - req.validatedQuery: Zod 검증을 통과한 쿼리 파라미터 (타입 안전)
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
      validatedBody?: unknown; // 제네릭 타입으로 사용 시 타입 캐스팅 필요
      validatedQuery?: unknown; // 제네릭 타입으로 사용 시 타입 캐스팅 필요
    }
  }
}

export {};

























