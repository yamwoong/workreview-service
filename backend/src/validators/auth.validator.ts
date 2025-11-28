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
  name: z
    .string({
      required_error: '이름은 필수입니다',
    })
    .min(2, '이름은 최소 2자 이상이어야 합니다')
    .max(50, '이름은 최대 50자까지 가능합니다')
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
 * 로그인 스키마
 */
export const loginSchema = z.object({
  email: z
    .string({
      required_error: '이메일은 필수입니다',
    })
    .email('유효한 이메일 형식이 아닙니다')
    .toLowerCase()
    .trim(),
  password: z.string({
    required_error: '비밀번호는 필수입니다',
  }),
});

/**
 * 프로필 수정 스키마
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, '이름은 최소 2자 이상이어야 합니다')
    .max(50, '이름은 최대 50자까지 가능합니다')
    .trim()
    .optional(),
  avatar: z
    .string()
    .url('유효한 URL 형식이 아닙니다')
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
 * 타입 추론
 */
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;






