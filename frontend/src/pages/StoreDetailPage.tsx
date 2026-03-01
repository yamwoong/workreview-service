import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, MapPin, Star } from 'lucide-react';
import { useStore } from '@/hooks/useStores';
import { useReviews, useDeleteReview, reviewKeys } from '@/hooks/useReviews';
import { useAuth } from '@/hooks/useAuth';
import { likeReview, dislikeReview } from '@/api/review.api';
import { Spinner } from '@/components/ui/Spinner';
import { Pagination } from '@/components/ui/Pagination';
import { ReviewCard } from '@/components/review/ReviewCard';
import { EditReviewModal } from '@/components/review/EditReviewModal';
import { QuestionList } from '@/components/question/QuestionList';
import type { GetReviewsParams, IReview } from '@/types/review.types';
import { useAuthStore } from '@/stores/authStore';

export const StoreDetailPage = (): JSX.Element => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const { user } = useAuthStore();
  const { data: store, isLoading, error } = useStore(id || '');

  const [activeTab, setActiveTab] = useState<'reviews' | 'qna'>('reviews');
  const [editingReview, setEditingReview] = useState<IReview | null>(null);
  const [reviewParams, setReviewParams] = useState<GetReviewsParams>({
    page: 1, limit: 10, sort: 'latest'
  });

  const { data: reviewsData, isLoading: isLoadingReviews } = useReviews(id || '', reviewParams);
  const deleteReviewMutation = useDeleteReview();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [reviewParams.page]);

  const handleLike = async (review: IReview) => {
    if (!isAuthenticated) { toast.error(t('storeDetail.loginToLike')); return; }
    try {
      await likeReview(review._id);
      toast.success(t('storeDetail.liked'));
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
    } catch { toast.error(t('storeDetail.failedToLike')); }
  };

  const handleDislike = async (review: IReview) => {
    if (!isAuthenticated) { toast.error(t('storeDetail.loginToDislike')); return; }
    try {
      await dislikeReview(review._id);
      toast.success(t('storeDetail.disliked'));
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
    } catch { toast.error(t('storeDetail.failedToDislike')); }
  };

  const handleEdit = (review: IReview) => setEditingReview(review);

  const handleDelete = async (review: IReview) => {
    if (!window.confirm(t('storeDetail.confirmDelete'))) return;
    try {
      await deleteReviewMutation.mutateAsync(review._id);
      toast.success(t('storeDetail.deleteSuccess'));
    } catch { toast.error(t('storeDetail.deleteError')); }
  };

  if (!id) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">{t('storeDetail.invalidStoreId')}</p>
    </div>
  );

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );

  if (error || !store) return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-[15px] text-red-700 mb-3">{t('storeDetail.loadError')}</p>
          <button onClick={() => navigate('/stores')} className="text-[14px] text-red-600 underline">
            {t('storeDetail.goBackToStores')}
          </button>
        </div>
      </div>
    </div>
  );

  const hasWageData = (store.wageStats?.total ?? 0) > 0;
  const reviews = reviewsData?.data.reviews ?? [];
  const pagination = reviewsData?.data.pagination;

  const sortOptions: Array<{ key: GetReviewsParams['sort']; label: string }> = [
    { key: 'latest', label: t('storeDetail.sortLatest') },
    { key: 'rating', label: t('storeDetail.sortRating') },
    { key: 'helpful', label: t('storeDetail.sortHelpful') }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/stores')}
          className="inline-flex items-center gap-2 text-[14px] text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ChevronLeft size={16} />
          {t('storeDetail.backToStores')}
        </button>

        {/* Store Header Card */}
        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm mb-4">
          <h1 className="text-[28px] sm:text-[32px] font-semibold text-gray-900 mb-3">{store.name}</h1>
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[13px] font-medium rounded-lg">
              {t(`storeDetail.categories.${store.category}`)}
            </span>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5 text-gray-600">
              <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
              <div className="text-[15px]">
                <div>{store.address.formatted}</div>
                {store.address.city && (
                  <div className="text-gray-500 text-[14px]">{store.address.city}, {store.address.countryName}</div>
                )}
              </div>
            </div>
            {store.isFromGooglePlaces && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-[14px] text-gray-600">{t('storeDetail.verifiedByGoogle')}</span>
              </div>
            )}
          </div>

          {/* Write Review Button */}
          {isAuthenticated && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <Link
                to={`/stores/${store._id}/review/new`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-[#b897c7] transition-all duration-200 text-[14px] font-medium shadow-sm"
              >
                {t('storeDetail.writeReview')}
              </Link>
            </div>
          )}
        </div>

        {/* Ratings Card */}
        {store.reviewCount > 0 && (
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm mb-4">
            <h2 className="text-[18px] font-semibold text-gray-900 mb-5">
              {t('storeDetail.ratingsTitle')}{' '}
              <span className="text-gray-500 font-normal">({store.reviewCount} {t('storeDetail.reviews')})</span>
            </h2>
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6">
              <div className="flex items-center gap-2.5">
                <span className="text-[40px] font-semibold text-gray-900">{store.averageRating.toFixed(1)}</span>
                <Star size={28} className="text-primary fill-primary" />
              </div>
              <div className="mt-1">
                <div className="text-[15px] text-gray-900 font-medium">{t('storeDetail.averageRating')}</div>
                <div className="text-[14px] text-gray-600">{t('storeDetail.basedOn')} {store.reviewCount} {t('storeDetail.reviews')}</div>
              </div>
            </div>
          </div>
        )}

        {/* Wage Information Card */}
        {hasWageData && (
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm mb-4">
            <h2 className="text-[18px] font-semibold text-gray-900 mb-6">{t('storeDetail.wageInfo')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="bg-red-50 rounded-xl p-5">
                <div className="text-[13px] text-red-700 font-medium mb-2">{t('storeDetail.belowMinimum')}</div>
                <div className="text-[36px] font-semibold text-red-700 mb-0.5">{store.wageStats?.belowMinimum ?? 0}</div>
                <div className="text-[14px] text-red-600">
                  {(store.wageStats?.total ?? 0) > 0 ? Math.round(((store.wageStats?.belowMinimum ?? 0) / (store.wageStats?.total ?? 1)) * 100) : 0}%
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-5">
                <div className="text-[13px] text-blue-700 font-medium mb-2">{t('storeDetail.atMinimum')}</div>
                <div className="text-[36px] font-semibold text-blue-700 mb-0.5">{store.wageStats?.minimumWage ?? 0}</div>
                <div className="text-[14px] text-blue-600">
                  {(store.wageStats?.total ?? 0) > 0 ? Math.round(((store.wageStats?.minimumWage ?? 0) / (store.wageStats?.total ?? 1)) * 100) : 0}%
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-5">
                <div className="text-[13px] text-green-700 font-medium mb-2">{t('storeDetail.aboveMinimum')}</div>
                <div className="text-[36px] font-semibold text-green-700 mb-0.5">{store.wageStats?.aboveMinimum ?? 0}</div>
                <div className="text-[14px] text-green-600">
                  {(store.wageStats?.total ?? 0) > 0 ? Math.round(((store.wageStats?.aboveMinimum ?? 0) / (store.wageStats?.total ?? 1)) * 100) : 0}%
                </div>
              </div>
            </div>
            <p className="text-[13px] text-gray-500 text-center">
              {t('storeDetail.basedOn')} {store.wageStats?.total ?? 0} {t('storeDetail.wageReports')}
            </p>
          </div>
        )}

        {/* Reviews & Q&A Tabs */}
        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm">
          {/* Tabs */}
          <div className="flex items-center gap-8 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-[15px] font-medium transition-colors border-b-2 -mb-px ${
                activeTab === 'reviews'
                  ? 'text-primary border-primary'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              {t('storeDetail.reviewsTab')} ({store.reviewCount})
            </button>
            <button
              onClick={() => setActiveTab('qna')}
              className={`pb-3 text-[15px] font-medium transition-colors border-b-2 -mb-px ${
                activeTab === 'qna'
                  ? 'text-primary border-primary'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              {t('storeDetail.qnaTab')} ({store.questionCount ?? 0})
            </button>
          </div>

          {activeTab === 'reviews' && (
            <>
              {/* Sort Options */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[14px] text-gray-600">{t('storeDetail.sortBy')}</span>
                <div className="flex gap-2">
                  {sortOptions.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setReviewParams((prev) => ({ ...prev, sort: key, page: 1 }))}
                      className={`px-4 py-1.5 rounded-lg text-[14px] font-medium transition-all duration-200 ${
                        reviewParams.sort === key
                          ? 'bg-primary/10 text-primary'
                          : 'bg-transparent text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {isLoadingReviews ? (
                <div className="flex justify-center py-8"><Spinner size="md" /></div>
              ) : reviews.length > 0 ? (
                <>
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <ReviewCard
                        key={review._id}
                        review={review}
                        currentUserId={user?.id}
                        onLike={handleLike}
                        onDislike={handleDislike}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                  {pagination && pagination.pages > 1 && (
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.pages}
                      totalItems={pagination.total}
                      itemsPerPage={pagination.limit}
                      onPageChange={(p) => setReviewParams((prev) => ({ ...prev, page: p }))}
                    />
                  )}
                </>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-[15px] text-gray-500 mb-4">{t('storeDetail.noReviews')}</p>
                  {isAuthenticated ? (
                    <Link
                      to={`/stores/${store._id}/review/new`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-[#b897c7] transition-all duration-200 text-[14px] font-medium"
                    >
                      {t('storeDetail.beFirstToReview')}
                    </Link>
                  ) : (
                    <Link to="/login" className="text-[14px] text-primary hover:text-[#b897c7] transition-colors">
                      {t('storeDetail.loginToReview')}
                    </Link>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === 'qna' && (
            <QuestionList storeId={id ?? ''} />
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingReview && (
        <EditReviewModal
          review={editingReview}
          onClose={() => setEditingReview(null)}
        />
      )}
    </div>
  );
};
