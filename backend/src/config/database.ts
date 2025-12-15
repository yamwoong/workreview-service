import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

// 재연결 설정
const MAX_RETRIES = 5;
let retryCount = 0;
let isShuttingDown = false;

/**
 * MongoDB 데이터베이스 연결 함수
 * @returns Promise<void>
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(env.DATABASE_URL);

    logger.info('MongoDB 연결 성공', {
      host: connection.connection.host,
      database: connection.connection.name,
    });

    // 연결 성공 시 재시도 카운터 리셋
    retryCount = 0;

    // 연결 이벤트 리스너
    mongoose.connection.on('error', (error: Error) => {
      logger.error('MongoDB 연결 오류:', {
        error: error.message,
        retryCount,
      });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB 연결이 끊어졌습니다');

      // Graceful shutdown 중이면 재연결 시도하지 않음
      if (isShuttingDown) {
        logger.info('Shutdown 중이므로 재연결을 시도하지 않습니다');
        return;
      }

      // 재연결 시도
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        // Exponential backoff: 1초, 2초, 4초, 8초, 16초 (최대 30초)
        const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 30000);

        logger.info(
          `${retryDelay}ms 후 재연결 시도 (${retryCount}/${MAX_RETRIES})`
        );

        setTimeout(() => {
          mongoose
            .connect(env.DATABASE_URL)
            .then(() => {
              logger.info('MongoDB 재연결 성공');
              retryCount = 0;
            })
            .catch((error) => {
              logger.error('MongoDB 재연결 실패:', {
                error: error.message,
                attempt: retryCount,
              });
            });
        }, retryDelay);
      } else {
        logger.error('MongoDB 재연결 최대 시도 횟수 초과');
        process.exit(1);
      }
    });

    mongoose.connection.on('connected', () => {
      if (retryCount > 0) {
        logger.info('MongoDB 재연결 완료');
      }
    });

    // 프로세스 종료 시 연결 종료
    process.on('SIGINT', async () => {
      isShuttingDown = true;
      await mongoose.connection.close();
      logger.info('MongoDB 연결이 종료되었습니다');
      process.exit(0);
    });
  } catch (error) {
    logger.error('MongoDB 연결 실패:', {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};


















