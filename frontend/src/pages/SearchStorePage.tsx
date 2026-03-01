import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { GoogleMapSearch } from '@/components/store/GoogleMapSearch';
import { Spinner } from '@/components/ui/Spinner';
import { createStoreFromPlace, checkStoreByPlaceId } from '@/api/store.api';

export const SearchStorePage = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [searchResults, setSearchResults] = useState<google.maps.places.PlaceResult[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isCheckingStore, setIsCheckingStore] = useState(false);
  const [existingStoreId, setExistingStoreId] = useState<string | null>(null);

  const handlePlaceSelect = async (place: google.maps.places.PlaceResult) => {
    console.log('Selected place:', place);
    setSelectedPlace(place);
    setExistingStoreId(null);

    // Check if store already exists
    if (place.place_id) {
      setIsCheckingStore(true);
      try {
        const result = await checkStoreByPlaceId(place.place_id);
        if (result.exists && result.storeId) {
          setExistingStoreId(result.storeId);
        }
      } catch (error) {
        console.error('Failed to check store:', error);
        // Continue even if check fails
      } finally {
        setIsCheckingStore(false);
      }
    }
  };

  const handleSearchResults = (places: google.maps.places.PlaceResult[]) => {
    console.log('Search results:', places);
    setSearchResults(places);
    // Clear selected place when new search is performed
    if (places.length > 0) {
      setSelectedPlace(null);
      setExistingStoreId(null);
    }
  };

  const handleViewStore = () => {
    if (existingStoreId) {
      navigate(`/stores/${existingStoreId}`);
    }
  };

  const handleWriteReview = async () => {
    if (!selectedPlace || !selectedPlace.place_id) {
      toast.error(t('searchStore.selectWorkplaceFirst'));
      return;
    }

    setIsCreating(true);

    try {
      // Google Place ID로 가게 생성 또는 조회
      const store = await createStoreFromPlace({ placeId: selectedPlace.place_id });

      toast.success(t('searchStore.workplaceFound'));

      // 리뷰 작성 페이지로 이동
      navigate(`/stores/${store._id}/review/new`);
    } catch (error) {
      console.error('Failed to create store:', error);
      toast.error(t('searchStore.failedToCreateStore'));
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Back Button Overlay */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => navigate('/stores')}
          className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium border border-gray-300 rounded-lg shadow-lg transition-colors flex items-center gap-2"
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
          <span>{t('searchStore.back')}</span>
        </button>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <GoogleMapSearch
          onPlaceSelect={handlePlaceSelect}
          onSearchResults={handleSearchResults}
          selectedPlace={selectedPlace}
        />
      </div>

      {/* Search Results List (sidebar) */}
      {searchResults.length > 1 && !selectedPlace && (
        <div className="absolute left-4 top-20 bottom-4 w-80 bg-white rounded-xl shadow-2xl overflow-hidden z-20 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary to-[#b897c7]">
            <h3 className="text-lg font-bold text-white">
              {t('searchStore.searchResults', { count: searchResults.length })}
            </h3>
            <p className="text-xs text-white/80 mt-1">
              {t('searchStore.clickToView')}
            </p>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto">
            {searchResults.map((place, index) => (
              <button
                key={place.place_id || index}
                onClick={() => handlePlaceSelect(place)}
                className="w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-start gap-3">
                  {/* Number Badge */}
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>

                  {/* Place Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                      {place.name}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {place.formatted_address}
                    </p>

                    {/* Rating (if available from search) */}
                    {place.rating && (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500 text-sm">★</span>
                        <span className="text-xs font-medium text-gray-700">
                          {place.rating.toFixed(1)}
                        </span>
                        {place.user_ratings_total && (
                          <span className="text-xs text-gray-500">
                            ({place.user_ratings_total})
                          </span>
                        )}
                      </div>
                    )}

                    {/* Types */}
                    {place.types && place.types.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {place.types.slice(0, 2).map((type) => (
                          <span
                            key={type}
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {type.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer Hint */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              {t('searchStore.mapHint')}
            </p>
          </div>
        </div>
      )}

      {/* Selected Place Panel (slides up from bottom) */}
      {selectedPlace && selectedPlace.place_id && (
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-white border-t-2 border-gray-200 shadow-2xl rounded-t-2xl max-h-[70vh] overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            {/* Drag Handle */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            <div className="flex flex-col gap-4">
              {/* Header with Photo */}
              <div className="flex items-start gap-4">
                {/* Photo or Icon */}
                <div className="flex-shrink-0">
                  {selectedPlace.photos && selectedPlace.photos.length > 0 ? (
                    <img
                      src={selectedPlace.photos[0].getUrl({ maxWidth: 100, maxHeight: 100 })}
                      alt={selectedPlace.name}
                      className="w-20 h-20 object-cover rounded-xl shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-[#b897c7] rounded-xl flex items-center justify-center shadow-lg">
                      <svg
                        className="w-10 h-10 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Name and Rating */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {selectedPlace.name}
                  </h3>

                  {/* Rating */}
                  {selectedPlace.rating && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        <span className="text-yellow-500 text-lg">★</span>
                        <span className="ml-1 font-semibold text-gray-900">
                          {selectedPlace.rating.toFixed(1)}
                        </span>
                      </div>
                      {selectedPlace.user_ratings_total && (
                        <span className="text-sm text-gray-500">
                          ({selectedPlace.user_ratings_total.toLocaleString()} {t('searchStore.reviews')})
                        </span>
                      )}
                    </div>
                  )}

                  {/* Price Level */}
                  {selectedPlace.price_level !== undefined && (
                    <div className="mb-2">
                      <span className="text-gray-700 font-medium">
                        {'£'.repeat(selectedPlace.price_level)}
                        <span className="text-gray-300">{'£'.repeat(4 - selectedPlace.price_level)}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
                <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm text-gray-600 flex-1">
                  {selectedPlace.formatted_address}
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 pb-3 border-b border-gray-200">
                {/* Phone */}
                {selectedPlace.formatted_phone_number && (
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a
                      href={`tel:${selectedPlace.formatted_phone_number}`}
                      className="text-sm text-primary hover:text-[#b897c7] font-medium"
                    >
                      {selectedPlace.formatted_phone_number}
                    </a>
                  </div>
                )}

                {/* Website */}
                {selectedPlace.website && (
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <a
                      href={selectedPlace.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-[#b897c7] font-medium truncate"
                    >
                      {t('searchStore.visitWebsite')}
                    </a>
                  </div>
                )}

                {/* Google Maps Link */}
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <a
                    href={selectedPlace.url || `https://www.google.com/maps/place/?q=place_id:${selectedPlace.place_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:text-[#b897c7] font-medium flex items-center gap-1"
                  >
                    <span>{t('searchStore.viewOnGoogleMaps')}</span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Opening Hours */}
              {selectedPlace.opening_hours && (
                <div className="pb-3 border-b border-gray-200">
                  <div className="flex items-start gap-3 mb-2">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">{t('searchStore.hours')}</span>
                        {selectedPlace.opening_hours.open_now !== undefined && (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            selectedPlace.opening_hours.open_now
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {selectedPlace.opening_hours.open_now ? t('searchStore.openNow') : t('searchStore.closed')}
                          </span>
                        )}
                      </div>
                      {selectedPlace.opening_hours.weekday_text && (
                        <div className="space-y-1">
                          {selectedPlace.opening_hours.weekday_text.map((day, index) => (
                            <p key={index} className="text-xs text-gray-600">
                              {day}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Types */}
              {selectedPlace.types && selectedPlace.types.length > 0 && (
                <div className="flex flex-wrap gap-2 pb-3 border-b border-gray-200">
                  {selectedPlace.types.slice(0, 5).map((type) => (
                    <span
                      key={type}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                    >
                      {type.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              )}

              {/* Status Message */}
              {isCheckingStore && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Spinner size="sm" />
                  <span className="text-sm text-blue-700">{t('searchStore.checkingStore')}</span>
                </div>
              )}

              {existingStoreId && !isCheckingStore && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-amber-800">{t('searchStore.alreadyRegistered')}</p>
                      <p className="text-xs text-amber-600 mt-0.5">{t('searchStore.alreadyInDatabase')}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              {existingStoreId ? (
                <button
                  onClick={handleViewStore}
                  disabled={isCheckingStore}
                  className="w-full px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span>{t('searchStore.viewStoreAndReviews')}</span>
                </button>
              ) : (
                <button
                  onClick={handleWriteReview}
                  disabled={isCreating || isCheckingStore}
                  className="w-full px-6 py-3.5 bg-primary hover:bg-[#b897c7] text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                  {isCreating ? (
                    <>
                      <Spinner size="sm" />
                      <span>{t('searchStore.processing')}</span>
                    </>
                  ) : (
                    <>
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
                      <span>{t('searchStore.selectAndWriteReview')}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
