import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import passport from 'passport';
import middleware from 'i18next-http-middleware';
import { corsOptions } from './config/cors';
import { logger } from './config/logger';
import i18n from './config/i18n';
import { initializePassport } from './config/passport';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler.middleware';

const app: Express = express();

// Passport 초기화
initializePassport();

// 보안 미들웨어
app.use(helmet());

// CORS 설정
app.use(cors(corsOptions));

// Body parser 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// i18n 미들웨어 (언어 감지)
app.use(middleware.handle(i18n));

// Passport 미들웨어
app.use(passport.initialize());

// 요청 로깅 미들웨어 (개발 환경)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
    next();
  });
}

// Health check 엔드포인트
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// API 라우트 연결
app.use('/api', routes);

// 404 핸들러
app.use((req, res) => {
  const message = typeof req.t === 'function' ? req.t('server.notFound') : 'Not Found';
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message,
    },
  });
});

// 에러 핸들러 (가장 마지막에 위치)
app.use(errorHandler);

export default app;

