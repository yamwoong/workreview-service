import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getReviews,
  getMyReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
  likeReview,
  dislikeReview
} from '@/api/review.api';
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

// Query keys factory
export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  list: (storeId: string, params?: GetReviewsParams) =>
    [...reviewKeys.lists(), storeId, params] as const,
  myReviews: (params?: GetReviewsParams) => [...reviewKeys.all, 'my', params] as const,
  details: () => [...reviewKeys.all, 'detail'] as const,
  detail: (id: string) => [...reviewKeys.details(), id] as const
};

/**
 * Get reviews for a specific store
 */
export const useReviews = (storeId: string, params?: GetReviewsParams) => {
  return useQuery<GetReviewsResponse>({
    queryKey: reviewKeys.list(storeId, params),
    queryFn: () => getReviews(storeId, params),
    enabled: !!storeId
  });
};

/**
 * Get current user's reviews
 */
export const useMyReviews = (params?: GetReviewsParams) => {
  return useQuery<GetReviewsResponse>({
    queryKey: reviewKeys.myReviews(params),
    queryFn: () => getMyReviews(params)
  });
};

/**
 * Get single review by ID
 */
export const useReview = (id: string) => {
  return useQuery<GetReviewResponse>({
    queryKey: reviewKeys.detail(id),
    queryFn: () => getReview(id),
    enabled: !!id
  });
};

/**
 * Create new review
 */
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateReviewResponse, unknown, CreateReviewInput>({
    mutationFn: createReview,
    onSuccess: (data) => {
      // Invalidate reviews list for the store
      const review = data.data;
      const storeId = typeof review.store === 'string' ? review.store : review.store._id;

      queryClient.invalidateQueries({
        queryKey: reviewKeys.lists()
      });

      // Invalidate my reviews
      queryClient.invalidateQueries({
        queryKey: reviewKeys.myReviews()
      });

      // Invalidate store details (to update ratings/wage stats)
      queryClient.invalidateQueries({
        queryKey: ['stores', 'detail', storeId]
      });
    }
  });
};

/**
 * Update existing review
 */
export const useUpdateReview = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<UpdateReviewResponse, unknown, UpdateReviewInput>({
    mutationFn: (data) => updateReview(id, data),
    onSuccess: (data) => {
      const review = data.data;
      const storeId = typeof review.store === 'string' ? review.store : review.store._id;

      // Invalidate review detail
      queryClient.invalidateQueries({
        queryKey: reviewKeys.detail(id)
      });

      // Invalidate reviews list
      queryClient.invalidateQueries({
        queryKey: reviewKeys.lists()
      });

      // Invalidate my reviews
      queryClient.invalidateQueries({
        queryKey: reviewKeys.myReviews()
      });

      // Invalidate store details
      queryClient.invalidateQueries({
        queryKey: ['stores', 'detail', storeId]
      });
    }
  });
};

/**
 * Delete review
 */
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteReviewResponse, unknown, string>({
    mutationFn: deleteReview,
    onSuccess: () => {
      // Invalidate all review queries and store details
      queryClient.invalidateQueries({
        queryKey: reviewKeys.all
      });

      queryClient.invalidateQueries({
        queryKey: ['stores', 'detail']
      });
    }
  });
};

/**
 * Mark review as helpful
 */
export const useMarkHelpful = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<{ success: true; message?: string }, unknown, void>({
    mutationFn: () => markHelpful(id),
    onSuccess: () => {
      // Invalidate review detail to get updated helpful count
      queryClient.invalidateQueries({
        queryKey: reviewKeys.detail(id)
      });

      // Invalidate reviews list
      queryClient.invalidateQueries({
        queryKey: reviewKeys.lists()
      });
    }
  });
};

/**
 * Like review (thumbs up)
 */
export const useLikeReview = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<{ success: true; message?: string }, unknown, void>({
    mutationFn: () => likeReview(id),
    onSuccess: () => {
      // Invalidate review detail to get updated like count
      queryClient.invalidateQueries({
        queryKey: reviewKeys.detail(id)
      });

      // Invalidate reviews list
      queryClient.invalidateQueries({
        queryKey: reviewKeys.lists()
      });
    }
  });
};

/**
 * Dislike review (thumbs down)
 */
export const useDislikeReview = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<{ success: true; message?: string }, unknown, void>({
    mutationFn: () => dislikeReview(id),
    onSuccess: () => {
      // Invalidate review detail to get updated dislike count
      queryClient.invalidateQueries({
        queryKey: reviewKeys.detail(id)
      });

      // Invalidate reviews list
      queryClient.invalidateQueries({
        queryKey: reviewKeys.lists()
      });
    }
  });
};
