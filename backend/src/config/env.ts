import { z } from 'zod';
import dotenvFlow from 'dotenv-flow';

// NODE_ENV에 따라 .env.development 또는 .env.production 자동 로드
dotenvFlow.config();

/**
 * 환경 변수 검증 스키마
 */
const envSchema = z.object({
  PORT: z.string().transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET은 최소 32자 이상이어야 합니다'),
  JWT_EXPIRES_IN: z.string(),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT_REFRESH_SECRET은 최소 32자 이상이어야 합니다'),
  JWT_REFRESH_EXPIRES_IN: z.string(),
  FRONTEND_URL: z.string().url(),
});

/**
 * 타입 안전한 환경 변수 객체
 */
export const env = envSchema.parse({
  PORT: process.env.PORT || '5000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m', // 15분으로 단축
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d', // 7일
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
});

