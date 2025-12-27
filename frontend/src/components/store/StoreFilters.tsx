import { useState } from 'react';
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
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFiltersChange({
      ...filters,
      country: value || undefined
    });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      city: e.target.value || undefined
    });
  };

  const handleCategoryChange = (category: StoreCategory | undefined) => {
    onFiltersChange({
      ...filters,
      category
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({
      ...filters,
      search: searchInput || undefined
    });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.country || filters.city || filters.category || filters.search;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Search by name or address..."
          value={searchInput}
          onChange={handleSearchChange}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Country Dropdown */}
        <div>
          <label
            htmlFor="country"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            Country
          </label>
          <select
            id="country"
            value={filters.country || ''}
            onChange={handleCountryChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Countries</option>
            {SUPPORTED_COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* City Input */}
        <div>
          <label
            htmlFor="city"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            City
          </label>
          <input
            type="text"
            id="city"
            placeholder="e.g. London"
            value={filters.city || ''}
            onChange={handleCityChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Category Buttons */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleCategoryChange(undefined)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              !filters.category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {STORE_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filters.category === cat.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="pt-2 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};
