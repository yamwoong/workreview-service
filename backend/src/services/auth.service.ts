import { UserModel, IBadge } from '../models/User.model';
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.util';
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
  EmailNotVerifiedError,
} from '../utils/errors.util';
import { logger } from '../config/logger';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { maskEmail, hashUserId } from '../utils/logMasking.util';
import {
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendVerificationEmail,
} from '../utils/email.util';
import type {
  RegisterInput,
  LoginInput,
  UpdateProfileInput,
} from '../validators/auth.validator';

/**
 * 타이밍 공격 방어용 더미 해시
 * bcrypt로 생성된 유효한 해시 (실제 비밀번호: "dummy_password_12345")
 */
const DUMMY_PASSWORD_HASH =
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEm3DO';

/**
 * 인증 서비스 클래스
 * 사용자 인증 및 프로필 관리 비즈니스 로직 처리
 */
export class AuthService {
  /**
   * 회원가입
   * @param data - 회원가입 데이터
   * @returns 안내 메시지 및 이메일 (JWT 미발급 — 이메일 인증 후 발급)
   * @throws {ConflictError} username 또는 이메일이 이미 존재하는 경우
   */
  static async register(data: RegisterInput): Promise<{
    message: string;
    email: string;
  }> {
    // username 중복 체크
    const usernameExists = await UserModel.exists({ username: data.username });
    if (usernameExists) {
      logger.warn('회원가입 시도 - 이미 존재하는 사용자명', {
        username: data.username,
      });
      throw new ConflictError('이미 존재하는 사용자명입니다', 'auth.usernameAlreadyExists');
    }

    // 이메일 중복 체크
    const emailExists = await UserModel.exists({ email: data.email });
    if (emailExists) {
      logger.warn('회원가입 시도 - 이미 존재하는 이메일', {
        emailMasked: maskEmail(data.email),
      });
      throw new ConflictError('이미 존재하는 이메일입니다', 'auth.emailAlreadyExists');
    }

    // 이메일 인증 코드 생성 (6자리)
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15분

    // 사용자 생성
    const user = await UserModel.create({
      email: data.email,
      password: data.password, // pre-save hook에서 자동 해싱
      username: data.username,
      department: data.department,
      position: data.position,
      role: 'employee',
      isEmailVerified: false,
      emailVerificationCode: verificationCode,
      emailVerificationExpires: verificationExpires,
    });

    logger.info('새 사용자 회원가입 완료 (이메일 인증 대기)', {
      userIdHash: hashUserId(user._id.toString()),
    });

    // 인증 이메일 전송
    try {
      await sendVerificationEmail(user.email, user.username, verificationCode);
    } catch (error) {
      // 이메일 전송 실패 시 사용자 삭제 후 에러
      await UserModel.deleteOne({ _id: user._id });
      logger.error('이메일 인증 코드 전송 실패 - 사용자 롤백', {
        userIdHash: hashUserId(user._id.toString()),
        error: error instanceof Error ? error.message : String(error),
      });
      throw new BadRequestError('이메일 전송에 실패했습니다. 다시 시도해주세요.');
    }

    return {
      message: '인증 코드를 이메일로 전송했습니다. 이메일을 확인해 주세요.',
      email: user.email,
    };
  }

