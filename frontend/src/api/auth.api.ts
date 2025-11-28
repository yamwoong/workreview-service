import { AxiosError } from 'axios';
import client from './client';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
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

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await client.post<AuthResponse>('/auth/register', data);
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

export const logout = async (): Promise<void> => {
  try {
    await client.post('/auth/logout');
  } catch (error) {
    handleRequestError(error);
  }
};

export const getMe = async (): Promise<User> => {
  try {
    const response = await client.get<{ success: true; data: User }>('/users/me');
    return response.data.data;
  } catch (error) {
    handleRequestError(error);
  }
};

export const authAPI = {
  register,
  login,
  logout,
  getMe
};




