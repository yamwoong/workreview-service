import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useStore } from '@/hooks/useStores';
import { useReviews, useUpdateReview, useDeleteReview, reviewKeys } from '@/hooks/useReviews';
import { useAuth } from '@/hooks/useAuth';
import { likeReview, dislikeReview } from '@/api/review.api';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';
import { Pagination } from '@/components/ui/Pagination';
import { ReviewCard } from '@/components/review/ReviewCard';
import { EditReviewModal } from '@/components/review/EditReviewModal';
import { QuestionList } from '@/components/question/QuestionList';
import { formatWage } from '@/types/store.types';
import type { GetReviewsParams, IReview } from '@/types/review.types';
import { useAuthStore } from '@/stores/authStore';

export const StoreDetailPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const { user } = useAuthStore();
  const { data: store, isLoading, error } = useStore(id || '');

  // Tab state
  const [activeTab, setActiveTab] = useState<'reviews' | 'qna'>('reviews');

  // Edit review state
  const [editingReview, setEditingReview] = useState<IReview | null>(null);

  // Review filters and pagination
  const [reviewParams, setReviewParams] = useState<GetReviewsParams>({
    page: 1,
    limit: 10,
    sort: 'latest'
  });

  const {
    data: reviewsData,
    isLoading: isLoadingReviews,
    error: reviewsError
  } = useReviews(id || '', reviewParams);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [reviewParams.page]);

  // Edit/Delete mutations
  const deleteReviewMutation = useDeleteReview();

  // Like/Dislike handlers
  const handleLike = async (review: IReview) => {
    if (!isAuthenticated) {
      toast.error('Please login to like reviews');
      return;
    }

    try {
      await likeReview(review._id);
      toast.success('Liked!');
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
    } catch (error) {
      toast.error('Failed to like review');
    }
  };

  const handleDislike = async (review: IReview) => {
    if (!isAuthenticated) {
      toast.error('Please login to dislike reviews');
      return;
    }

    try {
      await dislikeReview(review._id);
      toast.success('Disliked!');
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
    } catch (error) {
      toast.error('Failed to dislike review');
    }
  };

  // Edit review handler
  const handleEdit = (review: IReview) => {
    setEditingReview(review);
  };

  // Delete review handler
  const handleDelete = async (review: IReview) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await deleteReviewMutation.mutateAsync(review._id);
      toast.success('Review deleted successfully');
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Invalid store ID</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              Failed to load store details. Please try again later.
            </p>
            <button
              onClick={() => navigate('/stores')}
              className="mt-2 text-sm text-red-900 underline"
            >
              Go back to stores
            </button>
          </div>
        </div>
      </div>
    );
  }

  const categoryLabels: Record<string, string> = {
    cafe: 'Cafe',
    restaurant: 'Restaurant',
    convenience: 'Convenience Store',
    retail: 'Retail Store',
    service: 'Service',
    education: 'Education',
    entertainment: 'Entertainment',
    other: 'Other'
  };

  const hasRatings = store.reviewCount > 0;
  const hasWageData = store.wageStats?.total > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/stores')}
          className="mb-4 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to stores
        </button>

        {/* Store Header */}
        <Card padding="lg" className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {store.name}
              </h1>
              <span className="inline-block px-3 py-1 text-sm font-medium rounded-md bg-blue-50 text-blue-700">
                {categoryLabels[store.category]}
              </span>
            </div>
          </div>

          {/* Address & Contact */}
          <div className="space-y-2 text-gray-600">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 mt-0.5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div>
                <p className="text-sm">{store.address.formatted}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {store.address.city && `${store.address.city}, `}
                  {store.address.countryName}
                </p>
              </div>
            </div>

            {store.phone && (
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <p className="text-sm">{store.phone}</p>
              </div>
            )}
          </div>

          {store.isFromGooglePlaces && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" />
                </svg>
                Verified by Google Places
              </span>
            </div>
          )}
        </Card>

        {/* Ratings Section */}
        <Card padding="lg" className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Ratings
            {hasRatings && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({store.reviewCount} {store.reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            )}
          </h2>

          {hasRatings ? (
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-gray-900">
                  {store.averageRating.toFixed(1)}
                </span>
                <span className="text-3xl text-yellow-500">★</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Average Rating
                </p>
                <p className="text-xs text-gray-600">
                  Based on {store.reviewCount}{' '}
                  {store.reviewCount === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No reviews yet</p>
              <p className="text-xs mt-1">Be the first to review this workplace!</p>
            </div>
          )}
        </Card>

        {/* Wage Information */}
        <Card padding="lg" className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Wage Information
          </h2>

          {hasWageData ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Below Minimum Wage</p>
                  <p className="text-2xl font-bold text-red-900">
                    {store.wageStats?.belowMinimum || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(store.wageStats?.total || 0) > 0
                      ? `${Math.round(((store.wageStats?.belowMinimum || 0) / (store.wageStats?.total || 1)) * 100)}%`
                      : '0%'}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Minimum Wage</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {store.wageStats?.minimumWage || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(store.wageStats?.total || 0) > 0
                      ? `${Math.round(((store.wageStats?.minimumWage || 0) / (store.wageStats?.total || 1)) * 100)}%`
                      : '0%'}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Above Minimum Wage</p>
                  <p className="text-2xl font-bold text-green-900">
                    {store.wageStats?.aboveMinimum || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(store.wageStats?.total || 0) > 0
                      ? `${Math.round(((store.wageStats?.aboveMinimum || 0) / (store.wageStats?.total || 1)) * 100)}%`
                      : '0%'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Based on {store.wageStats?.total || 0}{' '}
                {(store.wageStats?.total || 0) === 1 ? 'wage report' : 'wage reports'}
              </p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No wage data available yet</p>
            </div>
          )}
        </Card>

        {/* Reviews & Q&A Tabs Section */}
        <Card padding="lg">
          {/* Tab Headers */}
          <div className="flex items-center border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'reviews'
                  ? 'text-[#4DCDB3] border-b-2 border-[#4DCDB3]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Reviews
              {store && (
                <span className="ml-2 text-xs">
                  ({store.reviewCount})
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('qna')}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'qna'
                  ? 'text-[#4DCDB3] border-b-2 border-[#4DCDB3]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Q&A
              {store && (
                <span className="ml-2 text-xs">
                  ({store.questionCount || 0})
                </span>
              )}
            </button>
          </div>

          {/* Reviews Tab Content */}
          {activeTab === 'reviews' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Reviews
                  {reviewsData && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({reviewsData.data.pagination.total})
                    </span>
                  )}
                </h2>

                {isAuthenticated && (
                  <button
                    onClick={() => navigate(`/stores/${id}/review/new`)}
                    className="px-4 py-2 bg-[#4DCDB3] hover:bg-[#3CB89F] text-white font-medium text-sm rounded-md transition-colors"
                  >
                    Write Review
                  </button>
                )}
              </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-gray-600">Sort by:</span>
            <div className="flex gap-2">
              {(['latest', 'rating', 'helpful'] as const).map((sortOption) => (
                <button
                  key={sortOption}
                  onClick={() =>
                    setReviewParams((prev) => ({ ...prev, sort: sortOption, page: 1 }))
                  }
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    reviewParams.sort === sortOption
                      ? 'bg-blue-100 text-blue-800 font-medium'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {sortOption === 'latest'
                    ? 'Latest'
                    : sortOption === 'rating'
                      ? 'Rating'
                      : 'Most Helpful'}
                </button>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          {isLoadingReviews ? (
            <div className="flex justify-center py-12">
              <Spinner size="md" />
            </div>
          ) : reviewsError ? (
            <div className="text-center py-12 text-red-600">
              <p className="text-sm">Failed to load reviews. Please try again.</p>
            </div>
          ) : reviewsData && reviewsData.data.reviews.length > 0 ? (
            <>
              <div className="space-y-4">
                {reviewsData.data.reviews.map((review) => {
                  const reviewUserId = typeof review.user === 'string' ? review.user : review.user._id;
                  const canEdit = user?.id === reviewUserId;

                  return (
                    <ReviewCard
                      key={review._id}
                      review={review}
                      showStoreInfo={false}
                      onLike={handleLike}
                      onDislike={handleDislike}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      canEdit={canEdit}
                    />
                  );
                })}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={reviewsData.data.pagination.page}
                totalPages={reviewsData.data.pagination.pages}
                totalItems={reviewsData.data.pagination.total}
                itemsPerPage={reviewsData.data.pagination.limit}
                onPageChange={(page) =>
                  setReviewParams((prev) => ({ ...prev, page }))
                }
              />
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              <p className="text-sm mt-2">No reviews yet</p>
              {isAuthenticated && (
                <button
                  onClick={() => navigate(`/stores/${id}/review/new`)}
                  className="mt-4 px-4 py-2 bg-[#4DCDB3] hover:bg-[#3CB89F] text-white font-medium text-sm rounded-md transition-colors"
                >
                  Write the first review
                </button>
              )}
            </div>
          )}
            </>
          )}

          {/* Q&A Tab Content */}
          {activeTab === 'qna' && (
            <QuestionList storeId={id || ''} />
          )}
        </Card>

        {/* Edit Review Modal */}
        {editingReview && (
          <EditReviewModal
            review={editingReview}
            onClose={() => setEditingReview(null)}
          />
        )}
      </div>
    </div>
  );
};
