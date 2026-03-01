import passport from 'passport';
import { googleStrategy } from '../strategies/google.strategy';
import { UserModel, IUser } from '../models/User.model';
import { logger } from './logger';

/**
 * Passport 초기화 및 설정
 */
export const initializePassport = (): void => {
  // Google OAuth Strategy 등록
  passport.use('google', googleStrategy);

  // Serialize user (세션에 user.id만 저장)
  passport.serializeUser((user, done) => {
    done(null, (user as IUser)._id);
  });

  // Deserialize user (user.id로 전체 사용자 정보 조회)
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (error) {
      logger.error('Passport deserializeUser 오류', {
        userId: id,
        error: error instanceof Error ? error.message : String(error),
      });
      done(error);
    }
  });

  logger.info('Passport 초기화 완료 (Google OAuth)');
};
