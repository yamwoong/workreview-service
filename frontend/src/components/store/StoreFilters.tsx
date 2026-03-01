import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import type { StoreFilters, StoreCategory } from '@/types/store.types';
import { STORE_CATEGORIES, SUPPORTED_COUNTRIES } from '@/types/store.types';

interface StoreFiltersProps {
  filters: StoreFilters;
  onFiltersChange: (filters: StoreFilters) => void;
}

export const StoreFiltersComponent = ({
  filters,
  onFiltersChange
}: StoreFiltersProps): JSX.Element => {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, country: e.target.value || undefined });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, city: e.target.value || undefined });
  };

  const handleCategoryChange = (category: StoreCategory | undefined) => {
    onFiltersChange({ ...filters, category });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, search: searchInput || undefined });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    onFiltersChange({});
  };

  const hasActiveFilters = filters.country || filters.city || filters.category || filters.search;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Main Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative mb-5">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={t('storeFilters.searchPlaceholder')}
          className="w-full pl-12 pr-28 py-4 bg-gray-50 border border-gray-200 rounded-xl
                   focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                   transition-all duration-200 placeholder:text-gray-400 text-[15px]"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-white text-[14px] font-medium rounded-lg hover:bg-[#b897c7] transition-all duration-200"
        >
          {t('storeFilters.searchButton')}
        </button>
      </form>

      {/* Location Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-[14px] text-gray-700 font-medium mb-2">
            {t('storeFilters.country')}
          </label>
          <select
            value={filters.country || ''}
            onChange={handleCountryChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                     transition-all duration-200 text-[15px] text-gray-700 cursor-pointer"
          >
            <option value="">{t('storeFilters.allCountries')}</option>
            {SUPPORTED_COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[14px] text-gray-700 font-medium mb-2">
            {t('storeFilters.city')}
          </label>
          <input
            type="text"
            placeholder={t('storeFilters.cityPlaceholder')}
            value={filters.city || ''}
            onChange={handleCityChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                     transition-all duration-200 placeholder:text-gray-400 text-[15px]"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div>
        <label className="block text-[14px] text-gray-700 font-medium mb-3">
          {t('storeFilters.category')}
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleCategoryChange(undefined)}
            className={`px-4 py-2 rounded-lg text-[14px] font-medium transition-all duration-200 ${
              !filters.category
                ? 'bg-primary text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('storeFilters.all')}
          </button>
          {STORE_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-4 py-2 rounded-lg text-[14px] font-medium transition-all duration-200 ${
                filters.category === cat.value
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t(`storeCard.categories.${cat.value}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-[14px] text-gray-500 hover:text-gray-800 underline transition-colors"
          >
            {t('storeFilters.clearAllFilters')}
          </button>
        </div>
      )}
    </div>
  );
};
