import app from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import { logger } from './config/logger';
import mongoose from 'mongoose';
import { Server } from 'http';

const PORT = env.PORT || 5000;
let server: Server;

/**
 * Graceful Shutdown 함수
 * 진행 중인 작업을 완료하고 리소스를 정리한 후 종료
 */
async function gracefulShutdown(signal: string): Promise<void> {
  logger.info(`${signal} 신호 수신, Graceful Shutdown 시작`);

  // 새 연결 거부, 기존 연결은 완료될 때까지 대기
  if (server) {
    server.close(() => {
      logger.info('HTTP 서버가 정상적으로 종료되었습니다');
    });
  }

  // DB 연결 종료
  try {
    await mongoose.connection.close();
    logger.info('MongoDB 연결이 정상적으로 종료되었습니다');
  } catch (error) {
    logger.error('MongoDB 연결 종료 중 에러:', error);
  }

  // 타임아웃 설정 (30초 후 강제 종료)
  const shutdownTimeout = setTimeout(() => {
    logger.error('Graceful Shutdown 타임아웃, 강제 종료');
    process.exit(1);
  }, 30000);

  // 타임아웃이 프로세스를 유지하지 않도록 설정
  shutdownTimeout.unref();
}

/**
 * 서버 시작 함수
 */
async function startServer(): Promise<void> {
  try {
    // 데이터베이스 연결
    await connectDatabase();

    // 서버 시작
    server = app.listen(PORT, () => {
      logger.info(`서버가 포트 ${PORT}에서 실행 중입니다`, {
        environment: env.NODE_ENV,
        port: PORT,
      });
    });
  } catch (error) {
    logger.error('서버 시작 실패:', error);
    process.exit(1);
  }
}

// 서버 시작
startServer();

// 예상치 못한 에러 처리
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  logger.error('Unhandled Rejection:', {
    reason,
    promiseString: String(promise),
  });
  gracefulShutdown('unhandledRejection').then(() => process.exit(1));
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException').then(() => process.exit(1));
});

// SIGTERM, SIGINT 핸들러 추가 (Docker, Kubernetes 등에서 사용)
process.on('SIGTERM', () => {
  gracefulShutdown('SIGTERM').then(() => process.exit(0));
});

process.on('SIGINT', () => {
  gracefulShutdown('SIGINT').then(() => process.exit(0));
});


















