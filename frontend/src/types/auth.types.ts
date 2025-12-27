export type UserRole = 'admin' | 'manager' | 'employee';

export interface Badge {
  type: 'verified_reviewer' | 'helpful_contributor' | 'prolific_reviewer' | 'early_adopter' | 'trusted_voice';
  name: string;
  earnedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  position?: string;
  points: number;
  trustScore: number;
  badges: Badge[];
  reviewCount: number;
  helpfulVoteCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
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








