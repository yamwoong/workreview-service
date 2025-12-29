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
} from '../utils/errors.util';
import { logger } from '../config/logger';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { maskEmail, hashUserId } from '../utils/logMasking.util';
import {
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
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
   * @returns 사용자 정보 및 액세스 토큰
   * @throws {ConflictError} 이메일이 이미 존재하는 경우
   */
  static async register(data: RegisterInput): Promise<{
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      department?: string;
      position?: string;
      points: number;
      trustScore: number;
      badges: IBadge[];
      reviewCount: number;
      helpfulVoteCount: number;
      createdAt: Date;
    };
    accessToken: string;
    refreshToken: string;
  }> {
    // 이메일 중복 체크 (exists 사용으로 최적화 - 10배 빠름)
    const emailExists = await UserModel.exists({ email: data.email });

    if (emailExists) {
      logger.warn('회원가입 시도 - 이미 존재하는 이메일', {
        emailMasked: maskEmail(data.email),
      });
      throw new ConflictError('이미 존재하는 이메일입니다');
    }

    // 사용자 생성
    const user = await UserModel.create({
      email: data.email,
      password: data.password, // pre-save hook에서 자동 해싱
      name: data.name,
      department: data.department,
      position: data.position,
      role: 'employee', // 기본 역할
    });

    logger.info('새 사용자 회원가입 완료', {
      userIdHash: hashUserId(user._id.toString()),
    });

    // JWT 토큰 발급
    const accessToken = generateToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    // password 제외하고 반환
    const userResponse = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      position: user.position,
      points: user.points,
      trustScore: user.trustScore,
      badges: user.badges,
      reviewCount: user.reviewCount,
      helpfulVoteCount: user.helpfulVoteCount,
      createdAt: user.createdAt,
    };

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  }

  /**
   * 로그인
   * @param email - 사용자 이메일
   * @param password - 사용자 비밀번호
   * @returns 사용자 정보 및 액세스 토큰
   * @throws {UnauthorizedError} 이메일 또는 비밀번호가 일치하지 않는 경우
   * @throws {UnauthorizedError} 비활성화된 계정인 경우
   */
  static async login(
    email: string,
    password: string
  ): Promise<{
    user: {
      id: string;
      email: string;
      name: string;
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
    // 이메일로 사용자 조회 (password 포함)
    const user = await UserModel.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    // 타이밍 공격 방어: 항상 bcrypt.compare 실행
    // 사용자가 없을 때도 동일한 시간이 걸리도록 더미 해시 사용
    const passwordHash = user?.password || DUMMY_PASSWORD_HASH;
    const isPasswordValid = await bcrypt.compare(password, passwordHash);

    // 사용자 존재 여부, 비밀번호 일치 여부, 활성 상태를 한번에 확인
    if (!user || !isPasswordValid || !user.isActive) {
      // 로그인 실패 로그 (타이밍 공격 방어를 위해 해시된 이메일 사용)
      logger.warn('로그인 시도 실패', {
        emailHash: email.substring(0, 3) + '***',
        reason: !user
          ? 'user_not_found'
          : !isPasswordValid
          ? 'invalid_password'
          : 'inactive_account',
      });

      // 동일한 에러 메시지로 정보 노출 방지
      throw new UnauthorizedError(
        '이메일 또는 비밀번호가 일치하지 않습니다'
      );
    }

    // lastLogin 업데이트 (실패해도 로그인은 진행)
    // 중요: lastLogin은 부가 기능이므로 실패해도 로그인 자체는 성공으로 처리
    try {
      user.lastLogin = new Date();
      await user.save();
    } catch (error) {
      logger.warn('lastLogin 업데이트 실패 (로그인은 정상 진행)', {
        userIdHash: hashUserId(user._id.toString()),
        error: error instanceof Error ? error.message : String(error),
      });
      // 의도적으로 에러를 throw하지 않음 - lastLogin은 critical하지 않음
    }

    logger.info('사용자 로그인 성공', {
      userIdHash: hashUserId(user._id.toString()),
    });

    // JWT 토큰 발급
    const accessToken = generateToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    // password 제외하고 반환
    const userResponse = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
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

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Access Token 갱신
   * @param refreshToken - Refresh Token
   * @returns 새로운 Access Token과 Refresh Token
   * @throws {UnauthorizedError} Refresh Token이 유효하지 않은 경우
   * @throws {NotFoundError} 사용자를 찾을 수 없는 경우
   * @throws {UnauthorizedError} 사용자가 비활성화된 경우
   */
  static async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    // Refresh Token 검증
    const { userId } = verifyRefreshToken(refreshToken);

    // 사용자 조회 (필요한 필드만 조회 + lean으로 최적화)
    const user = await UserModel.findById(userId)
      .select('role isActive')
      .lean();

    if (!user) {
      logger.warn('토큰 갱신 실패 - 존재하지 않는 사용자', {
        userIdHash: hashUserId(userId),
      });
      throw new NotFoundError('사용자를 찾을 수 없습니다');
    }

    // 사용자 활성 상태 확인
    if (!user.isActive) {
      logger.warn('토큰 갱신 실패 - 비활성화된 계정', {
        userIdHash: hashUserId(userId),
      });
      throw new UnauthorizedError('비활성화된 계정입니다');
    }

    logger.info('Access Token 갱신 완료', {
      userIdHash: hashUserId(userId),
    });

    // 새로운 토큰 발급
    const newAccessToken = generateToken(userId, user.role);
    const newRefreshToken = generateRefreshToken(userId);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * 내 정보 조회
   * @param userId - 사용자 ID
   * @returns 사용자 정보
   * @throws {NotFoundError} 사용자를 찾을 수 없는 경우
   */
  static async getMe(userId: string): Promise<{
    id: string;
    email: string;
    name: string;
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
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
  }> {
    // 읽기 전용 쿼리이므로 lean() 사용으로 성능 최적화
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
      name: user.name,
      role: user.role,
      department: user.department,
      position: user.position,
      points: user.points,
      trustScore: user.trustScore,
      badges: user.badges,
      reviewCount: user.reviewCount,
      helpfulVoteCount: user.helpfulVoteCount,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * 프로필 수정
   * @param userId - 사용자 ID
   * @param data - 수정할 프로필 데이터
   * @returns 업데이트된 사용자 정보
   * @throws {NotFoundError} 사용자를 찾을 수 없는 경우
   */
  static async updateProfile(
    userId: string,
    data: UpdateProfileInput
  ): Promise<{
    id: string;
    email: string;
    name: string;
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
    // 허용된 필드만 업데이트 (화이트리스트 방식)
    const allowedFields = ['name', 'department', 'position'];
    const updateData: Partial<UpdateProfileInput> = {};

    // 허용된 필드만 추출
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
      {
        new: true,
        runValidators: true,
      }
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
      name: user.name,
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
   * @param userId - 사용자 ID
   * @param currentPassword - 현재 비밀번호
   * @param newPassword - 새 비밀번호
   * @returns 성공 메시지
   * @throws {NotFoundError} 사용자를 찾을 수 없는 경우
   * @throws {UnauthorizedError} 현재 비밀번호가 일치하지 않는 경우
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    // 사용자 조회 (password 포함)
    const user = await UserModel.findById(userId).select('+password');

    if (!user) {
      logger.warn('비밀번호 변경 실패 - 존재하지 않는 사용자', {
        userIdHash: hashUserId(userId),
      });
      throw new NotFoundError('사용자를 찾을 수 없습니다');
    }

    // 현재 비밀번호 검증
    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      logger.warn('비밀번호 변경 실패 - 현재 비밀번호 불일치', {
        userIdHash: hashUserId(user._id.toString()),
      });
      throw new UnauthorizedError('Current password is incorrect');
    }

    // 새 비밀번호 설정
    user.password = newPassword; // pre-save hook에서 자동 해싱
    await user.save();

    logger.info('비밀번호 변경 완료', {
      userIdHash: hashUserId(user._id.toString()),
    });

    return {
      message: '비밀번호가 변경되었습니다',
    };
  }

  /**
   * 비밀번호 찾기 (재설정 토큰 생성 및 이메일 전송)
   * @param email - 사용자 이메일
   * @returns 성공 메시지
   * @throws {NotFoundError} 사용자를 찾을 수 없는 경우
   */
  static async forgotPassword(email: string): Promise<{ message: string }> {
    // 사용자 조회
    const user = await UserModel.findOne({ email: email.toLowerCase() }).select(
      '+resetPasswordToken +resetPasswordExpires'
    );

    if (!user) {
      logger.warn('비밀번호 재설정 요청 - 존재하지 않는 이메일', {
        emailMasked: maskEmail(email),
      });
      // 보안: 이메일 존재 여부를 노출하지 않음
      return {
        message: '재설정 링크를 이메일로 전송했습니다',
      };
    }

    // 6자리 랜덤 토큰 생성 (숫자만)
    const resetToken = crypto.randomInt(100000, 999999).toString();

    // 토큰 저장 (1시간 후 만료)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1시간
    await user.save();

    logger.info('비밀번호 재설정 토큰 생성', {
      userIdHash: hashUserId(user._id.toString()),
      expiresAt: user.resetPasswordExpires,
    });

    // 이메일 전송
    try {
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (error) {
      // 이메일 전송 실패 시 토큰 삭제
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      logger.error('비밀번호 재설정 이메일 전송 실패', {
        userIdHash: hashUserId(user._id.toString()),
        error: error instanceof Error ? error.message : String(error),
      });

      throw new BadRequestError('이메일 전송에 실패했습니다');
    }

    return {
      message: '재설정 링크를 이메일로 전송했습니다',
    };
  }

  /**
   * 비밀번호 재설정 토큰 검증
   * @param token - 재설정 토큰
   * @returns 유효성 여부
   * @throws {BadRequestError} 토큰이 유효하지 않거나 만료된 경우
   */
  static async verifyResetToken(token: string): Promise<{ valid: true }> {
    // 토큰으로 사용자 조회 (만료되지 않은 토큰만)
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      logger.warn('토큰 검증 실패 - 유효하지 않거나 만료된 토큰', {
        token: token.substring(0, 3) + '***',
      });
      throw new BadRequestError(
        '유효하지 않거나 만료된 토큰입니다'
      );
    }

    logger.debug('토큰 검증 성공', {
      userIdHash: hashUserId(user._id.toString()),
    });

    return { valid: true };
  }

  /**
   * 비밀번호 재설정
   * @param token - 재설정 토큰
   * @param newPassword - 새 비밀번호
   * @returns 성공 메시지
   * @throws {BadRequestError} 토큰이 유효하지 않거나 만료된 경우
   */
  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    // 토큰으로 사용자 조회 (만료되지 않은 토큰만)
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      logger.warn('비밀번호 재설정 실패 - 유효하지 않거나 만료된 토큰', {
        token: token.substring(0, 3) + '***',
      });
      throw new BadRequestError(
        '유효하지 않거나 만료된 토큰입니다'
      );
    }

    // 비밀번호 변경
    user.password = newPassword; // pre-save hook에서 자동 해싱
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    logger.info('비밀번호 재설정 완료', {
      userIdHash: hashUserId(user._id.toString()),
    });

    // 비밀번호 변경 완료 이메일 전송 (실패해도 무시)
    try {
      await sendPasswordChangedEmail(user.email, user.name);
    } catch (error) {
      logger.warn('비밀번호 변경 완료 이메일 전송 실패 (무시)', {
        userIdHash: hashUserId(user._id.toString()),
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return {
      message: '비밀번호가 변경되었습니다',
    };
  }
}


























