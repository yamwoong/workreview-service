/**
 * Store-related TypeScript types
 * Matching backend IStore interface
 */

export interface IAddress {
  country: string; // ISO 3166-1 alpha-2 (GB, US, KR, etc.)
  countryName: string; // Country name (for display)
  formatted: string; // Full formatted address
  street?: string; // Street address
  city?: string; // City
  state?: string; // State/Province
  postalCode?: string; // Postal code
}

export interface ILocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface IAverageWage {
  min: number; // Minimum hourly wage
  max: number; // Maximum hourly wage
  average: number; // Average hourly wage
  count: number; // Number of wage data points
}

export interface IWageStats {
  belowMinimum: number; // Below minimum wage count
  minimumWage: number; // Minimum wage count
  aboveMinimum: number; // Above minimum wage count
  total: number; // Total wage reviews count
}

export type StoreCategory =
  | 'cafe'
  | 'restaurant'
  | 'convenience'
  | 'retail'
  | 'service'
  | 'education'
  | 'entertainment'
  | 'other';

export interface IStore {
  _id: string;
  googlePlaceId?: string;
  isFromGooglePlaces: boolean;
  name: string;
  address: IAddress;
  location: ILocation;
  category: StoreCategory;
  phone?: string;
  currency: string; // ISO 4217 (GBP, USD, KRW, etc.)
  createdBy: string;
  averageRating: number; // Average rating (1-5)
  averageWage: IAverageWage;
  wageStats?: IWageStats; // Wage type statistics (optional for backward compatibility)
  reviewCount: number;
  questionCount: number; // Q&A question count
  distance?: number; // Distance in meters (for geospatial queries)
  createdAt: string;
  updatedAt: string;
}

// API Request/Response Types

export interface GetStoresParams {
  lat?: number;
  lng?: number;
  radius?: number;
  country?: string;
  city?: string;
  category?: StoreCategory;
  search?: string;
  page?: number;
  limit?: number;
  sort?: 'latest' | 'rating' | 'reviewCount';
}

export interface GetStoresResponse {
  success: true;
  data: {
    stores: IStore[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface GetStoreResponse {
  success: true;
  data: IStore;
}

export interface CreateStoreFromPlaceRequest {
  placeId: string;
}

export interface CreateStoreFromPlaceResponse {
  success: true;
  data: IStore;
  message?: string;
}

// Filter state types
export interface StoreFilters {
  country?: string;
  city?: string;
  category?: StoreCategory;
  search?: string;
}

// Category display configuration
export interface CategoryConfig {
  value: StoreCategory;
  label: string;
}

export const STORE_CATEGORIES: CategoryConfig[] = [
  { value: 'cafe', label: 'Cafe' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'convenience', label: 'Convenience' },
  { value: 'retail', label: 'Retail' },
  { value: 'service', label: 'Service' },
  { value: 'education', label: 'Education' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'other', label: 'Other' }
];

// Country configuration
export interface CountryConfig {
  code: string;
  name: string;
  currency: string;
}

export const SUPPORTED_COUNTRIES: CountryConfig[] = [
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'KR', name: 'South Korea', currency: 'KRW' },
  { code: 'EU', name: 'Europe', currency: 'EUR' },
  { code: 'JP', name: 'Japan', currency: 'JPY' },
  { code: 'CN', name: 'China', currency: 'CNY' },
  { code: 'AU', name: 'Australia', currency: 'AUD' },
  { code: 'CA', name: 'Canada', currency: 'CAD' }
];

// Helper function to get currency symbol
export const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    GBP: '£',
    USD: '$',
    KRW: '₩',
    EUR: '€',
    JPY: '¥',
    CNY: '¥',
    AUD: '$',
    CAD: '$'
  };
  return symbols[currency] || currency;
};

// Helper function to format wage
export const formatWage = (wage: number, currency: string): string => {
  const symbol = getCurrencySymbol(currency);

  if (currency === 'KRW' || currency === 'JPY') {
    return `${symbol}${Math.round(wage).toLocaleString()}`;
  }

  return `${symbol}${wage.toFixed(2)}`;
};
