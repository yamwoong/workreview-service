import jwt from 'jsonwebtoken';

/**
 * 토큰 블랙리스트 저장소
 * key: 토큰 문자열
 * value: 만료 시간 (타임스탬프)
 *
 * ⚠️ 프로덕션 환경에서는 Redis 사용 권장
 * 현재는 메모리 기반이므로 서버 재시작 시 초기화됨
 */
const blacklist = new Map<string, number>();

/**
 * 만료된 토큰 정기적으로 정리 (메모리 누수 방지)
 */
setInterval(() => {
  const now = Date.now();
  blacklist.forEach((expTime, token) => {
    if (expTime < now) {
      blacklist.delete(token);
    }
  });
}, 60000); // 1분마다 정리

/**
 * 토큰을 블랙리스트에 추가
 * @param token - JWT 토큰 문자열
 */
export const addToBlacklist = (token: string): void => {
  try {
    // 토큰을 디코딩하여 만료 시간 가져오기
    const decoded = jwt.decode(token) as { exp?: number };

    if (decoded && decoded.exp) {
      // 만료 시간까지만 블랙리스트에 유지
      const expTime = decoded.exp * 1000; // 초 -> 밀리초
      blacklist.set(token, expTime);
    } else {
      // 만료 시간이 없으면 24시간 후 삭제
      const expTime = Date.now() + 24 * 60 * 60 * 1000;
      blacklist.set(token, expTime);
    }
  } catch (error) {
    // 디코딩 실패 시 24시간 후 삭제
    const expTime = Date.now() + 24 * 60 * 60 * 1000;
    blacklist.set(token, expTime);
  }
};

/**
 * 토큰이 블랙리스트에 있는지 확인
 * @param token - JWT 토큰 문자열
 * @returns 블랙리스트에 있으면 true
 */
export const isBlacklisted = (token: string): boolean => {
  const expTime = blacklist.get(token);

  if (!expTime) {
    return false;
  }

  // 만료된 경우 삭제하고 false 반환
  if (expTime < Date.now()) {
    blacklist.delete(token);
    return false;
  }

  return true;
};

/**
 * 블랙리스트에서 토큰 제거 (테스트 용도)
 * @param token - JWT 토큰 문자열
 */
export const removeFromBlacklist = (token: string): void => {
  blacklist.delete(token);
};

/**
 * 블랙리스트 전체 초기화 (테스트 용도)
 */
export const clearBlacklist = (): void => {
  blacklist.clear();
};

/**
 * 현재 블랙리스트 크기 반환 (모니터링 용도)
 * @returns 블랙리스트에 있는 토큰 개수
 */
export const getBlacklistSize = (): number => {
  return blacklist.size;
};
