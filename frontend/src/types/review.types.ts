/**
 * Review-related TypeScript types
 * Matching backend IReview interface
 */

// Review mode
export type ReviewMode = 'quick' | 'detailed';

// Wage type
export type WageType = 'below_minimum' | 'minimum_wage' | 'above_minimum';

// User info in review
export interface IReviewUser {
  _id: string;
  name: string;
  trustScore?: number;
}

// Store info in review
export interface IReviewStore {
  _id: string;
  name: string;
  address: string | { formatted: string };
  category: string;
  averageRating?: number;
}

// Main Review interface
export interface IReview {
  _id: string;
  user: string | IReviewUser; // Can be populated
  store: string | IReviewStore; // Can be populated
  reviewMode: ReviewMode;
  rating: number; // Rating (1-5)
  wageType?: WageType;
  hourlyWage?: number;
  content: string;
  position: string;
  isAnonymous: boolean;
  helpfulCount: number;
  likeCount: number;
  dislikeCount: number;
  createdAt: string;
  updatedAt: string;
}

// API Request Types

export interface CreateReviewInput {
  storeId?: string; // Store ID if already exists
  googlePlaceId?: string; // Google Place ID if creating new store
  reviewMode: ReviewMode;
  rating: number; // Rating (1-5)
  wageType?: WageType;
  hourlyWage?: number;
  content: string;
  position: string;
  isAnonymous?: boolean;
}

export interface UpdateReviewInput {
  reviewMode?: ReviewMode;
  rating?: number; // Rating (1-5)
  wageType?: WageType;
  hourlyWage?: number;
  content?: string;
  position?: string;
  isAnonymous?: boolean;
}

export interface GetReviewsParams {
  page?: number;
  limit?: number;
  sort?: 'latest' | 'rating' | 'helpful';
  reviewMode?: ReviewMode;
  wageType?: WageType;
}

// API Response Types

export interface GetReviewsResponse {
  success: true;
  data: {
    reviews: IReview[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    stats?: {
      totalReviews: number;
      averageWage?: number;
      averageRating?: number;
    };
  };
}

export interface GetReviewResponse {
  success: true;
  data: IReview;
}

export interface CreateReviewResponse {
  success: true;
  data: IReview;
  message?: string;
}

export interface UpdateReviewResponse {
  success: true;
  data: IReview;
  message?: string;
}

export interface DeleteReviewResponse {
  success: true;
  message: string;
}

// Helper types for forms
export interface ReviewFormData {
  storeId?: string;
  googlePlaceId?: string;
  reviewMode: ReviewMode;
  rating: number; // Rating (1-5)
  wageType?: WageType;
  hourlyWage?: number;
  content: string;
  position: string;
  isAnonymous: boolean;
}

// Wage type labels
export const WAGE_TYPE_LABELS: Record<WageType, string> = {
  below_minimum: 'Below Minimum Wage',
  minimum_wage: 'Minimum Wage',
  above_minimum: 'Above Minimum Wage'
};