  /**
   * 로그인 (이메일 또는 username)
   * @param identifier - 이메일 또는 username
   * @param password - 사용자 비밀번호
   * @returns 사용자 정보 및 JWT 토큰
   * @throws {UnauthorizedError} 자격증명이 일치하지 않는 경우
   * @throws {EmailNotVerifiedError} 이메일 인증이 완료되지 않은 경우
   */
  static async login(
    identifier: string,
    password: string
  ): Promise<{
    user: {
      id: string;
      email: string;
      username: string;
      role: string;
      department?: string;
      position?: string;
      points: number;
      trustScore: number;
      badges: IBadge[];
      reviewCount: number;
      helpfulVoteCount: number;
      lastLogin?: Date;
    };
    accessToken: string;
    refreshToken: string;
  }> {
    // identifier가 이메일 형식이면 email로, 아니면 username으로 조회
    const isEmail = identifier.includes('@');
    const query = isEmail
      ? { email: identifier.toLowerCase() }
      : { username: identifier.toLowerCase() };

    const user = await UserModel.findOne(query).select('+password');

    // 타이밍 공격 방어: 항상 bcrypt.compare 실행
    const passwordHash = user?.password || DUMMY_PASSWORD_HASH;
    const isPasswordValid = await bcrypt.compare(password, passwordHash);

    // 사용자 존재, 비밀번호, 활성 상태 일괄 확인
    if (!user || !isPasswordValid || !user.isActive) {
      logger.warn('로그인 시도 실패', {
        identifierHint: identifier.substring(0, 3) + '***',
        reason: !user
          ? 'user_not_found'
          : !isPasswordValid
          ? 'invalid_password'
          : 'inactive_account',
      });
      throw new UnauthorizedError(
        '이메일(사용자명) 또는 비밀번호가 일치하지 않습니다',
        'auth.invalidCredentials'
      );
    }

    // 이메일 인증 여부 확인
    if (!user.isEmailVerified) {
      logger.warn('로그인 시도 - 이메일 미인증', {
        userIdHash: hashUserId(user._id.toString()),
      });
      throw new EmailNotVerifiedError(user.email);
    }

    // lastLogin 업데이트
    try {
      user.lastLogin = new Date();
      await user.save();
    } catch (error) {
      logger.warn('lastLogin 업데이트 실패 (로그인은 정상 진행)', {
        userIdHash: hashUserId(user._id.toString()),
        error: error instanceof Error ? error.message : String(error),
      });
    }

    logger.info('사용자 로그인 성공', {
      userIdHash: hashUserId(user._id.toString()),
    });

    const accessToken = generateToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    const userResponse = {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
      department: user.department,
      position: user.position,
      points: user.points,
      trustScore: user.trustScore,
      badges: user.badges,
      reviewCount: user.reviewCount,
      helpfulVoteCount: user.helpfulVoteCount,
      lastLogin: user.lastLogin,
    };

    return { user: userResponse, accessToken, refreshToken };
  }

  /**
   * 이메일 인증
   * @param email - 사용자 이메일
   * @param code - 6자리 인증 코드
   * @returns 사용자 정보 및 JWT 토큰
   * @throws {BadRequestError} 코드가 유효하지 않거나 만료된 경우
   */
  static async verifyEmail(
    email: string,
    code: string
  ): Promise<{
    user: {
      id: string;
      email: string;
      username: string;
      role: string;
      department?: string;
      position?: string;
      points: number;
      trustScore: number;
      badges: IBadge[];
      reviewCount: number;
      helpfulVoteCount: number;
    };
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await UserModel.findOne({
      email: email.toLowerCase(),
      emailVerificationCode: code,
      emailVerificationExpires: { $gt: new Date() },
    }).select('+emailVerificationCode +emailVerificationExpires');

    if (!user) {
      logger.warn('이메일 인증 실패 - 유효하지 않거나 만료된 코드', {
        emailMasked: maskEmail(email),
      });
      throw new BadRequestError(
        '유효하지 않거나 만료된 인증 코드입니다',
        'auth.invalidVerificationCode'
      );
    }

    // 인증 완료 처리
    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    logger.info('이메일 인증 완료', {
      userIdHash: hashUserId(user._id.toString()),
    });

    const accessToken = generateToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    const userResponse = {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
      department: user.department,
      position: user.position,
      points: user.points,
      trustScore: user.trustScore,
      badges: user.badges,
      reviewCount: user.reviewCount,
      helpfulVoteCount: user.helpfulVoteCount,
    };

    return { user: userResponse, accessToken, refreshToken };
  }

