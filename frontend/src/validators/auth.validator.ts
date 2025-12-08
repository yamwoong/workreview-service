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
  name: z.string().min(2, { message: '이름은 최소 2자 이상이어야 합니다.' }),
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
  email: z.string().email({ message: '올바른 이메일 주소를 입력해주세요.' }),
  password: z.string().min(1, { message: '비밀번호를 입력해주세요.' })
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, { message: '이름은 최소 2자 이상이어야 합니다.' }).optional(),
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
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;


