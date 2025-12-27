import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStores } from '@/hooks/useStores';
import { StoreCard } from '@/components/store/StoreCard';
import { StoreFiltersComponent } from '@/components/store/StoreFilters';
import { Spinner } from '@/components/ui/Spinner';
import { Pagination } from '@/components/ui/Pagination';
import type { StoreFilters } from '@/types/store.types';

export const StoresPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<StoreFilters>({});
  const [sort, setSort] = useState<'latest' | 'rating' | 'reviewCount'>('latest');
  const limit = 20;

  const { data, isLoading, error } = useStores({
    ...filters,
    page,
    limit,
    sort
  });

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const handleFiltersChange = (newFilters: StoreFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              Failed to load stores. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Find Workplaces
            </h1>
            <p className="text-gray-600">
              Browse and search part-time job locations with reviews and wage information
            </p>
          </div>
          <button
            onClick={() => navigate('/stores/search')}
            className="px-6 py-3 bg-[#4DCDB3] hover:bg-[#3CB89F] text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>Write Review</span>
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <StoreFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>

        {/* Sort Options */}
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm text-gray-600 font-medium">Sort by:</span>
          <div className="flex gap-2">
            {(['latest', 'rating', 'reviewCount'] as const).map((sortOption) => (
              <button
                key={sortOption}
                onClick={() => {
                  setSort(sortOption);
                  setPage(1); // Reset to first page when sort changes
                }}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  sort === sortOption
                    ? 'bg-[#4DCDB3] text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {sortOption === 'latest'
                  ? 'Latest'
                  : sortOption === 'rating'
                    ? 'Highest Rating'
                    : 'Most Reviewed'}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {/* Results */}
        {!isLoading && data && (
          <>
            {/* Store Grid */}
            {data.data.stores.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.data.stores.map((store) => (
                    <StoreCard key={store._id} store={store} />
                  ))}
                </div>

                {/* Pagination */}
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
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  No stores found
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {filters.search
                    ? `We couldn't find any stores matching "${filters.search}"`
                    : 'No stores match your current filters'}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Can't find the workplace you're looking for?
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => navigate('/stores/search')}
                    className="w-full sm:w-auto px-6 py-3 bg-[#4DCDB3] hover:bg-[#3CB89F] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span>Register New Workplace</span>
                  </button>

                  <button
                    onClick={() => {
                      setFilters({});
                      setPage(1);
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium border border-gray-300 rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>

                <p className="mt-4 text-xs text-gray-500">
                  💡 Tip: Use the search above to find workplaces, or register a new one to share your experience
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
