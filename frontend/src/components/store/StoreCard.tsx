import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Star } from 'lucide-react';
import type { IStore } from '@/types/store.types';
import { formatWage } from '@/types/store.types';

interface StoreCardProps {
  store: IStore;
}

export const StoreCard = ({ store }: StoreCardProps): JSX.Element => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = () => {
    navigate(`/stores/${store._id}`);
  };

  const hasRatings = store.reviewCount > 0;
  const hasWageData = store.averageWage.count > 0;

  return (
    <div
      onClick={handleClick}
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer group"
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-[18px] font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors truncate">
            {store.name}
          </h3>
          <div className="flex items-center gap-1.5 text-gray-500">
            <MapPin size={14} className="text-gray-400 shrink-0" />
            <span className="text-[13px] truncate">{store.address.formatted}</span>
          </div>
        </div>
        <span className="ml-3 px-3 py-1 bg-primary/10 text-primary text-[12px] font-medium rounded-lg shrink-0">
          {t(`storeCard.categories.${store.category}`)}
        </span>
      </div>

      {/* Distance */}
      {store.distance !== undefined && (
        <p className="text-[12px] text-gray-500 mb-3">
          {store.distance < 1000
            ? `${Math.round(store.distance)}${t('storeCard.metersAway')}`
            : `${(store.distance / 1000).toFixed(1)}${t('storeCard.kilometersAway')}`}
        </p>
      )}

      {/* Rating */}
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
        {hasRatings ? (
          <>
            <div className="flex items-center gap-1">
              <Star size={16} className="text-primary fill-primary" />
              <span className="text-[16px] font-semibold text-gray-900">
                {store.averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-[14px] text-gray-500">
              ({store.reviewCount} {store.reviewCount === 1 ? t('storeCard.review_one') : t('storeCard.review_other')})
            </span>
          </>
        ) : (
          <span className="text-[14px] text-gray-400">{t('storeCard.noReviewsYet')}</span>
        )}
      </div>

      {/* Wage Info */}
      <div className="flex items-center justify-between">
        {hasWageData ? (
          <span className="text-[13px] text-gray-600">
            {formatWage(store.averageWage.min, store.currency)} – {formatWage(store.averageWage.max, store.currency)}
          </span>
        ) : (
          <span className="text-[13px] text-gray-400">{t('storeCard.noWageData')}</span>
        )}
        <span className="text-[14px] text-primary font-medium group-hover:text-[#b897c7] transition-colors">
          {t('storeCard.viewDetails')} →
        </span>
      </div>

      {/* Google Places Badge */}
      {store.isFromGooglePlaces && (
        <div className="mt-3 pt-2 border-t border-gray-100">
          <span className="text-[12px] text-gray-400">{t('storeCard.googlePlaces')}</span>
        </div>
      )}
    </div>
  );
};
