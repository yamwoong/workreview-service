import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { UserModel } from '../models/User.model';
import { logger } from '../config/logger';

/**
 * Google OAuth Strategy
 * - 새 사용자: Google 프로필로 계정 생성
 * - 기존 사용자: Google ID로 로그인
 * - 이메일 중복: 기존 local 계정에 Google 연동
 */
export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
  },
  async (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ): Promise<void> => {
    try {
      const email = profile.emails?.[0]?.value;
      const googleId = profile.id;
      const displayName = profile.displayName || profile.name?.givenName || 'google_user';
      // Generate a unique username from display name (lowercase, replace spaces/special chars with _)
      const baseUsername = displayName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 15);
      const username = `${baseUsername}_${googleId.slice(-4)}`;

      if (!email) {
        logger.warn('Google OAuth: 이메일이 제공되지 않음', {
          googleId: profile.id,
        });
        return done(new Error('Google 계정에서 이메일을 가져올 수 없습니다'));
      }

      // 1. Google ID로 기존 사용자 찾기
      let user = await UserModel.findOne({ googleId });

      if (user) {
        // 기존 Google 사용자 로그인
        logger.info('Google OAuth: 기존 Google 사용자 로그인', {
          userId: user._id,
          email: user.email,
        });
        user.lastLogin = new Date();
        await user.save();
        return done(null, user);
      }

      // 2. 이메일로 기존 사용자 찾기 (local 계정)
      user = await UserModel.findOne({ email });

      if (user) {
        // 기존 local 계정에 Google 연동
        if (user.authProvider === 'local' && !user.googleId) {
          logger.info('Google OAuth: 기존 local 계정에 Google 연동', {
            userId: user._id,
            email: user.email,
          });
          user.googleId = googleId;
          user.authProvider = 'google';
          user.lastLogin = new Date();
          await user.save();
          return done(null, user);
        } else {
          // 이미 Google 계정과 연동됨
          logger.warn('Google OAuth: 이미 다른 Google 계정과 연동됨', {
            userId: user._id,
            email: user.email,
            existingGoogleId: user.googleId,
          });
          return done(
            new Error('이 이메일은 이미 다른 Google 계정과 연동되어 있습니다')
          );
        }
      }

      // 3. 새 사용자 생성
      logger.info('Google OAuth: 새 Google 사용자 생성', {
        email,
        googleId,
      });

      const newUser = await UserModel.create({
        email,
        username,
        googleId,
        authProvider: 'google',
        role: 'employee',
        isActive: true,
        isEmailVerified: true, // Google OAuth는 이메일 인증 불필요
        lastLogin: new Date(),
        // password는 OAuth 사용자에게 필요 없음
      });

      logger.info('Google OAuth: 새 사용자 생성 완료', {
        userId: newUser._id,
        email: newUser.email,
      });

      return done(null, newUser);
    } catch (error) {
      logger.error('Google OAuth Strategy 오류', {
        error: error instanceof Error ? error.message : String(error),
        profile: {
          id: profile.id,
          displayName: profile.displayName,
        },
      });
      return done(error as Error);
    }
  }
);
