import { useEffect, useRef, useState } from 'react';
import { loadGoogleMapsScript } from '@/utils/googleMaps';

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  className?: string;
}

export const PlaceAutocomplete = ({
  onPlaceSelect,
  placeholder = 'Search for a workplace...',
  className = ''
}: PlaceAutocompleteProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAutocomplete = async () => {
      try {
        // Google Maps 스크립트 로드
        await loadGoogleMapsScript();

        if (!inputRef.current) return;

        // Autocomplete 인스턴스 생성
        autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
          types: ['establishment'], // 가게/업체만 검색
          fields: [
            'place_id',
            'name',
            'formatted_address',
            'geometry',
            'address_components',
            'international_phone_number',
            'types'
          ]
        });

        // 장소 선택 이벤트 리스너
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();

          if (place && place.place_id) {
            onPlaceSelect(place);
          }
        });

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize Google Maps Autocomplete:', err);
        setError('Failed to load Google Maps. Please check your API key.');
        setIsLoading(false);
      }
    };

    initAutocomplete();

    // Cleanup
    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onPlaceSelect]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-800">{error}</p>
        <p className="text-xs text-red-600 mt-1">
          Please check your VITE_GOOGLE_MAPS_API_KEY in .env file
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          disabled={isLoading}
          className={`
            block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-[#4DCDB3] focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            placeholder-gray-400 text-gray-900
            ${className}
          `}
        />
      </div>
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-[#4DCDB3] rounded-full"></div>
        </div>
      )}
    </div>
  );
};