  /**
   * 인증 이메일 재발송
   * @param email - 사용자 이메일
   * @returns 성공 메시지
   * @throws {BadRequestError} 이미 인증된 경우
   */
  static async resendVerification(email: string): Promise<{ message: string }> {
    const user = await UserModel.findOne({ email: email.toLowerCase() }).select(
      '+emailVerificationCode +emailVerificationExpires'
    );

    if (!user) {
      // 보안: 이메일 존재 여부 노출 안 함
      return { message: '인증 코드를 이메일로 전송했습니다.' };
    }

    if (user.isEmailVerified) {
      throw new BadRequestError('이미 이메일 인증이 완료되었습니다', 'auth.emailAlreadyVerified');
    }

    // 새 코드 생성
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    user.emailVerificationCode = verificationCode;
    user.emailVerificationExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    try {
      await sendVerificationEmail(user.email, user.username, verificationCode);
    } catch (error) {
      user.emailVerificationCode = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      logger.error('인증 이메일 재발송 실패', {
        userIdHash: hashUserId(user._id.toString()),
        error: error instanceof Error ? error.message : String(error),
      });
      throw new BadRequestError('이메일 전송에 실패했습니다. 다시 시도해주세요.');
    }

    logger.info('인증 이메일 재발송 완료', {
      userIdHash: hashUserId(user._id.toString()),
    });

    return { message: '인증 코드를 이메일로 전송했습니다.' };
  }

  /**
   * Access Token 갱신
   */
  static async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const { userId } = verifyRefreshToken(refreshToken);

    const user = await UserModel.findById(userId)
      .select('role isActive')
      .lean();

    if (!user) {
      logger.warn('토큰 갱신 실패 - 존재하지 않는 사용자', {
        userIdHash: hashUserId(userId),
      });
      throw new NotFoundError('사용자를 찾을 수 없습니다');
    }

    if (!user.isActive) {
      logger.warn('토큰 갱신 실패 - 비활성화된 계정', {
        userIdHash: hashUserId(userId),
      });
      throw new UnauthorizedError('비활성화된 계정입니다');
    }

    logger.info('Access Token 갱신 완료', {
      userIdHash: hashUserId(userId),
    });

    const newAccessToken = generateToken(userId, user.role);
    const newRefreshToken = generateRefreshToken(userId);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  /**
   * 내 정보 조회
   */
  static async getMe(userId: string): Promise<{
    id: string;
    email: string;
    username: string;
    role: string;
    avatar?: string;
    department?: string;
    position?: string;
    points: number;
    trustScore: number;
    badges: IBadge[];
    reviewCount: number;
    helpfulVoteCount: number;
    isActive: boolean;
    isEmailVerified: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
  }> {
    const user = await UserModel.findById(userId).lean();

    if (!user) {
      logger.warn('사용자 조회 실패 - 존재하지 않는 사용자', {
        userIdHash: hashUserId(userId),
      });
      throw new NotFoundError('사용자를 찾을 수 없습니다');
    }

    logger.debug('사용자 정보 조회', {
      userIdHash: hashUserId(String(user._id)),
    });

    return {
      id: String(user._id),
      email: user.email,
      username: user.username,
      role: user.role,
      department: user.department,
      position: user.position,
      points: user.points,
      trustScore: user.trustScore,
      badges: user.badges,
      reviewCount: user.reviewCount,
      helpfulVoteCount: user.helpfulVoteCount,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * 프로필 수정
   */
  static async updateProfile(
    userId: string,
    data: UpdateProfileInput
  ): Promise<{
    id: string;
    email: string;
    username: string;
    role: string;
    avatar?: string;
    department?: string;
    position?: string;
    points: number;
    trustScore: number;
    badges: IBadge[];
    reviewCount: number;
    helpfulVoteCount: number;
    updatedAt: Date;
  }> {
    const allowedFields = ['username', 'department', 'position'];
    const updateData: Partial<UpdateProfileInput> = {};

    Object.keys(data).forEach((key) => {
      if (allowedFields.includes(key)) {
        updateData[key as keyof UpdateProfileInput] =
          data[key as keyof UpdateProfileInput];
      } else {
        logger.warn('프로필 수정 시도 - 허용되지 않은 필드', {
          userIdHash: hashUserId(userId),
          field: key,
        });
      }
    });

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      logger.warn('프로필 수정 실패 - 존재하지 않는 사용자', {
        userIdHash: hashUserId(userId),
      });
      throw new NotFoundError('사용자를 찾을 수 없습니다');
    }

    logger.info('프로필 수정 완료', {
      userIdHash: hashUserId(user._id.toString()),
      updatedFields: Object.keys(updateData),
    });

    return {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
      department: user.department,
      position: user.position,
      points: user.points,
      trustScore: user.trustScore,
      badges: user.badges,
      reviewCount: user.reviewCount,
      helpfulVoteCount: user.helpfulVoteCount,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * 비밀번호 변경
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const user = await UserModel.findById(userId).select('+password');

    if (!user) {
      logger.warn('비밀번호 변경 실패 - 존재하지 않는 사용자', {
        userIdHash: hashUserId(userId),
      });
      throw new NotFoundError('사용자를 찾을 수 없습니다');
    }

    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      logger.warn('비밀번호 변경 실패 - 현재 비밀번호 불일치', {
        userIdHash: hashUserId(user._id.toString()),
      });
      throw new UnauthorizedError('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    logger.info('비밀번호 변경 완료', {
      userIdHash: hashUserId(user._id.toString()),
    });

    return { message: '비밀번호가 변경되었습니다' };
  }

  /**
   * 비밀번호 찾기
   */
  static async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await UserModel.findOne({ email: email.toLowerCase() }).select(
      '+resetPasswordToken +resetPasswordExpires'
    );

    if (!user) {
      logger.warn('비밀번호 재설정 요청 - 존재하지 않는 이메일', {
        emailMasked: maskEmail(email),
      });
      return { message: '재설정 링크를 이메일로 전송했습니다' };
    }

    const resetToken = crypto.randomInt(100000, 999999).toString();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    logger.info('비밀번호 재설정 토큰 생성', {
      userIdHash: hashUserId(user._id.toString()),
      expiresAt: user.resetPasswordExpires,
    });

    try {
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      logger.error('비밀번호 재설정 이메일 전송 실패', {
        userIdHash: hashUserId(user._id.toString()),
        error: error instanceof Error ? error.message : String(error),
      });

      throw new BadRequestError('이메일 전송에 실패했습니다');
    }

    return { message: '재설정 링크를 이메일로 전송했습니다' };
  }

