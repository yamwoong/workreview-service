import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: '비밀번호에는 영문자와 숫자를 모두 포함해야 합니다.'
  });

const baseRegisterSchema = z.object({
  email: z.string().email({ message: '올바른 이메일 주소를 입력해주세요.' }),
  password: passwordSchema,
  username: z
    .string()
    .min(3, { message: '사용자명은 최소 3자 이상이어야 합니다.' })
    .max(20, { message: '사용자명은 최대 20자까지 가능합니다.' })
    .regex(/^[a-z0-9_]+$/, { message: '사용자명은 소문자, 숫자, 언더스코어만 사용 가능합니다.' }),
  department: z.string().optional(),
  position: z.string().optional()
});

export const confirmPasswordSchema = z.string().min(1, {
  message: '비밀번호를 다시 입력해주세요.'
});

export const registerSchema = baseRegisterSchema
  .extend({
    confirmPassword: confirmPasswordSchema
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword']
  });

export const registerPayloadSchema = baseRegisterSchema;

export const loginSchema = z.object({
  identifier: z.string().min(1, { message: '이메일 또는 사용자명을 입력해주세요.' }),
  password: z.string().min(1, { message: '비밀번호를 입력해주세요.' })
});

export const verifyEmailSchema = z.object({
  email: z.string().email({ message: '올바른 이메일 주소를 입력해주세요.' }),
  code: z.string().length(6, { message: '인증 코드는 6자리여야 합니다.' })
});

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, { message: '사용자명은 최소 3자 이상이어야 합니다.' })
    .max(20, { message: '사용자명은 최대 20자까지 가능합니다.' })
    .regex(/^[a-z0-9_]+$/, { message: '사용자명은 소문자, 숫자, 언더스코어만 사용 가능합니다.' })
    .optional(),
  department: z.string().optional(),
  position: z.string().optional()
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: '현재 비밀번호를 입력해주세요.' }),
    newPassword: passwordSchema,
    confirmPassword: confirmPasswordSchema
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword']
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: '올바른 이메일 주소를 입력해주세요.' })
});

export const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: confirmPasswordSchema
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword']
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerPayloadSchema>;
export type RegisterFormInput = z.infer<typeof registerSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
