import { AxiosError } from 'axios';
import client from './client';
import type {
  AuthResponse,
  RegisterResponse,
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  User
} from '@/types/auth.types';

const handleRequestError = (error: unknown): never => {
  if (error instanceof AxiosError) {
    if (error.response?.data) {
      throw error.response.data;
    }

    throw new Error(error.message);
  }

  throw error;
};

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await client.post<RegisterResponse>('/auth/register', data);
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await client.post<AuthResponse>('/auth/login', data);
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

export const verifyEmail = async (data: VerifyEmailRequest): Promise<AuthResponse> => {
  try {
    const response = await client.post<AuthResponse>('/auth/verify-email', data);
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

export const resendVerification = async (email: string): Promise<{ success: true; message: string }> => {
  try {
    const response = await client.post<{ success: true; message: string }>('/auth/resend-verification', { email });
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

export const logout = async (): Promise<void> => {
  try {
    await client.post('/auth/logout');
  } catch (error) {
    handleRequestError(error);
  }
};

export const getMe = async (): Promise<User> => {
  try {
    const response = await client.get<{ success: true; data: User }>('/auth/me');
    return response.data.data;
  } catch (error) {
    handleRequestError(error);
  }
};

export interface UpdateProfileRequest {
  username?: string;
  department?: string;
  position?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const updateProfile = async (data: UpdateProfileRequest): Promise<User> => {
  try {
    const response = await client.patch<{ success: true; data: User; message?: string }>('/auth/me', data);
    return response.data.data;
  } catch (error) {
    handleRequestError(error);
  }
};

export const updatePassword = async (data: UpdatePasswordRequest): Promise<void> => {
  try {
    await client.put<{ success: true; message?: string }>('/auth/me/password', data);
  } catch (error) {
    handleRequestError(error);
  }
};

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
}

export interface ForgotPasswordResponse {
  success: true;
  message: string;
}

export interface ResetPasswordResponse {
  success: true;
  message: string;
}

export const forgotPassword = async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
  try {
    const response = await client.post<ForgotPasswordResponse>('/auth/forgot-password', data);
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

export interface VerifyResetTokenResponse {
  success: true;
  valid: true;
}

export const verifyResetToken = async (token: string): Promise<VerifyResetTokenResponse> => {
  try {
    const response = await client.get<VerifyResetTokenResponse>(`/auth/verify-reset-token/${token}`);
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

export const resetPassword = async (token: string, data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
  try {
    const response = await client.post<ResetPasswordResponse>(`/auth/reset-password/${token}`, data);
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

export const authAPI = {
  register,
  login,
  verifyEmail,
  resendVerification,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  verifyResetToken,
  resetPassword
};