  /**
   * 비밀번호 재설정 토큰 검증
   */
  static async verifyResetToken(token: string): Promise<{ valid: true }> {
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      logger.warn('토큰 검증 실패 - 유효하지 않거나 만료된 토큰', {
        token: token.substring(0, 3) + '***',
      });
      throw new BadRequestError('유효하지 않거나 만료된 토큰입니다');
    }

    logger.debug('토큰 검증 성공', {
      userIdHash: hashUserId(user._id.toString()),
    });

    return { valid: true };
  }

  /**
   * 비밀번호 재설정
   */
  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      logger.warn('비밀번호 재설정 실패 - 유효하지 않거나 만료된 토큰', {
        token: token.substring(0, 3) + '***',
      });
      throw new BadRequestError('유효하지 않거나 만료된 토큰입니다');
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    logger.info('비밀번호 재설정 완료', {
      userIdHash: hashUserId(user._id.toString()),
    });

    try {
      await sendPasswordChangedEmail(user.email, user.username);
    } catch (error) {
      logger.warn('비밀번호 변경 완료 이메일 전송 실패 (무시)', {
        userIdHash: hashUserId(user._id.toString()),
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return { message: '비밀번호가 변경되었습니다' };
  }

  /**
   * 사용자에 대한 JWT 토큰 생성 (OAuth용)
   */
  static async generateTokensForUser(user: Express.User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const userDoc = user as unknown as {
      _id: string;
      email: string;
      role: string;
      lastLogin?: Date;
      save: () => Promise<void>;
    };

    const accessToken = generateToken({
      userId: userDoc._id,
      email: userDoc.email,
      role: userDoc.role,
    });

    const refreshToken = generateRefreshToken({
      userId: userDoc._id,
    });

    userDoc.lastLogin = new Date();
    await userDoc.save();

    logger.info('OAuth 토큰 생성 완료', {
      userIdHash: hashUserId(userDoc._id),
      emailMasked: maskEmail(userDoc.email),
    });

    return { accessToken, refreshToken };
  }
}
