import { CorsOptions } from 'cors';
import { env } from './env';
import { logger } from './logger';

/**
 * CORS 설정 옵션
 */
export const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    const isDevelopment = env.NODE_ENV === 'development';

    // 개발 환경에서는 origin이 없는 요청도 허용 (Postman 등)
    if (!origin && isDevelopment) {
      return callback(null, true);
    }

    // origin이 없으면 거부
    if (!origin) {
      logger.warn('CORS 거부 - origin이 없는 요청');
      const errorMessage = isDevelopment
        ? 'CORS 정책에 의해 차단되었습니다: origin이 없습니다'
        : 'CORS 정책에 의해 차단되었습니다';
      return callback(new Error(errorMessage));
    }

    // 개발 환경에서는 localhost의 모든 포트 허용 (Vite dev server 포트 변동 대응)
    if (isDevelopment && /^http:\/\/localhost:\d+$/.test(origin)) {
      return callback(null, true);
    }

    // FRONTEND_URL이 화이트리스트에 있는지 확인
    if (origin === env.FRONTEND_URL) {
      return callback(null, true);
    } else {
      logger.warn('CORS 거부 - 허용되지 않은 origin', {
        origin: origin,
        allowedOrigin: env.FRONTEND_URL,
      });
      const errorMessage = isDevelopment
        ? `CORS 정책에 의해 차단되었습니다: origin '${origin}'은(는) 허용되지 않습니다. 허용된 origin: '${env.FRONTEND_URL}'`
        : 'CORS 정책에 의해 차단되었습니다';
      return callback(new Error(errorMessage));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};



































