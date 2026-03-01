export type UserRole = 'admin' | 'manager' | 'employee';

export interface Badge {
  type: 'verified_reviewer' | 'helpful_contributor' | 'prolific_reviewer' | 'early_adopter' | 'trusted_voice';
  name: string;
  earnedAt: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  department?: string;
  position?: string;
  points: number;
  trustScore: number;
  badges: Badge[];
  reviewCount: number;
  helpfulVoteCount: number;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface AuthResponse {
  success: true;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  message?: string;
}

export interface RegisterResponse {
  success: true;
  data: {
    message: string;
    email: string;
  };
  message?: string;
}
