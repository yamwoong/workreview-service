/**
 * 국가별 설정 유틸리티
 * 통화, 최저시급, 로케일 등 국가별 설정 관리
 */

export interface CountryConfig {
  code: string; // ISO 3166-1 alpha-2
  name: string; // 국가명
  currency: string; // ISO 4217
  currencySymbol: string; // 통화 기호
  minWage: number; // 최저시급 (해당 통화)
  locale: string; // 로케일 (en-GB, ko-KR 등)
}

/**
 * 국가별 설정 맵
 */
export const COUNTRY_CONFIG: Record<string, CountryConfig> = {
  GB: {
    code: 'GB',
    name: 'United Kingdom',
    currency: 'GBP',
    currencySymbol: '£',
    minWage: 11.44, // 2024년 기준 (시간당)
    locale: 'en-GB',
  },
  US: {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    minWage: 7.25, // Federal minimum wage
    locale: 'en-US',
  },
  KR: {
    code: 'KR',
    name: 'South Korea',
    currency: 'KRW',
    currencySymbol: '₩',
    minWage: 9860, // 2024년 기준 (시간당)
    locale: 'ko-KR',
  },
  EU: {
    code: 'EU',
    name: 'European Union',
    currency: 'EUR',
    currencySymbol: '€',
    minWage: 12.0, // 평균 (국가마다 다름)
    locale: 'en-EU',
  },
  JP: {
    code: 'JP',
    name: 'Japan',
    currency: 'JPY',
    currencySymbol: '¥',
    minWage: 1004, // 2024년 기준 (시간당)
    locale: 'ja-JP',
  },
  CN: {
    code: 'CN',
    name: 'China',
    currency: 'CNY',
    currencySymbol: '¥',
    minWage: 24.0, // 베이징 기준 (지역마다 다름)
    locale: 'zh-CN',
  },
  AU: {
    code: 'AU',
    name: 'Australia',
    currency: 'AUD',
    currencySymbol: 'A$',
    minWage: 23.23, // 2024년 기준 (시간당)
    locale: 'en-AU',
  },
  CA: {
    code: 'CA',
    name: 'Canada',
    currency: 'CAD',
    currencySymbol: 'C$',
    minWage: 16.55, // 온타리오 기준 (주마다 다름)
    locale: 'en-CA',
  },
};

/**
 * 국가 코드로 설정 가져오기
 * @param countryCode - ISO 3166-1 alpha-2 국가 코드
 * @returns 국가 설정 (없으면 GB 기본값)
 */
export function getCountryConfig(countryCode: string): CountryConfig {
  const config = COUNTRY_CONFIG[countryCode.toUpperCase()];
  if (!config) {
    // 기본값: 영국
    return COUNTRY_CONFIG.GB;
  }
  return config;
}

/**
 * 국가 코드로 통화 코드 가져오기
 * @param countryCode - ISO 3166-1 alpha-2 국가 코드
 * @returns 통화 코드 (ISO 4217)
 */
export function getCurrencyFromCountry(countryCode: string): string {
  return getCountryConfig(countryCode).currency;
}

/**
 * 국가 코드로 최저시급 가져오기
 * @param countryCode - ISO 3166-1 alpha-2 국가 코드
 * @returns 최저시급 (해당 통화)
 */
export function getMinWageFromCountry(countryCode: string): number {
  return getCountryConfig(countryCode).minWage;
}

/**
 * 지원하는 모든 국가 코드 목록
 */
export const SUPPORTED_COUNTRIES = Object.keys(COUNTRY_CONFIG);

/**
 * 지원하는 모든 통화 코드 목록
 */
export const SUPPORTED_CURRENCIES = Array.from(
  new Set(Object.values(COUNTRY_CONFIG).map((c) => c.currency))
);
