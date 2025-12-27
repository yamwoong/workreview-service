import { Card } from '@/components/ui/Card';
import type { IReview, IReviewUser, IReviewStore } from '@/types/review.types';
import { WAGE_TYPE_LABELS } from '@/types/review.types';

interface ReviewCardProps {
  review: IReview;
  showStoreInfo?: boolean; // Show store info when displaying in "My Reviews"
  onEdit?: (review: IReview) => void;
  onDelete?: (review: IReview) => void;
  onLike?: (review: IReview) => void;
  onDislike?: (review: IReview) => void;
  canEdit?: boolean; // Whether current user can edit this review
}

export const ReviewCard = ({
  review,
  showStoreInfo = false,
  onEdit,
  onDelete,
  onLike,
  onDislike,
  canEdit = false
}: ReviewCardProps): JSX.Element => {
  const user = review.user as IReviewUser;
  const store = review.store as IReviewStore;

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const renderStars = (rating: number): JSX.Element => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-400">
            ★
          </span>
        ))}
        {hasHalfStar && <span className="text-yellow-400">⯨</span>}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <Card className="hover:border-gray-400" padding="lg">
      <div className="space-y-3">
        {/* Store Info (for My Reviews page) */}
        {showStoreInfo && store && (
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="font-medium text-gray-900">{store.name}</p>
            <p className="text-sm text-gray-600">
              {typeof store.address === 'string' ? store.address : store.address.formatted}
            </p>
            <p className="text-xs text-gray-500 mt-1">{store.category}</p>
          </div>
        )}

        {/* Header: Name + Wage + Stars + Rating in one line */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Username */}
            <span className="font-medium text-gray-900">
              {review.isAnonymous ? 'Anonymous' : user?.name || 'Unknown'}
            </span>

            {/* Wage Type */}
            {review.wageType && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                {WAGE_TYPE_LABELS[review.wageType]}
              </span>
            )}

            {/* Stars + Rating */}
            <div className="flex items-center gap-2">
              {renderStars(review.rating)}
              <span className="font-semibold text-gray-900">{review.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Date */}
          <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
        </div>

        {/* Review Content */}
        {review.content && (
          <div>
            <p className="text-gray-900 whitespace-pre-wrap">{review.content}</p>
          </div>
        )}

        {/* Footer - Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            {/* Like Button (Thumbs Up) */}
            <button
              onClick={() => onLike?.(review)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
            >
              <span className="text-base">👍</span>
              <span>{review.likeCount || 0}</span>
            </button>

            {/* Dislike Button (Thumbs Down) */}
            <button
              onClick={() => onDislike?.(review)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <span className="text-base">👎</span>
              <span>{review.dislikeCount || 0}</span>
            </button>
          </div>

          {/* Edit/Delete Actions (if user owns review) */}
          {canEdit && (
            <div className="flex items-center gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(review)}
                  className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(review)}
                  className="px-3 py-1.5 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
