/**
 * Google Maps JavaScript API 타입 정의
 * 필요한 부분만 선언합니다.
 */

declare global {
  interface Window {
    google: typeof google;
  }

  namespace google {
    namespace maps {
      class Map {
        constructor(mapDiv: Element, opts?: MapOptions);
      }

      class Marker {
        constructor(opts?: MarkerOptions);
        setMap(map: Map | null): void;
      }

      interface MapOptions {
        center?: LatLng | LatLngLiteral;
        zoom?: number;
        [key: string]: unknown;
      }

      interface MarkerOptions {
        position?: LatLng | LatLngLiteral;
        map?: Map;
        title?: string;
        [key: string]: unknown;
      }

      interface LatLng {
        lat(): number;
        lng(): number;
      }

      interface LatLngLiteral {
        lat: number;
        lng: number;
      }

      class LatLngBounds {
        constructor();
        union(other: LatLngBounds): LatLngBounds;
        extend(point: LatLng | LatLngLiteral): LatLngBounds;
      }

      namespace event {
        function clearInstanceListeners(instance: unknown): void;
      }

      namespace places {
        class Autocomplete {
          constructor(input: HTMLInputElement, opts?: AutocompleteOptions);
          addListener(eventName: string, handler: () => void): void;
          getPlace(): PlaceResult;
        }

        class SearchBox {
          constructor(input: HTMLInputElement, opts?: SearchBoxOptions);
          addListener(eventName: string, handler: () => void): void;
          getPlaces(): PlaceResult[];
          setBounds(bounds: LatLngBounds): void;
        }

        class PlacesService {
          constructor(attrContainer: HTMLDivElement | Map);
          getDetails(
            request: PlaceDetailsRequest,
            callback: (result: PlaceResult | null, status: PlacesServiceStatus) => void
          ): void;
        }

        interface AutocompleteOptions {
          types?: string[];
          fields?: string[];
          componentRestrictions?: ComponentRestrictions;
          [key: string]: unknown;
        }

        interface SearchBoxOptions {
          bounds?: LatLngBounds;
          [key: string]: unknown;
        }

        interface ComponentRestrictions {
          country?: string | string[];
        }

        interface PlaceDetailsRequest {
          placeId: string;
          fields?: string[];
        }

        enum PlacesServiceStatus {
          OK = 'OK',
          ZERO_RESULTS = 'ZERO_RESULTS',
          INVALID_REQUEST = 'INVALID_REQUEST',
          OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
          REQUEST_DENIED = 'REQUEST_DENIED',
          UNKNOWN_ERROR = 'UNKNOWN_ERROR',
        }

        interface PlaceResult {
          place_id?: string;
          name?: string;
          formatted_address?: string;
          geometry?: {
            location?: LatLng;
            viewport?: LatLngBounds;
          };
          address_components?: AddressComponent[];
          international_phone_number?: string;
          formatted_phone_number?: string;
          types?: string[];
          website?: string;
          url?: string;
          rating?: number;
          user_ratings_total?: number;
          price_level?: number;
          opening_hours?: {
            open_now?: boolean;
            periods?: OpeningPeriod[];
            weekday_text?: string[];
          };
          photos?: PlacePhoto[];
          reviews?: PlaceReview[];
          [key: string]: unknown;
        }

        interface AddressComponent {
          long_name: string;
          short_name: string;
          types: string[];
        }

        interface OpeningPeriod {
          open: {
            day: number;
            time: string;
          };
          close?: {
            day: number;
            time: string;
          };
        }

        interface PlacePhoto {
          height: number;
          width: number;
          getUrl(opts?: { maxWidth?: number; maxHeight?: number }): string;
        }

        interface PlaceReview {
          author_name: string;
          author_url?: string;
          language: string;
          profile_photo_url?: string;
          rating: number;
          relative_time_description: string;
          text: string;
          time: number;
        }
      }
    }
  }
}

export {};
