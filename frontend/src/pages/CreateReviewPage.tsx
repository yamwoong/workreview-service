import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Info } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/hooks/useStores';
import { useCreateReview } from '@/hooks/useReviews';
import { ReviewForm } from '@/components/review/ReviewForm';
import { Spinner } from '@/components/ui/Spinner';
import type { CreateReviewFormInput } from '@/validators/review.validator';

const resolveErrorMessage = (error: unknown, t: (key: string) => string): string => {
  if (!error) return t('createReview.unknownError');
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null) {
    const typed = error as { message?: string; error?: { message?: string } };
    return typed.message ?? typed.error?.message ?? t('createReview.requestError');
  }
  return t('createReview.requestError');
};

export const CreateReviewPage = (): JSX.Element => {
  const { t } = useTranslation();
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isInitialized } = useAuth();
  const { data: store, isLoading: isLoadingStore, error: storeError } = useStore(storeId || '');
  const createReviewMutation = useCreateReview();
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) navigate('/login', { replace: true });
  }, [isInitialized, isAuthenticated, navigate]);

  if (!storeId) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">{t('createReview.invalidStoreId')}</p>
    </div>
  );

  if (!isInitialized || isLoadingStore) return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );

  if (storeError || !store) return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-[15px] text-red-700 mb-3">{t('createReview.loadError')}</p>
          <button onClick={() => navigate('/stores')} className="text-[14px] text-red-600 underline">
            {t('createReview.goBackToStores')}
          </button>
        </div>
      </div>
    </div>
  );

  const handleSubmit = (data: CreateReviewFormInput): void => {
    setSubmitError(null);
    createReviewMutation.mutate({
      ...data,
      reviewMode: data.reviewMode ?? 'quick',
      content: data.content ?? '',
      position: data.position ?? ''
    }, {
      onSuccess: () => {
        toast.success(t('createReview.reviewSubmitted'));
        navigate(`/stores/${storeId}`);
      },
      onError: (error) => {
        const errorMessage = resolveErrorMessage(error, t);
        setSubmitError(errorMessage);
        toast.error(errorMessage);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/stores/${storeId}`)}
          className="inline-flex items-center gap-2 text-[14px] text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ChevronLeft size={16} />
          {t('createReview.backToStore')}
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm mb-4">
          <h1 className="text-[28px] font-semibold text-gray-900 mb-2">{t('createReview.writeReview')}</h1>
          <p className="text-[15px] text-gray-600">
            {t('createReview.shareExperience')} <span className="font-medium text-gray-900">{store.name}</span>
          </p>
          {store.address.formatted && (
            <p className="text-[14px] text-gray-400 mt-1">{store.address.formatted}</p>
          )}
        </div>

        {/* Guidelines */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-4">
          <div className="flex items-start gap-3">
            <Info size={18} className="text-primary mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-[14px] font-medium text-gray-900 mb-2">{t('createReview.reviewGuidelines')}</p>
              <ul className="text-[13px] text-gray-600 space-y-1">
                <li>{t('createReview.guidelineHonest')}</li>
                <li>{t('createReview.guidelineFocus')}</li>
                <li>{t('createReview.guidelineNoPersonalInfo')}</li>
                <li>{t('createReview.guidelineRespect')}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
          <ReviewForm
            storeId={storeId}
            onSubmit={handleSubmit}
            isSubmitting={createReviewMutation.isPending}
            submitError={submitError}
          />
        </div>
      </div>
    </div>
  );
};
