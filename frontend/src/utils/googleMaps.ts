/**
 * Google Maps JavaScript API 로더
 * Places Library를 포함하여 Google Maps를 로드합니다.
 */

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

let isLoaded = false;
let isLoading = false;
let loadPromise: Promise<void> | null = null;

/**
 * Google Maps JavaScript API를 로드합니다.
 * 이미 로드된 경우 재로드하지 않습니다.
 */
export const loadGoogleMapsScript = (): Promise<void> => {
  // 이미 로드됨
  if (isLoaded) {
    return Promise.resolve();
  }

  // 로딩 중
  if (isLoading && loadPromise) {
    return loadPromise;
  }

  // API 키 확인
  if (!GOOGLE_MAPS_API_KEY) {
    return Promise.reject(
      new Error(
        'Google Maps API key is not configured. Please set VITE_GOOGLE_MAPS_API_KEY in .env file.'
      )
    );
  }

  isLoading = true;

  loadPromise = new Promise((resolve, reject) => {
    // 스크립트가 이미 DOM에 있는지 확인
    const existingScript = document.querySelector(
      'script[src^="https://maps.googleapis.com/maps/api/js"]'
    );

    if (existingScript) {
      isLoaded = true;
      isLoading = false;
      resolve();
      return;
    }

    // 스크립트 생성
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&language=en`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      isLoaded = true;
      isLoading = false;
      resolve();
    };

    script.onerror = () => {
      isLoading = false;
      loadPromise = null;
      reject(new Error('Failed to load Google Maps script'));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
};

/**
 * Google Maps가 로드되었는지 확인
 */
export const isGoogleMapsLoaded = (): boolean => {
  return isLoaded && typeof google !== 'undefined' && typeof google.maps !== 'undefined';
};
