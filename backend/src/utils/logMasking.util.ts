import crypto from 'crypto';

/**
 * 이메일 마스킹
 * 예: user@example.com -> us***@ex***.com
 * @param email - 마스킹할 이메일
 * @returns 마스킹된 이메일
 */
export const maskEmail = (email: string): string => {
  if (!email || typeof email !== 'string') {
    return '***';
  }

  const [localPart, domain] = email.split('@');

  if (!localPart || !domain) {
    return '***';
  }

  // 로컬 파트: 앞 2글자만 표시
  const maskedLocal =
    localPart.length > 2
      ? localPart.substring(0, 2) + '***'
      : localPart.substring(0, 1) + '***';

  // 도메인: 앞 2글자만 표시
  const domainParts = domain.split('.');
  const maskedDomain = domainParts
    .map((part) =>
      part.length > 2 ? part.substring(0, 2) + '***' : part.substring(0, 1) + '***'
    )
    .join('.');

  return `${maskedLocal}@${maskedDomain}`;
};

/**
 * 사용자 ID 해시 (로그 추적용)
 * 동일한 사용자는 동일한 해시를 가지지만 원본은 알 수 없음
 * @param userId - 사용자 ID
 * @returns 해시된 ID (앞 8자리만)
 */
export const hashUserId = (userId: string): string => {
  if (!userId || typeof userId !== 'string') {
    return 'unknown';
  }

  return crypto.createHash('sha256').update(userId).digest('hex').substring(0, 8);
};

/**
 * 이메일 해시 (로그 추적용)
 * 동일한 이메일은 동일한 해시를 가지지만 원본은 알 수 없음
 * @param email - 이메일
 * @returns 해시된 이메일 (앞 8자리만)
 */
export const hashEmail = (email: string): string => {
  if (!email || typeof email !== 'string') {
    return 'unknown';
  }

  return crypto.createHash('sha256').update(email.toLowerCase()).digest('hex').substring(0, 8);
};

/**
 * IP 주소 마스킹
 * 예: 192.168.1.100 -> 192.168.***.***
 * @param ip - IP 주소
 * @returns 마스킹된 IP 주소
 */
export const maskIp = (ip: string): string => {
  if (!ip || typeof ip !== 'string') {
    return '***';
  }

  // IPv4
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.***.***`;
    }
  }

  // IPv6 (앞 4개 블록만 표시)
  if (ip.includes(':')) {
    const parts = ip.split(':');
    if (parts.length > 4) {
      return parts.slice(0, 4).join(':') + ':***:***';
    }
  }

  return '***';
};

/**
 * 민감한 데이터 마스킹 (범용)
 * @param data - 마스킹할 데이터
 * @param visibleChars - 보여줄 앞글자 수 (기본값: 3)
 * @returns 마스킹된 데이터
 */
export const maskSensitiveData = (data: string, visibleChars = 3): string => {
  if (!data || typeof data !== 'string') {
    return '***';
  }

  if (data.length <= visibleChars) {
    return '***';
  }

  return data.substring(0, visibleChars) + '***';
};

/**
 * 로그용 안전한 사용자 정보 객체 생성
 * @param user - 사용자 정보
 * @returns 마스킹된 사용자 정보
 */
export const safeUserLog = (user: {
  id?: string;
  email?: string;
  [key: string]: any;
}): {
  userIdHash: string;
  emailHash: string;
} => {
  return {
    userIdHash: user.id ? hashUserId(user.id) : 'unknown',
    emailHash: user.email ? hashEmail(user.email) : 'unknown',
  };
};
