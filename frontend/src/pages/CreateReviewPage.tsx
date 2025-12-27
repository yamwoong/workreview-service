import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/hooks/useStores';
import { useCreateReview } from '@/hooks/useReviews';
import { ReviewForm } from '@/components/review/ReviewForm';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';
import type { CreateReviewFormInput } from '@/validators/review.validator';

const resolveErrorMessage = (error: unknown): string => {
  if (!error) {
    return 'An unknown error occurred.';
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null) {
    const typed = error as { message?: string; error?: { message?: string } };
    return typed.message ?? typed.error?.message ?? 'An error occurred.';
  }

  return 'An error occurred.';
};

export const CreateReviewPage = (): JSX.Element => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isInitialized } = useAuth();
  const { data: store, isLoading: isLoadingStore, error: storeError } = useStore(storeId || '');
  const createReviewMutation = useCreateReview();
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isInitialized, isAuthenticated, navigate]);

  // Validate storeId
  if (!storeId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Invalid store ID</p>
      </div>
    );
  }

  // Loading state
  if (!isInitialized || isLoadingStore) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Store not found
  if (storeError || !store) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
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

  const handleSubmit = (data: CreateReviewFormInput): void => {
    setSubmitError(null);

    createReviewMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Review submitted successfully!');
        navigate(`/stores/${storeId}`);
      },
      onError: (error) => {
        const errorMessage = resolveErrorMessage(error);
        setSubmitError(errorMessage);
        toast.error(errorMessage);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/stores/${storeId}`)}
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
          Back to store
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Write a Review</h1>
          <p className="text-gray-600">
            Share your experience working at <span className="font-medium">{store.name}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">{store.address.formatted}</p>
        </div>

        {/* Store Info Card */}
        <Card padding="md" className="mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 mb-1">Review Guidelines</p>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Be honest and constructive in your feedback</li>
                <li>• Focus on your personal experience</li>
                <li>• Avoid sharing sensitive personal information</li>
                <li>• Respect others and maintain professionalism</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Review Form */}
        <Card padding="lg">
          <ReviewForm
            storeId={storeId}
            onSubmit={handleSubmit}
            isSubmitting={createReviewMutation.isPending}
            submitError={submitError}
          />
        </Card>
      </div>
    </div>
  );
};
