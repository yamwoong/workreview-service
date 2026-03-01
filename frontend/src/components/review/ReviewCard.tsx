import { useTranslation } from 'react-i18next';
import { Star, ThumbsUp, ThumbsDown, Edit2, Trash2 } from 'lucide-react';
import type { IReview, IReviewUser, IReviewStore } from '@/types/review.types';
import { WAGE_TYPE_LABELS } from '@/types/review.types';

interface ReviewCardProps {
  review: IReview;
  currentUserId?: string;
  showStoreInfo?: boolean;
  onEdit?: (review: IReview) => void;
  onDelete?: (review: IReview) => void;
  onLike?: (review: IReview) => void;
  onDislike?: (review: IReview) => void;
}

export const ReviewCard = ({
  review,
  currentUserId,
  showStoreInfo = false,
  onEdit,
  onDelete,
  onLike,
  onDislike
}: ReviewCardProps): JSX.Element => {
  const { t, i18n } = useTranslation();
  const user = review.user as IReviewUser;
  const store = review.store as IReviewStore;

  const canEdit = Boolean(currentUserId && user?._id && currentUserId === user._id);

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString(i18n.language === 'ko' ? 'ko-KR' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const wageTypeColors: Record<string, string> = {
    below_minimum: 'bg-red-100 text-red-700',
    at_minimum: 'bg-blue-100 text-blue-700',
    above_minimum: 'bg-green-100 text-green-700'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
      {/* Store Info (for My Reviews page) */}
      {showStoreInfo && store && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-[14px] font-medium text-gray-900">{store.name}</p>
          <p className="text-[13px] text-gray-500">
            {typeof store.address === 'string' ? store.address : store.address.formatted}
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Avatar */}
          <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <span className="text-primary text-[14px] font-semibold">
              {review.isAnonymous ? '?' : (user?.username?.charAt(0)?.toUpperCase() ?? '?')}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[14px] font-medium text-gray-900">
                {review.isAnonymous ? t('reviewCard.anonymous') : user?.username || t('reviewCard.unknown')}
              </span>
              {/* Wage Type Badge */}
              {review.wageType && (
                <span className={`px-2 py-0.5 text-[12px] font-medium rounded-full ${wageTypeColors[review.wageType] ?? 'bg-gray-100 text-gray-700'}`}>
                  {WAGE_TYPE_LABELS[review.wageType]}
                </span>
              )}
            </div>
            <span className="text-[12px] text-gray-400">{formatDate(review.createdAt)}</span>
          </div>
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-1 shrink-0">
          <Star size={16} className="text-primary fill-primary" />
          <span className="text-[14px] font-semibold text-gray-900">{review.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Review Content */}
      {review.content && (
        <p className="text-[14px] text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
          {review.content}
        </p>
      )}

      {/* Position info */}
      {review.position && (
        <p className="text-[13px] text-gray-500 mb-3">
          <span className="font-medium">Position:</span> {review.position}
        </p>
      )}

      {/* Footer - Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onLike?.(review)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
          >
            <ThumbsUp size={14} />
            <span>{review.likeCount || 0}</span>
          </button>
          <button
            onClick={() => onDislike?.(review)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <ThumbsDown size={14} />
            <span>{review.dislikeCount || 0}</span>
          </button>
        </div>

        {/* Edit/Delete (if owner) */}
        {canEdit && (
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(review)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                <Edit2 size={13} />
                <span>{t('reviewCard.edit')}</span>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(review)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={13} />
                <span>{t('reviewCard.delete')}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
