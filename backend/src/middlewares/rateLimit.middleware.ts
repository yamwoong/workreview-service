import { Request, Response, NextFunction } from 'express';
import { TooManyRequestsError } from '../utils/errors.util';

/**
 * Rate Limit 엔트리 타입
 */
type RateLimitEntry = {
  count: number;
  resetTime: number;
};

/**
 * Rate Limiter 저장소 타입
 * key: IP 주소 또는 사용자 식별자
 * value: RateLimitEntry
 */
type RateLimitStore = Record<string, RateLimitEntry>;

const store: RateLimitStore = {};

/**
 * 만료된 항목 정리 (메모리 누수 방지)
 */
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 60000); // 1분마다 정리

/**
 * Rate Limiting 미들웨어 팩토리
 * @param options - Rate limit 설정
 * @returns Express 미들웨어 함수
 */
export const rateLimit = (options: {
  windowMs: number; // 시간 윈도우 (밀리초)
  max: number; // 최대 요청 수
  message?: string; // 에러 메시지
  keyGenerator?: (req: Request) => string; // 키 생성 함수
}) => {
  const {
    windowMs,
    max,
    message = '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
    keyGenerator = (req: Request) => req.ip || 'unknown',
  } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = keyGenerator(req);
    const now = Date.now();

    // 초기화 또는 리셋
    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return next();
    }

    // 카운트 증가
    store[key].count++;

    // 제한 초과 확인
    if (store[key].count > max) {
      const retryAfter = Math.ceil((store[key].resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfter.toString());
      res.setHeader('X-RateLimit-Limit', max.toString());
      res.setHeader('X-RateLimit-Remaining', '0');
      res.setHeader('X-RateLimit-Reset', store[key].resetTime.toString());

      throw new TooManyRequestsError(message);
    }

    // 헤더 설정
    res.setHeader('X-RateLimit-Limit', max.toString());
    res.setHeader(
      'X-RateLimit-Remaining',
      (max - store[key].count).toString()
    );
    res.setHeader('X-RateLimit-Reset', store[key].resetTime.toString());

    next();
  };
};

/**
 * 로그인 전용 Rate Limiter
 * IP 주소 기반으로 5분당 5회 시도 제한
 */
export const loginRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5분
  max: 5,
  message: '로그인 시도 횟수를 초과했습니다. 5분 후 다시 시도해주세요.',
  keyGenerator: (req: Request) => `login:${req.ip}`,
});

/**
 * 회원가입 전용 Rate Limiter
 * IP 주소 기반으로 1시간당 3회 시도 제한
 */
export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1시간
  max: 3,
  message: '회원가입 시도 횟수를 초과했습니다. 1시간 후 다시 시도해주세요.',
  keyGenerator: (req: Request) => `register:${req.ip}`,
});

/**
 * 비밀번호 변경 전용 Rate Limiter
 * 사용자 ID 기반으로 15분당 3회 시도 제한
 */
export const passwordChangeRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 3,
  message: '비밀번호 변경 시도 횟수를 초과했습니다. 15분 후 다시 시도해주세요.',
  keyGenerator: (req: Request) => `password:${req.user?.id || req.ip}`,
});
