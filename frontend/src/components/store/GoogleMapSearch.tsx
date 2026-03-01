import { useEffect, useRef, useState } from 'react';
import { loadGoogleMapsScript } from '@/utils/googleMaps';
import { Spinner } from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

interface GoogleMapSearchProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  onSearchResults?: (places: google.maps.places.PlaceResult[]) => void;
  selectedPlace: google.maps.places.PlaceResult | null;
}

export const GoogleMapSearch = ({
  onPlaceSelect,
  onSearchResults,
  selectedPlace
}: GoogleMapSearchProps): JSX.Element => {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearchingNearby, setIsSearchingNearby] = useState(false);
  const clickMarkerRef = useRef<google.maps.Marker | null>(null);

  // Fetch detailed place information
  const fetchPlaceDetails = (placeId: string): Promise<google.maps.places.PlaceResult> => {
    return new Promise((resolve, reject) => {
      if (!placesService) {
        reject(new Error('PlacesService not initialized'));
        return;
      }

      const request: google.maps.places.PlaceDetailsRequest = {
        placeId,
        fields: [
          'place_id',
          'name',
          'formatted_address',
          'geometry',
          'address_components',
          'international_phone_number',
          'formatted_phone_number',
          'types',
          'website',
          'url',
          'rating',
          'user_ratings_total',
          'price_level',
          'opening_hours',
          'photos',
          'reviews'
        ]
      };

      placesService.getDetails(request, (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && result) {
          resolve(result);
        } else {
          reject(new Error(`Failed to fetch place details: ${status}`));
        }
      });
    });
  };

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      try {
        await loadGoogleMapsScript();

        if (!mapRef.current) return;

        // Create map
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: 51.7520, lng: -1.2577 }, // Oxford as default
          zoom: 13,
          mapTypeControl: false,
          fullscreenControl: true,
          streetViewControl: false,
          zoomControl: true,
        });

        setMap(mapInstance);

        // Create Places Service
        const service = new google.maps.places.PlacesService(mapInstance);
        setPlacesService(service);

        // Add map click listener to search nearby places
        mapInstance.addListener('click', async (e: google.maps.MapMouseEvent) => {
          if (!e.latLng || isSearchingNearby) return;

          setIsSearchingNearby(true);

          // Clear previous click marker
          if (clickMarkerRef.current) {
            clickMarkerRef.current.setMap(null);
          }

          // Create temporary marker at click location
          const tempMarker = new google.maps.Marker({
            position: e.latLng,
            map: mapInstance,
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
            },
            animation: google.maps.Animation.DROP,
          });

          clickMarkerRef.current = tempMarker;

          // Search for nearby places
          const request: google.maps.places.PlaceSearchRequest = {
            location: e.latLng,
            radius: 50, // 50 meters
            type: 'establishment',
          };

          service.nearbySearch(request, async (results, status) => {
            setIsSearchingNearby(false);

            if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
              // Get the nearest place
              const nearestPlace = results[0];

              if (nearestPlace.place_id) {
                try {
                  // Fetch detailed place information
                  const detailedPlace = await fetchPlaceDetails(nearestPlace.place_id);

                  // Update marker position to exact place location
                  if (detailedPlace.geometry?.location) {
                    tempMarker.setPosition(detailedPlace.geometry.location);
                  }

                  onPlaceSelect(detailedPlace);
                  toast.success(`Found: ${detailedPlace.name}`);
                } catch (error) {
                  console.error('Failed to fetch place details:', error);
                  // Fallback to basic place info
                  onPlaceSelect(nearestPlace);
                  toast.success(`Found: ${nearestPlace.name}`);
                }
              }
            } else {
              // No place found nearby
              tempMarker.setMap(null);
              clickMarkerRef.current = null;
              toast.error('No workplace found at this location. Try searching instead.');
            }
          });
        });

        // Create search box
        if (searchInputRef.current) {
          const searchBoxInstance = new google.maps.places.SearchBox(searchInputRef.current);

          // Bias search results towards map's viewport
          mapInstance.addListener('bounds_changed', () => {
            searchBoxInstance.setBounds(mapInstance.getBounds() as google.maps.LatLngBounds);
          });

          // Listen for search box places changed
          searchBoxInstance.addListener('places_changed', () => {
            const places = searchBoxInstance.getPlaces();

            if (!places || places.length === 0) {
              onSearchResults?.([]);
              return;
            }

            // Notify parent of search results
            onSearchResults?.(places);

            // Clear old markers
            markers.forEach((marker) => marker.setMap(null));

            const newMarkers: google.maps.Marker[] = [];
            const bounds = new google.maps.LatLngBounds();

            places.forEach((place) => {
              if (!place.geometry || !place.geometry.location) {
                return;
              }

              // Create marker
              const marker = new google.maps.Marker({
                map: mapInstance,
                title: place.name,
                position: place.geometry.location,
              });

              // Add click listener to marker
              marker.addListener('click', async () => {
                if (place.place_id) {
                  try {
                    const detailedPlace = await fetchPlaceDetails(place.place_id);
                    onPlaceSelect(detailedPlace);
                  } catch (error) {
                    console.error('Failed to fetch place details:', error);
                    // Fallback to basic place info if details fetch fails
                    onPlaceSelect(place);
                  }
                } else {
                  onPlaceSelect(place);
                }
              });

              newMarkers.push(marker);

              if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
              } else {
                bounds.extend(place.geometry.location);
              }
            });

            setMarkers(newMarkers);
            mapInstance.fitBounds(bounds);
          });

          setSearchBox(searchBoxInstance);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize Google Maps:', err);
        setError('Failed to load Google Maps. Please check your API key.');
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      // Cleanup markers
      markers.forEach((marker) => marker.setMap(null));
      if (clickMarkerRef.current) {
        clickMarkerRef.current.setMap(null);
      }
    };
  }, [isSearchingNearby]);

  // Update marker when place is selected
  useEffect(() => {
    if (!map || !selectedPlace || !selectedPlace.geometry) return;

    // Clear existing search markers (but keep click marker if it exists)
    markers.forEach((marker) => marker.setMap(null));

    // If there's a click marker at the same location, keep it
    // Otherwise create a new blue marker for selected place
    if (!clickMarkerRef.current ||
        clickMarkerRef.current.getPosition()?.lat() !== selectedPlace.geometry.location?.lat() ||
        clickMarkerRef.current.getPosition()?.lng() !== selectedPlace.geometry.location?.lng()) {

      const marker = new google.maps.Marker({
        map: map,
        position: selectedPlace.geometry.location,
        title: selectedPlace.name,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        },
      });

      setMarkers([marker]);
    } else {
      // Update click marker to blue
      clickMarkerRef.current.setIcon({
        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      });
      setMarkers([]);
    }

    // Center map on selected place
    map.setCenter(selectedPlace.geometry.location as google.maps.LatLng);
    map.setZoom(15);
  }, [selectedPlace, map]);

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-sm text-red-800 mb-2">{error}</p>
            <p className="text-xs text-red-600">
              Please check your VITE_GOOGLE_MAPS_API_KEY in .env file
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Search Box Overlay */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-10">
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
            ref={searchInputRef}
            type="text"
            placeholder="Search for workplaces..."
            disabled={isLoading}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-lg bg-white
                     focus:ring-2 focus:ring-primary focus:border-transparent
                     disabled:bg-gray-100 disabled:cursor-not-allowed
                     placeholder-gray-500 text-gray-900 font-medium"
          />
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="mt-2 bg-white rounded-lg shadow-lg p-3 flex items-center gap-2">
            <Spinner size="sm" />
            <span className="text-sm text-gray-600">Loading map...</span>
          </div>
        )}
      </div>

      {/* Help Text Overlay */}
      {!isLoading && !selectedPlace && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 z-10">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-md">
            <p className="text-xs text-gray-600 text-center">
              💡 <span className="font-medium">Tip:</span> Search for a workplace above or click anywhere on the map
            </p>
          </div>
        </div>
      )}

      {/* Searching Nearby Indicator */}
      {isSearchingNearby && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 px-4 z-10">
          <div className="bg-white rounded-lg shadow-lg p-3 flex items-center gap-2">
            <Spinner size="sm" />
            <span className="text-sm text-gray-700 font-medium">Searching nearby...</span>
          </div>
        </div>
      )}
    </div>
  );
};
