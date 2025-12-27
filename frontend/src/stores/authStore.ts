import { create } from 'zustand';
import type { User } from '@/types/auth.types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setUser: (user: User, token: string) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isInitialized: false,
  setUser: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }

    set({
      user,
      token,
      isAuthenticated: true
    });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    set({
      user: null,
      token: null,
      isAuthenticated: false
    });
  },
  initialize: () => {
    if (typeof window === 'undefined') {
      set({ isInitialized: true });
      return;
    }

    const token = localStorage.getItem('token');
    const rawUser = localStorage.getItem('user');

    if (!token || !rawUser) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isInitialized: true
      });
      return;
    }

    try {
      const user = JSON.parse(rawUser) as User;

      set({
        user,
        token,
        isAuthenticated: true,
        isInitialized: true
      });
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isInitialized: true
      });
    }
  }
}));























