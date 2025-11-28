import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/api/auth.api';
import { useAuthStore } from '@/stores/authStore';
import type { LoginInput, RegisterInput } from '@/validators/auth.validator';

type AuthResponse = Awaited<ReturnType<typeof authAPI.login>>;

export const useLogin = (): UseMutationResult<AuthResponse, unknown, LoginInput> => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (payload: LoginInput) => authAPI.login(payload),
    onSuccess: (data) => {
      const { user, accessToken } = data.data;

      setUser(user, accessToken);
      navigate('/', { replace: true });
    }
  });
};

export const useRegister = (): UseMutationResult<AuthResponse, unknown, RegisterInput> => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (payload: RegisterInput) => authAPI.register(payload),
    onSuccess: (data) => {
      const { user, accessToken } = data.data;

      setUser(user, accessToken);
      navigate('/', { replace: true });
    }
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



