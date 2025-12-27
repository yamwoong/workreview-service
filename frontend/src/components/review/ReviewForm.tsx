import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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

const INPUT_BASE_CLASS =
  'w-full px-3 py-2.5 text-sm text-gray-900 bg-white border rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-1 transition-colors duration-150';
const INPUT_ERROR_CLASS = 'border-red-500 focus:border-red-500 focus:ring-red-500';
const INPUT_NORMAL_CLASS = 'border-gray-300 focus:border-[#4DCDB3] focus:ring-[#4DCDB3]';

const getInputClassName = (hasError: boolean) =>
  `${INPUT_BASE_CLASS} ${hasError ? INPUT_ERROR_CLASS : INPUT_NORMAL_CLASS}`;

export const ReviewForm = ({
  storeId,
  googlePlaceId,
  onSubmit,
  isSubmitting = false,
  submitError = null
}: ReviewFormProps): JSX.Element => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<CreateReviewFormInput>({
    resolver: zodResolver(createReviewSchema),
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
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="text-2xl transition-colors focus:outline-none"
            >
              <span className={star <= value ? 'text-yellow-400' : 'text-gray-300'}>★</span>
            </button>
          ))}
          <span className="ml-2 text-sm font-medium text-gray-700">{value.toFixed(1)}</span>
        </div>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-3">Overall Rating</label>
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
        <label htmlFor="position" className="block text-sm font-medium text-gray-900 mb-2">
          Position <span className="text-xs text-gray-500">(Optional)</span>
        </label>
        <Controller
          name="position"
          control={control}
          render={({ field }) => (
            <input
              type="text"
              id="position"
              placeholder="e.g., Barista, Sales Associate, Server"
              className={getInputClassName(Boolean(errors.position))}
              {...field}
            />
          )}
        />
        {errors.position && (
          <p className="text-xs text-red-600 mt-1">{errors.position.message}</p>
        )}
      </div>

      {/* Wage Information */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Wage Information</label>
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
                  className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                    field.value === type
                      ? 'border-[#4DCDB3] bg-[#4DCDB3] text-white font-medium'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {WAGE_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          )}
        />
        {errors.wageType && (
          <p className="text-xs text-red-600 mt-1">{errors.wageType.message}</p>
        )}
      </div>

      {/* Review Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-900 mb-2">
          Review <span className="text-xs text-gray-500">(Optional)</span>
        </label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <textarea
              id="content"
              rows={6}
              placeholder="Share your experience working at this place..."
              className={getInputClassName(Boolean(errors.content))}
              {...field}
            />
          )}
        />
        {errors.content && <p className="text-xs text-red-600 mt-1">{errors.content.message}</p>}
      </div>

      {/* Anonymous Toggle */}
      <div>
        <Controller
          name="isAnonymous"
          control={control}
          render={({ field }) => (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-[#4DCDB3] border-gray-300 rounded focus:ring-[#4DCDB3]"
                checked={field.value}
                onChange={field.onChange}
              />
              <span className="text-sm text-gray-700">Post as anonymous</span>
            </label>
          )}
        />
      </div>

      {/* Submit Error */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-xs text-red-800">{submitError}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-3 bg-[#4DCDB3] hover:bg-[#3CB89F] text-white font-medium text-sm rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};
