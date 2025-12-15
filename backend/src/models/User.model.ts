import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { logger } from '../config/logger';
import { hashUserId } from '../utils/logMasking.util';

/**
 * Badge 인터페이스
 */
export interface IBadge {
  type:
    | 'verified_reviewer'
    | 'helpful_contributor'
    | 'prolific_reviewer'
    | 'early_adopter'
    | 'trusted_voice';
  name: string;
  earnedAt: Date;
}

/**
 * User 인터페이스
 */
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'manager' | 'employee';
  avatar?: string;
  department?: string;
  position?: string;
  isActive: boolean;
  lastLogin?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  // 🆕 Gamification fields
  points: number; // Total points earned
  trustScore: number; // Trust score (0-100)
  badges: IBadge[]; // Earned badges
  reviewCount: number; // Total reviews written
  helpfulVoteCount: number; // Total helpful votes received
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * User 스키마 정의
 */
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, '이메일은 필수입니다'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, '유효한 이메일을 입력하세요'],
      index: true,
    },
    password: {
      type: String,
      required: [true, '비밀번호는 필수입니다'],
      minlength: [8, '비밀번호는 최소 8자 이상이어야 합니다'],
      select: false, // 기본 조회 시 제외
    },
    name: {
      type: String,
      required: [true, '이름은 필수입니다'],
      trim: true,
      minlength: [2, '이름은 최소 2자 이상이어야 합니다'],
      maxlength: [50, '이름은 최대 50자까지 가능합니다'],
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'manager', 'employee'],
        message: '{VALUE}는 유효하지 않은 역할입니다',
      },
      default: 'employee',
      index: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    department: {
      type: String,
      trim: true,
      maxlength: [100, '부서명은 최대 100자까지 가능합니다'],
    },
    position: {
      type: String,
      trim: true,
      maxlength: [100, '직책은 최대 100자까지 가능합니다'],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      select: false, // 기본 조회 시 제외
    },
    resetPasswordExpires: {
      type: Date,
      select: false, // 기본 조회 시 제외
    },
    // 🆕 Gamification fields
    points: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    trustScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
      index: true,
    },
    badges: [
      {
        type: {
          type: String,
          enum: [
            'verified_reviewer',
            'helpful_contributor',
            'prolific_reviewer',
            'early_adopter',
            'trusted_voice',
          ],
        },
        name: String,
        earnedAt: { type: Date, default: Date.now },
      },
    ],
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    helpfulVoteCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        // 비밀번호 필드 제거 (타입 안전하게)
        const { password, ...rest } = ret;
        return rest;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc, ret) => {
        // 비밀번호 필드 제거 (타입 안전하게)
        const { password, ...rest } = ret;
        return rest;
      },
    },
  }
);

// 인덱스
// userSchema.index({ email: 1 }); // 제거: unique: true에서 이미 자동 생성됨
userSchema.index({ createdAt: -1 });
userSchema.index({ role: 1, isActive: 1 });

/**
 * 비밀번호 해싱 미들웨어 (pre-save hook)
 * Mongoose 9+ 버전: Promise 기반 (next 콜백 사용 안 함)
 */
userSchema.pre('save', async function () {
  // 비밀번호가 수정되지 않았으면 해싱하지 않음
  if (!this.isModified('password')) return;

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    logger.error('비밀번호 해싱 실패 (pre-save hook)', {
      userIdHash: this._id ? hashUserId(this._id.toString()) : 'new_user',
      error: error instanceof Error ? error.message : String(error),
    });

    // Error 타입 변환: unknown -> Error
    const errorToThrow =
      error instanceof Error
        ? error
        : new Error(
            `비밀번호 처리 중 오류가 발생했습니다: ${String(error)}`
          );

    throw errorToThrow;
  }
});

/**
 * 비밀번호 비교 메서드
 * @param candidatePassword - 비교할 비밀번호
 * @returns 비밀번호 일치 여부
 */
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

export const UserModel = model<IUser>('User', userSchema);


















