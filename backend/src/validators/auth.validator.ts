import { z } from 'zod';

/**
 * 회원가입 스키마
 */
export const registerSchema = z.object({
  email: z
    .string({
      required_error: '이메일은 필수입니다',
    })
    .email('유효한 이메일 형식이 아닙니다')
    .toLowerCase()
    .trim(),
  password: z
    .string({
      required_error: '비밀번호는 필수입니다',
    })
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)/,
      '비밀번호는 영문과 숫자를 포함해야 합니다'
    ),
  username: z
    .string({
      required_error: '사용자명은 필수입니다',
    })
    .min(3, '사용자명은 최소 3자 이상이어야 합니다')
    .max(20, '사용자명은 최대 20자까지 가능합니다')
    .regex(
      /^[a-z0-9_]+$/,
      '사용자명은 소문자, 숫자, 언더스코어만 사용 가능합니다'
    )
    .toLowerCase()
    .trim(),
  department: z
    .string()
    .max(100, '부서명은 최대 100자까지 가능합니다')
    .trim()
    .optional(),
  position: z
    .string()
    .max(100, '직책은 최대 100자까지 가능합니다')
    .trim()
    .optional(),
});

/**
 * 로그인 스키마 (이메일 또는 사용자명 허용)
 */
export const loginSchema = z.object({
  identifier: z
    .string({
      required_error: '이메일 또는 사용자명은 필수입니다',
    })
    .min(1, '이메일 또는 사용자명을 입력해주세요')
    .trim(),
  password: z.string({
    required_error: '비밀번호는 필수입니다',
  }),
});

/**
 * 프로필 수정 스키마
 */
export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, '사용자명은 최소 3자 이상이어야 합니다')
    .max(20, '사용자명은 최대 20자까지 가능합니다')
    .regex(
      /^[a-z0-9_]+$/,
      '사용자명은 소문자, 숫자, 언더스코어만 사용 가능합니다'
    )
    .toLowerCase()
    .trim()
    .optional(),
  department: z
    .string()
    .max(100, '부서명은 최대 100자까지 가능합니다')
    .trim()
    .optional(),
  position: z
    .string()
    .max(100, '직책은 최대 100자까지 가능합니다')
    .trim()
    .optional(),
});

/**
 * 비밀번호 변경 스키마
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string({
    required_error: '현재 비밀번호는 필수입니다',
  }),
  newPassword: z
    .string({
      required_error: '새 비밀번호는 필수입니다',
    })
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)/,
      '비밀번호는 영문과 숫자를 포함해야 합니다'
    ),
});

/**
 * 비밀번호 찾기 스키마
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string({
      required_error: '이메일은 필수입니다',
    })
    .email('유효한 이메일 형식이 아닙니다')
    .toLowerCase()
    .trim(),
});

/**
 * 비밀번호 재설정 스키마
 */
export const resetPasswordSchema = z.object({
  newPassword: z
    .string({
      required_error: '새 비밀번호는 필수입니다',
    })
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)/,
      '비밀번호는 영문과 숫자를 포함해야 합니다'
    ),
});

/**
 * 이메일 인증 스키마
 */
export const verifyEmailSchema = z.object({
  email: z
    .string({
      required_error: '이메일은 필수입니다',
    })
    .email('유효한 이메일 형식이 아닙니다')
    .toLowerCase()
    .trim(),
  code: z
    .string({
      required_error: '인증 코드는 필수입니다',
    })
    .length(6, '인증 코드는 6자리여야 합니다'),
});

/**
 * 인증 이메일 재발송 스키마
 */
export const resendVerificationSchema = z.object({
  email: z
    .string({
      required_error: '이메일은 필수입니다',
    })
    .email('유효한 이메일 형식이 아닙니다')
    .toLowerCase()
    .trim(),
});

/**
 * 타입 추론
 */
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
