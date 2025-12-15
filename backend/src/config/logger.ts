import winston from 'winston';

/**
 * Winston 로거 설정
 * 개발 환경: 콘솔 출력
 * 프로덕션 환경: 파일 출력
 */
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'workreview-backend' },
  transports: [],
});

// 개발 환경: 콘솔 출력 (컬러 포맷)
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          (info: winston.Logform.TransformableInfo) => {
            const { timestamp, level, message, ...meta } = info;
            return `${timestamp} [${level}]: ${message} ${
              Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
            }`;
          }
        )
      ),
    })
  );
} else {
  // 프로덕션 환경: 파일 출력
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    })
  );
  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
    })
  );
}

export { logger };


















