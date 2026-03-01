import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { createReviewSchema, type CreateReviewFormInput } from '@/validators/review.validator';
import { WAGE_TYPE_LABELS } from '@/types/review.types';
import type { WageType } from '@/types/review.types';

interface ReviewFormProps {
  storeId?: string;
  googlePlaceId?: string;
  onSubmit: (data: CreateReviewFormInput) => void;
  isSubmitting?: boolean;
  submitError?: string | null;
}

const inputClass = (hasError: boolean) =>
  `w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-[15px] ${
    hasError ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-primary'
  }`;

export const ReviewForm = ({
  storeId,
  googlePlaceId,
  onSubmit,
  isSubmitting = false,
  submitError = null
}: ReviewFormProps): JSX.Element => {
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateReviewFormInput>({
    resolver: zodResolver(createReviewSchema) as any,
    defaultValues: {
      storeId: storeId || undefined,
      googlePlaceId: googlePlaceId || undefined,
      reviewMode: 'quick',
      rating: 3,
      wageType: undefined,
      content: '',
      position: '',
      isAnonymous: false
    }
  });

  const renderStarRating = (
    value: number,
    onChange: (value: number) => void,
    error?: string
  ): JSX.Element => {
    return (
      <div>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="text-[28px] transition-colors focus:outline-none hover:scale-110"
            >
              <span className={star <= value ? 'text-primary' : 'text-gray-200'}>★</span>
            </button>
          ))}
          <span className="ml-1 text-[15px] font-semibold text-gray-700">{value.toFixed(1)}</span>
        </div>
        {error && <p className="text-[13px] text-red-500 mt-1.5">{error}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Rating */}
      <div>
        <label className="block text-[14px] text-gray-700 font-medium mb-3">{t('reviewForm.overallRating')}</label>
        <Controller
          name="rating"
          control={control}
          render={({ field }) =>
            renderStarRating(field.value, field.onChange, errors.rating?.message)
          }
        />
      </div>

      {/* Position */}
      <div>
        <label className="block text-[14px] text-gray-700 font-medium mb-2">
          {t('reviewForm.position')} <span className="text-[13px] text-gray-400 font-normal">{t('reviewForm.optional')}</span>
        </label>
        <Controller
          name="position"
          control={control}
          render={({ field }) => (
            <input
              type="text"
              placeholder={t('reviewForm.positionPlaceholder')}
              className={inputClass(Boolean(errors.position))}
              {...field}
            />
          )}
        />
        {errors.position && (
          <p className="text-[13px] text-red-500 mt-1.5">{errors.position.message}</p>
        )}
      </div>

      {/* Wage Information */}
      <div>
        <label className="block text-[14px] text-gray-700 font-medium mb-3">{t('reviewForm.wageInformation')}</label>
        <Controller
          name="wageType"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(WAGE_TYPE_LABELS) as WageType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => field.onChange(type)}
                  className={`px-3 py-2.5 text-[14px] rounded-xl border transition-all duration-200 ${
                    field.value === type
                      ? 'border-primary bg-primary text-white font-medium shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:border-primary/50 hover:bg-primary/5'
                  }`}
                >
                  {WAGE_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          )}
        />
        {errors.wageType && (
          <p className="text-[13px] text-red-500 mt-1.5">{errors.wageType.message}</p>
        )}
      </div>

      {/* Review Content */}
      <div>
        <label className="block text-[14px] text-gray-700 font-medium mb-2">
          {t('reviewForm.review')} <span className="text-[13px] text-gray-400 font-normal">{t('reviewForm.optional')}</span>
        </label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <textarea
              rows={6}
              placeholder={t('reviewForm.reviewPlaceholder')}
              className={inputClass(Boolean(errors.content))}
              {...field}
            />
          )}
        />
        {errors.content && <p className="text-[13px] text-red-500 mt-1.5">{errors.content.message}</p>}
      </div>

      {/* Anonymous Toggle */}
      <div>
        <Controller
          name="isAnonymous"
          control={control}
          render={({ field }) => (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={field.value}
                onChange={field.onChange}
              />
              <span className="text-[14px] text-gray-700">{t('reviewForm.postAnonymous')}</span>
            </label>
          )}
        />
      </div>

      {/* Submit Error */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-[13px] text-red-600">{submitError}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3.5 bg-primary text-white rounded-xl hover:bg-[#b897c7] transition-all duration-200 font-medium text-[15px] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? t('reviewForm.submitting') : t('reviewForm.submitReview')}
      </button>
    </form>
  );
};
