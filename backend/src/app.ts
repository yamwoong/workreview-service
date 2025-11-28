import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { corsOptions } from './config/cors';
import { logger } from './config/logger';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler.middleware';

const app: Express = express();

// 보안 미들웨어
app.use(helmet());

// CORS 설정
app.use(cors(corsOptions));

// Body parser 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: '요청한 리소스를 찾을 수 없습니다',
    },
  });
});

// 에러 핸들러 (가장 마지막에 위치)
app.use(errorHandler);

export default app;

