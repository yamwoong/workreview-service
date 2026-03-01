# Google OAuth 설정 가이드

## 📋 개요

Google OAuth 2.0을 사용하여 사용자가 Google 계정으로 로그인할 수 있습니다.

---

## 🔑 Google Cloud Console 설정

### 1. Google Cloud 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. 프로젝트 이름: `workreview` (또는 원하는 이름)

### 2. OAuth 동의 화면 설정

1. 왼쪽 메뉴에서 **APIs & Services** → **OAuth consent screen** 선택
2. **External** 선택 (개인 사용자용) 또는 **Internal** (조직 내부용)
3. 필수 정보 입력:
   - **App name**: WorkReview
   - **User support email**: your-email@gmail.com
   - **Developer contact information**: your-email@gmail.com
4. **Save and Continue** 클릭
5. **Scopes** 단계에서 다음 추가:
   - `userinfo.email`
   - `userinfo.profile`
6. **Save and Continue** 클릭

### 3. OAuth 2.0 클라이언트 ID 생성

1. 왼쪽 메뉴에서 **APIs & Services** → **Credentials** 선택
2. **+ CREATE CREDENTIALS** → **OAuth client ID** 클릭
3. Application type: **Web application** 선택
4. Name: `WorkReview Web Client`
5. **Authorized JavaScript origins** 추가:
   ```
   http://localhost:5173
   http://localhost:5000
   ```
6. **Authorized redirect URIs** 추가:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
7. **CREATE** 클릭
8. **Client ID**와 **Client Secret** 복사 (잘 보관!)

---

## 🔧 환경변수 설정

### Backend (.env)

```env
# Google OAuth 설정
GOOGLE_CLIENT_ID=123456789-abcdefghijk.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL (리다이렉트용)
FRONTEND_URL=http://localhost:5173
```

**주의사항:**
- `.env` 파일은 절대 Git에 커밋하지 마세요!
- `.gitignore`에 `.env`가 포함되어 있는지 확인하세요

---

## 🌐 Frontend 설정

### Google 로그인 버튼

```tsx
<button onClick={handleGoogleLogin}>
  <img src="/google-icon.svg" alt="Google" />
  Continue with Google
</button>
```

### Google 로그인 핸들러

```typescript
const handleGoogleLogin = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
};
```

### OAuth 콜백 페이지

`/oauth/callback` 경로에서 토큰을 받아 저장:

```typescript
// pages/OAuthCallbackPage.tsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken && refreshToken) {
      // 토큰 저장
      setAuth(accessToken, refreshToken);
      // 홈으로 리다이렉트
      navigate('/', { replace: true });
    } else {
      // 오류 발생
      navigate('/login?error=oauth_failed', { replace: true });
    }
  }, [searchParams, navigate, setAuth]);

  return <div>로그인 중...</div>;
};
```

---

## 🧪 테스트

### 1. 백엔드 서버 시작

```bash
cd backend
npm run dev
```

### 2. 프론트엔드 서버 시작

```bash
cd frontend
npm run dev
```

### 3. 테스트 플로우

1. 브라우저에서 `http://localhost:5173` 접속
2. "Google로 로그인" 버튼 클릭
3. Google 계정 선택
4. 권한 승인
5. 자동으로 홈페이지로 리다이렉트
6. 로그인 상태 확인

---

## 🔐 프로덕션 설정

### 1. Google Cloud Console

**Authorized JavaScript origins**:
```
https://workreview.com
https://www.workreview.com
```

**Authorized redirect URIs**:
```
https://api.workreview.com/api/auth/google/callback
```

### 2. 환경변수 (.env.production)

```env
GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-client-secret
GOOGLE_CALLBACK_URL=https://api.workreview.com/api/auth/google/callback
FRONTEND_URL=https://workreview.com
```

---

## ❓ 문제 해결

### "Error 400: redirect_uri_mismatch"
→ Google Cloud Console의 **Authorized redirect URIs**와 `.env`의 `GOOGLE_CALLBACK_URL`이 정확히 일치하는지 확인

### "OAuth error: Email not provided"
→ OAuth consent screen에서 `userinfo.email` 스코프가 추가되어 있는지 확인

### 로그인 후 토큰이 저장되지 않음
→ 브라우저 콘솔에서 `/oauth/callback` URL의 쿼리 파라미터 확인

### CORS 오류
→ `backend/src/config/cors.ts`에 프론트엔드 URL이 포함되어 있는지 확인

---

## 📚 참고 자료

- [Google OAuth 2.0 문서](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Google Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)
- [Google Cloud Console](https://console.cloud.google.com/)

---

**작성일**: 2025-01-04
**버전**: 1.0.0
