import { AxiosError } from 'axios';
import client from './client';
import type {
  CreateReviewInput,
  UpdateReviewInput,
  GetReviewsParams,
  GetReviewsResponse,
  GetReviewResponse,
  CreateReviewResponse,
  UpdateReviewResponse,
  DeleteReviewResponse
} from '@/types/review.types';

const handleRequestError = (error: unknown): never => {
  if (error instanceof AxiosError) {
    if (error.response?.data) {
      throw error.response.data;
    }

    throw new Error(error.message);
  }

  throw error;
};

/**
 * Get reviews for a specific store
 */
export const getReviews = async (
  storeId: string,
  params?: GetReviewsParams
): Promise<GetReviewsResponse> => {
  try {
    const response = await client.get<GetReviewsResponse>('/reviews', {
      params: {
        store: storeId,
        ...params
      }
    });
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

/**
 * Get current user's reviews
 */
export const getMyReviews = async (params?: GetReviewsParams): Promise<GetReviewsResponse> => {
  try {
    const response = await client.get<GetReviewsResponse>('/reviews/my', {
      params
    });
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

/**
 * Get single review by ID
 */
export const getReview = async (id: string): Promise<GetReviewResponse> => {
  try {
    const response = await client.get<GetReviewResponse>(`/reviews/${id}`);
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

/**
 * Create new review
 */
export const createReview = async (data: CreateReviewInput): Promise<CreateReviewResponse> => {
  try {
    console.log('Creating review with data:', data);
    const response = await client.post<CreateReviewResponse>('/reviews', data);
    return response.data;
  } catch (error) {
    console.error('Review creation failed:', error);
    if (error instanceof AxiosError && error.response?.data) {
      console.error('Validation errors:', error.response.data);
    }
    handleRequestError(error);
  }
};

/**
 * Update existing review
 */
export const updateReview = async (
  id: string,
  data: UpdateReviewInput
): Promise<UpdateReviewResponse> => {
  try {
    const response = await client.patch<UpdateReviewResponse>(`/reviews/${id}`, data);
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

/**
 * Delete review
 */
export const deleteReview = async (id: string): Promise<DeleteReviewResponse> => {
  try {
    const response = await client.delete<DeleteReviewResponse>(`/reviews/${id}`);
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

/**
 * Mark review as helpful
 */
export const markHelpful = async (id: string): Promise<{ success: true; message?: string }> => {
  try {
    const response = await client.post<{ success: true; message?: string }>(
      `/reviews/${id}/helpful`
    );
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

/**
 * Like review (thumbs up)
 */
export const likeReview = async (id: string): Promise<{ success: true; message?: string }> => {
  try {
    const response = await client.post<{ success: true; message?: string }>(
      `/reviews/${id}/like`
    );
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

/**
 * Dislike review (thumbs down)
 */
export const dislikeReview = async (id: string): Promise<{ success: true; message?: string }> => {
  try {
    const response = await client.post<{ success: true; message?: string }>(
      `/reviews/${id}/dislike`
    );
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

export const reviewAPI = {
  getReviews,
  getMyReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
  likeReview,
  dislikeReview
};
