/**
 * Google Places API 유틸리티
 * Place ID로 가게 정보 가져오기
 */

import axios from 'axios';
import { logger } from '../config/logger';
import { getCurrencyFromCountry } from './countryConfig.util';
import { BadRequestError } from './errors.util';

/**
 * Google Places API 응답 타입
 */
interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  formatted_phone_number?: string;
  types: string[];
}

/**
 * Store 생성용 데이터 타입
 */
export interface PlaceStoreData {
  googlePlaceId: string;
  isFromGooglePlaces: boolean;
  name: string;
  address: {
    country: string;
    countryName: string;
    formatted: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  phone?: string;
  currency: string;
  category: string;
}

/**
 * Google Place types를 카테고리로 매핑
 * @param types - Google Place types 배열
 * @returns 카테고리 (cafe, restaurant 등)
 */
function mapGoogleTypesToCategory(types: string[]): string {
  // 우선순위대로 매핑
  if (types.includes('cafe')) return 'cafe';
  if (types.includes('restaurant')) return 'restaurant';
  if (types.includes('convenience_store')) return 'convenience';
  if (types.includes('store') || types.includes('clothing_store') || types.includes('book_store'))
    return 'retail';
  if (types.includes('hair_care') || types.includes('beauty_salon') || types.includes('spa'))
    return 'service';
  if (types.includes('school') || types.includes('university')) return 'education';
  if (types.includes('movie_theater') || types.includes('night_club') || types.includes('bar'))
    return 'entertainment';

  // 기본값
  return 'other';
}

/**
 * Google Place ID로 상세 정보 가져오기
 * @param placeId - Google Place ID
 * @returns Store 생성용 데이터
 */
export async function getPlaceDetails(placeId: string): Promise<PlaceStoreData> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    throw new Error('GOOGLE_PLACES_API_KEY 환경변수가 설정되지 않았습니다');
  }

  try {
    logger.info('Google Places API 호출', { placeId });

    const response = await axios.get<{ result: GooglePlaceResult; status: string }>(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          place_id: placeId,
          fields:
            'place_id,name,formatted_address,address_components,geometry,formatted_phone_number,types',
          key: apiKey,
        },
      }
    );

    if (response.data.status !== 'OK') {
      logger.error('Google Places API 에러', {
        status: response.data.status,
        placeId,
      });
      throw new BadRequestError('유효하지 않은 Place ID입니다');
    }

    const place = response.data.result;

    // 주소 컴포넌트 파싱
    const addressComponents = place.address_components;

    const country =
      addressComponents.find((c) => c.types.includes('country'))?.short_name || 'GB';
    const countryName =
      addressComponents.find((c) => c.types.includes('country'))?.long_name || 'United Kingdom';
    const city = addressComponents.find((c) => c.types.includes('locality'))?.long_name;
    const state = addressComponents.find((c) =>
      c.types.includes('administrative_area_level_1')
    )?.long_name;
    const postalCode = addressComponents.find((c) => c.types.includes('postal_code'))?.long_name;
    const streetNumber = addressComponents.find((c) => c.types.includes('street_number'))
      ?.long_name;
    const route = addressComponents.find((c) => c.types.includes('route'))?.long_name;

    // 상세 주소 조합
    const street = [streetNumber, route].filter(Boolean).join(' ') || undefined;

    // 통화 자동 설정
    const currency = getCurrencyFromCountry(country);

    // 카테고리 매핑
    const category = mapGoogleTypesToCategory(place.types);

    logger.info('Google Places 정보 추출 완료', {
      placeId,
      name: place.name,
      country,
      city,
      category,
    });

    return {
      googlePlaceId: placeId,
      isFromGooglePlaces: true,
      name: place.name,
      address: {
        country,
        countryName,
        formatted: place.formatted_address,
        street,
        city,
        state,
        postalCode,
      },
      location: {
        type: 'Point',
        coordinates: [place.geometry.location.lng, place.geometry.location.lat],
      },
      phone: place.formatted_phone_number,
      currency,
      category,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error('Google Places API 요청 실패', {
        placeId,
        error: error.message,
        response: error.response?.data,
      });
      throw new BadRequestError('Google Places API 요청에 실패했습니다');
    }

    throw error;
  }
}
