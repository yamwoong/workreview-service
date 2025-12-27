import { useState, useEffect } from 'react';
import { useUpdateReview } from '@/hooks/useReviews';
import toast from 'react-hot-toast';
import type { IReview } from '@/types/review.types';
import { WAGE_TYPE_LABELS } from '@/types/review.types';

interface EditReviewModalProps {
  review: IReview;
  onClose: () => void;
}

export const EditReviewModal = ({
  review,
  onClose,
}: EditReviewModalProps): JSX.Element => {
  const [rating, setRating] = useState(review.rating);
  const [content, setContent] = useState(review.content || '');
  const [wageType, setWageType] = useState(review.wageType || '');
  const [position, setPosition] = useState(review.position || '');
  const [isAnonymous, setIsAnonymous] = useState(review.isAnonymous);

  const updateReviewMutation = useUpdateReview(review._id);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // 모달 열릴 때 body 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateReviewMutation.mutateAsync({
        rating,
        content: content.trim() || undefined,
        wageType: wageType || undefined,
        position: position.trim() || undefined,
        isAnonymous,
      });
      toast.success('Review updated successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to update review');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Review</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-3xl transition-transform hover:scale-110"
                >
                  <span className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Selected: {rating} star{rating !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Wage Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wage Level
            </label>
            <select
              value={wageType}
              onChange={(e) => setWageType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DCDB3] focus:border-transparent"
            >
              <option value="">Select wage level (optional)</option>
              <option value="below_minimum">{WAGE_TYPE_LABELS.below_minimum}</option>
              <option value="minimum_wage">{WAGE_TYPE_LABELS.minimum_wage}</option>
              <option value="above_minimum">{WAGE_TYPE_LABELS.above_minimum}</option>
            </select>
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position
            </label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="e.g., Server, Chef, Cashier"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DCDB3] focus:border-transparent"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              {position.length}/100 characters
            </p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your experience working here..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DCDB3] focus:border-transparent resize-none"
              maxLength={2000}
            />
            <p className="text-xs text-gray-500 mt-1">
              {content.length}/2000 characters
            </p>
          </div>

          {/* Anonymous */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAnonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 text-[#4DCDB3] border-gray-300 rounded focus:ring-[#4DCDB3]"
            />
            <label htmlFor="isAnonymous" className="ml-2 text-sm text-gray-700">
              Post anonymously
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateReviewMutation.isPending}
              className="px-4 py-2 bg-[#4DCDB3] hover:bg-[#3CB89F] text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateReviewMutation.isPending ? 'Updating...' : 'Update Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
