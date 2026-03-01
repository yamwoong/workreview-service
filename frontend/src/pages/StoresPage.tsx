import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Edit3, Search } from 'lucide-react';
import { useStores } from '@/hooks/useStores';
import { StoreCard } from '@/components/store/StoreCard';
import { StoreFiltersComponent } from '@/components/store/StoreFilters';
import { Spinner } from '@/components/ui/Spinner';
import { Pagination } from '@/components/ui/Pagination';
import type { StoreFilters } from '@/types/store.types';

export const StoresPage = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<StoreFilters>({});
  const [sort, setSort] = useState<'latest' | 'rating' | 'reviewCount'>('latest');
  const limit = 20;

  const { data, isLoading, error } = useStores({ ...filters, page, limit, sort });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const handleFiltersChange = (newFilters: StoreFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const sortOptions = [
    { key: 'latest' as const, label: t('stores.latest') },
    { key: 'rating' as const, label: t('stores.highestRating') },
    { key: 'reviewCount' as const, label: t('stores.mostReviewed') }
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-[15px] text-red-700">{t('stores.loadError')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-[#f5f1f7] via-[#faf8fb] to-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-[32px] sm:text-[40px] text-gray-900 mb-3">
            {t('stores.pageTitle1')} <span className="text-primary">{t('stores.pageTitle2')}</span>
          </h1>
          <p className="text-[16px] text-gray-600 font-normal max-w-2xl mx-auto">
            {t('stores.description')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Filters */}
        <div className="mb-8">
          <StoreFiltersComponent filters={filters} onFiltersChange={handleFiltersChange} />
        </div>

        {/* Sort + Write Review Row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[14px] text-gray-600">{t('stores.sortBy')}</span>
            <div className="flex gap-2">
              {sortOptions.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => { setSort(key); setPage(1); }}
                  className={`px-4 py-2 rounded-lg text-[14px] font-medium transition-all duration-200 ${
                    sort === key
                      ? 'bg-primary/10 text-primary'
                      : 'bg-transparent text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => navigate('/stores/search')}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-[#b897c7] transition-all duration-200 text-[14px] font-medium shadow-sm"
          >
            <Edit3 size={16} />
            {t('stores.writeReview')}
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        )}

        {/* Results */}
        {!isLoading && data && (
          <>
            {data.data.stores.length > 0 ? (
              <>
                <p className="text-[15px] text-gray-600 mb-4">
                  <span className="font-semibold text-gray-900">{data.data.pagination.total}</span> {t('stores.storesFound')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {data.data.stores.map((store) => (
                    <StoreCard key={store._id} store={store} />
                  ))}
                </div>
                <Pagination
                  currentPage={data.data.pagination.page}
                  totalPages={data.data.pagination.pages}
                  totalItems={data.data.pagination.total}
                  itemsPerPage={data.data.pagination.limit}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search size={28} className="text-gray-400" />
                </div>
                <h3 className="text-[20px] font-semibold text-gray-900 mb-2">{t('stores.noStoresFound')}</h3>
                <p className="text-[15px] text-gray-600 font-normal mb-6">
                  {filters.search
                    ? t('stores.noMatchingStores', { search: filters.search })
                    : t('stores.noFiltersMatch')}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => navigate('/stores/search')}
                    className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-xl hover:bg-[#b897c7] transition-all duration-200 text-[15px] font-medium shadow-sm"
                  >
                    {t('stores.registerNewWorkplace')}
                  </button>
                  <button
                    onClick={() => { setFilters({}); setPage(1); }}
                    className="w-full sm:w-auto px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 text-[15px] font-medium"
                  >
                    {t('stores.clearFilters')}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Mobile Write Review FAB */}
        <button
          onClick={() => navigate('/stores/search')}
          className="sm:hidden fixed bottom-6 right-6 flex items-center gap-2 px-6 py-4 bg-primary text-white rounded-full hover:bg-[#b897c7] transition-all duration-200 shadow-lg font-medium text-[15px]"
        >
          <Edit3 size={18} />
          {t('stores.writeReview')}
        </button>
      </div>
    </div>
  );
};
