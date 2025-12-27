import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import type { IStore } from '@/types/store.types';
import { formatWage, getCurrencySymbol } from '@/types/store.types';

interface StoreCardProps {
  store: IStore;
}

export const StoreCard = ({ store }: StoreCardProps): JSX.Element => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/stores/${store._id}`);
  };

  const categoryLabels: Record<string, string> = {
    cafe: 'Cafe',
    restaurant: 'Restaurant',
    convenience: 'Convenience',
    retail: 'Retail',
    service: 'Service',
    education: 'Education',
    entertainment: 'Entertainment',
    other: 'Other'
  };

  const hasRatings = store.reviewCount > 0;
  const hasWageData = store.averageWage.count > 0;

  return (
    <Card
      hover
      padding="md"
      className="cursor-pointer h-full flex flex-col"
      onClick={handleClick}
    >
      {/* Header */}
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {store.name}
          </h3>
          <span className="ml-2 px-2 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-700 whitespace-nowrap">
            {categoryLabels[store.category]}
          </span>
        </div>

        {/* Address */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {store.address.formatted}
        </p>

        {/* Distance (if available) */}
        {store.distance !== undefined && (
          <p className="text-xs text-gray-500 mb-3">
            {store.distance < 1000
              ? `${Math.round(store.distance)}m away`
              : `${(store.distance / 1000).toFixed(1)}km away`}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
        {/* Average Rating */}
        {hasRatings ? (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Average Rating</span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span className="text-sm font-semibold text-gray-900">
                {store.averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-gray-500">
                ({store.reviewCount} {store.reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">No reviews yet</span>
          </div>
        )}

        {/* Average Wage */}
        {hasWageData ? (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Average Wage</span>
            <div className="text-sm font-semibold text-gray-900">
              {formatWage(store.averageWage.min, store.currency)} -{' '}
              {formatWage(store.averageWage.max, store.currency)}
              <span className="text-xs text-gray-500 ml-1">
                (avg: {formatWage(store.averageWage.average, store.currency)})
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">No wage data</span>
          </div>
        )}
      </div>

      {/* Google Places Badge */}
      {store.isFromGooglePlaces && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <svg
              className="w-3 h-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" />
            </svg>
            Google Places
          </span>
        </div>
      )}
    </Card>
  );
};
