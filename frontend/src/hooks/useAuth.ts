import { useMutation, useQuery, type UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authAPI, type UpdateProfileRequest, type UpdatePasswordRequest } from '@/api/auth.api';
import { useAuthStore } from '@/stores/authStore';
import type { LoginInput, RegisterInput, UpdateProfileInput, UpdatePasswordInput, VerifyEmailInput } from '@/validators/auth.validator';
import type { User, RegisterResponse, AuthResponse } from '@/types/auth.types';

export const useLogin = (): UseMutationResult<AuthResponse, unknown, LoginInput> => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (payload: LoginInput) => authAPI.login(payload),
    onSuccess: (data) => {
      const { user, accessToken } = data.data;
      setUser(user, accessToken);
      const from = (window.history.state?.usr?.from?.pathname as string) || '/';
      navigate(from, { replace: true });
    },
    onError: (error: unknown) => {
      const err = error as { error?: { code?: string; details?: { email?: string } } };
      if (err?.error?.code === 'EMAIL_VERIFICATION_REQUIRED') {
        const email = err?.error?.details?.email;
        if (email) {
          navigate(`/verify-email?email=${encodeURIComponent(email)}`, { replace: true });
        }
      }
    }
  });
};

export const useRegister = (): UseMutationResult<RegisterResponse, unknown, RegisterInput> => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: RegisterInput) => authAPI.register(payload),
    onSuccess: (data) => {
      const email = data.data.email;
      navigate(`/verify-email?email=${encodeURIComponent(email)}`, { replace: true });
    }
  });
};

export const useVerifyEmail = (): UseMutationResult<AuthResponse, unknown, VerifyEmailInput> => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (payload: VerifyEmailInput) => authAPI.verifyEmail(payload),
    onSuccess: (data) => {
      const { user, accessToken } = data.data;
      setUser(user, accessToken);
      navigate('/', { replace: true });
    }
  });
};

export const useResendVerification = (): UseMutationResult<{ success: true; message: string }, unknown, string> => {
  return useMutation({
    mutationFn: (email: string) => authAPI.resendVerification(email)
  });
};

export const useLogout = (): UseMutationResult<void, unknown, void> => {
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => authAPI.logout(),
    onSuccess: () => {
      logout();
    }
  });
};

/**
 * 인증 상태를 반환하는 hook
 */
export interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  return { user, isAuthenticated, isInitialized };
};

/**
 * 내 정보 조회 hook
 */
export const useMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => authAPI.getMe(),
    retry: 1
  });
};

/**
 * 프로필 수정 hook
 */
export const useUpdateProfile = (): UseMutationResult<User, unknown, UpdateProfileInput> => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (data: UpdateProfileInput) => {
      const payload: UpdateProfileRequest = {};
      if (data.username) payload.username = data.username;
      if (data.department !== undefined) payload.department = data.department;
      if (data.position !== undefined) payload.position = data.position;
      return authAPI.updateProfile(payload);
    },
    onSuccess: (updatedUser) => {
      const token = useAuthStore.getState().token;
      if (token && user) {
        setUser(updatedUser, token);
      }
      queryClient.invalidateQueries({ queryKey: ['me'] });
    }
  });
};

/**
 * 비밀번호 변경 hook
 */
export const useUpdatePassword = (): UseMutationResult<void, unknown, UpdatePasswordInput> => {
  return useMutation({
    mutationFn: (data: UpdatePasswordInput) => {
      return authAPI.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
    }
  });
};
