# WorkReview 페이지 구조

> 핵심 기능 우선, 부가 페이지는 배포 직전

## 📋 목차
1. [현재 상태](#현재-상태)
2. [즉시 구현 필수](#즉시-구현-필수)
3. [배포 직전 구현](#배포-직전-구현)
4. [구현 우선순위](#구현-우선순위)
5. [페이지별 상세 명세](#페이지별-상세-명세)

---

## 현재 상태

### ✅ 완료된 페이지 (2개)
- [x] `/login` - 로그인 페이지
- [x] `/register` - 회원가입 페이지

---

## 즉시 구현 필수

> **지금 당장 만들어야 하는 핵심 페이지**

### 🔴 Phase 1: 핵심 페이지 (우선순위 최상)

#### 1. 404 Not Found 페이지 (`*`)
- **목적**: 잘못된 URL 접근 처리
- **우선순위**: ⭐⭐⭐⭐⭐
- **예상 시간**: 10분

**포함 내용**:
- 에러 메시지
- 홈으로 돌아가기 버튼

---

#### 2. 홈/랜딩 페이지 (`/`)
- **목적**: 서비스 진입점
- **우선순위**: ⭐⭐⭐⭐⭐
- **예상 시간**: 1-2시간

**로그인 전**:
- 서비스 소개
- 주요 기능 안내
- 로그인/회원가입 버튼

**로그인 후**:
- 대시보드로 리다이렉트

---

#### 3. 프로필/설정 페이지 (`/profile`)
- **목적**: 사용자 정보 관리
- **우선순위**: ⭐⭐⭐⭐⭐
- **예상 시간**: 1-2시간

**기능**:
- 내 정보 조회/수정
- 비밀번호 변경
- 로그아웃

---

#### 4. 비밀번호 찾기 (`/forgot-password`)
- **목적**: 비밀번호 분실 시 복구
- **우선순위**: ⭐⭐⭐⭐⭐
- **예상 시간**: 30분

**기능**:
- 이메일 입력
- 재설정 링크 전송

---

#### 5. 비밀번호 재설정 (`/reset-password/:token`)
- **목적**: 이메일 링크로 비밀번호 재설정
- **우선순위**: ⭐⭐⭐⭐⭐
- **예상 시간**: 30분

**기능**:
- 토큰 유효성 검증
- 새 비밀번호 설정

---

### 🟠 Phase 2: 추가 에러 페이지 (선택적)

#### 6. 500 서버 에러 페이지 (`/500`)
- **목적**: 서버 오류 발생 시
- **우선순위**: ⭐⭐⭐
- **예상 시간**: 10분

---

#### 7. 403 Forbidden 페이지 (`/403`)
- **목적**: 권한 없는 접근 처리
- **우선순위**: ⭐⭐⭐
- **예상 시간**: 10분

---

## 배포 직전 구현

> **실제 배포할 때 필요한 페이지 (나중에)**

### 🟡 Phase 3: 법적 문서 (배포 직전)

#### 8. 이용약관 (`/terms`)
- **목적**: 법적 보호
- **우선순위**: ⭐⭐⭐⭐ (배포 시 필수)
- **예상 시간**: 20분 (템플릿 사용)

---

#### 9. 개인정보처리방침 (`/privacy`)
- **목적**: 개인정보보호법 준수
- **우선순위**: ⭐⭐⭐⭐ (배포 시 필수)
- **예상 시간**: 20분 (템플릿 사용)

---

### 🟢 Phase 4: 부가 기능 (배포 후)

#### 10. 고객지원/문의 페이지 (`/contact`)
- **예상 시간**: 1시간
- **미룸 이유**: 초기에는 이메일로 대응 가능

---

#### 11. About/소개 페이지 (`/about`)
- **예상 시간**: 30분
- **미룸 이유**: 홈페이지에 간단히 포함 가능

---

#### 12. 이메일 인증 페이지 (`/verify-email/:token`)
- **예상 시간**: 30분
- **미룸 이유**: 초기에는 이메일 인증 없이 운영 가능

---

#### 13. 로딩/스플래시 페이지
- **미룸 이유**: 필수 아님

---

#### 14. 유지보수 페이지 (`/maintenance`)
- **미룸 이유**: 필요할 때 추가

---

#### 15. 알림 페이지 (`/notifications`)
- **미룸 이유**: 알림 기능 자체를 나중에 구현

---

#### 16. 검색 페이지 (`/search`)
- **미룸 이유**: 컨텐츠가 충분히 쌓인 후 구현

---

## 구현 우선순위

### 🎯 지금 바로 구현 (2-3일)

```
1. 404 페이지 (10분)
2. 홈/랜딩 페이지 (2시간)
3. 프로필 페이지 (2시간)
4. 비밀번호 찾기 (30분)
5. 비밀번호 재설정 (30분)
6. 500 페이지 (10분) - 선택
7. 403 페이지 (10분) - 선택
────────────────────────
총 예상 시간: 약 5시간
```

**그 다음**: 리뷰 기능 등 핵심 비즈니스 로직 구현!

---

### 📦 배포 직전에만 구현 (1-2시간)

```
8. 이용약관 (20분)
9. 개인정보처리방침 (20분)
────────────────────────
총 예상 시간: 40분
```

---

### 🚀 배포 후 천천히 추가

```
- 고객지원 페이지
- About 페이지
- 이메일 인증
- 알림 페이지
- 검색 페이지
- 유지보수 페이지
```

---

## 페이지별 상세 명세

### 1. 404 Not Found 페이지

**파일 경로**: `frontend/src/pages/error/NotFoundPage.tsx`

**레이아웃**:
```
┌─────────────────────────────────────────┐
│                                         │
│           [404 아이콘]                   │
│                                         │
│      페이지를 찾을 수 없습니다           │
│                                         │
│   요청하신 페이지가 존재하지 않거나       │
│   삭제되었습니다.                        │
│                                         │
│   [홈으로 돌아가기]  [로그인]            │
│                                         │
└─────────────────────────────────────────┘
```

**필요한 기능**:
- 로그인 페이지와 동일한 스타일 (그라데이션 배경)
- React Router catch-all route

**라우팅**:
```tsx
<Route path="*" element={<NotFoundPage />} />
```

---

### 2. 홈/랜딩 페이지

**파일 경로**: `frontend/src/pages/HomePage.tsx`

**레이아웃 (로그인 전)**:
```
┌─────────────────────────────────────────┐
│  [Logo] WorkReview    [로그인] [회원가입]│
├─────────────────────────────────────────┤
│                                         │
│        업무 성과를 체계적으로           │
│        관리하고 피드백하세요            │
│                                         │
│          [시작하기 →]                   │
│                                         │
├─────────────────────────────────────────┤
│  주요 기능                               │
│  ───────                                │
│  📝 리뷰 작성 및 관리                    │
│  📊 성과 추적 및 분석                    │
│  👥 팀 협업 강화                        │
└─────────────────────────────────────────┘
```

**필요한 기능**:
- 로그인 상태 확인 (`useAuth` hook)
- 로그인 시 `/dashboard` 또는 `/profile` 리다이렉트
- 로그인/회원가입 페이지와 동일한 스타일

---

### 3. 프로필/설정 페이지

**파일 경로**: `frontend/src/pages/ProfilePage.tsx`

**레이아웃**:
```
┌─────────────────────────────────────────┐
│  프로필 설정                             │
├─────────────────────────────────────────┤
│                                         │
│  기본 정보                               │
│  ────────                               │
│  이메일: user@example.com (변경 불가)    │
│  이름:   [홍길동      ]                  │
│  가입일: 2025-11-28                      │
│                                         │
│  [저장하기]                              │
│                                         │
├─────────────────────────────────────────┤
│  비밀번호 변경                           │
│  ────────                               │
│  현재 비밀번호: [          ]             │
│  새 비밀번호:   [          ]             │
│  비밀번호 확인: [          ]             │
│                                         │
│  [비밀번호 변경]                         │
│                                         │
├─────────────────────────────────────────┤
│  계정 관리                               │
│  ────────                               │
│  [로그아웃]                              │
└─────────────────────────────────────────┘
```

**필요한 API**:
- `GET /api/users/me` - 내 정보 조회
- `PATCH /api/users/me` - 내 정보 수정
- `PATCH /api/users/me/password` - 비밀번호 변경

**필요한 기능**:
- React Hook Form + Zod validation
- 로딩 상태 표시
- 성공/실패 toast 메시지
- 보호된 라우트 (로그인 필요)

---

### 4. 비밀번호 찾기 페이지

**파일 경로**: `frontend/src/pages/auth/ForgotPasswordPage.tsx`

**레이아웃**:
```
┌─────────────────────────────────────────┐
│                                         │
│  비밀번호 찾기                           │
│  ═══════════                            │
│                                         │
│  등록된 이메일 주소를 입력하시면         │
│  비밀번호 재설정 링크를 보내드립니다.    │
│                                         │
│  이메일: [                    ]          │
│                                         │
│  [재설정 링크 전송]                      │
│                                         │
│  [← 로그인으로 돌아가기]                │
│                                         │
└─────────────────────────────────────────┘
```

**필요한 API**:
- `POST /api/auth/forgot-password` - 재설정 이메일 전송

**필요한 기능**:
- 이메일 validation
- 전송 완료 메시지
- 로그인 페이지와 동일한 스타일

---

### 5. 비밀번호 재설정 페이지

**파일 경로**: `frontend/src/pages/auth/ResetPasswordPage.tsx`

**레이아웃**:
```
┌─────────────────────────────────────────┐
│                                         │
│  비밀번호 재설정                         │
│  ═══════════                            │
│                                         │
│  새 비밀번호:   [                ]       │
│  비밀번호 확인: [                ]       │
│                                         │
│  [비밀번호 재설정]                       │
│                                         │
└─────────────────────────────────────────┘
```

**필요한 API**:
- `POST /api/auth/reset-password/:token` - 비밀번호 재설정

**필요한 기능**:
- URL 파라미터에서 토큰 추출
- 토큰 유효성 검증
- 비밀번호 일치 확인
- 성공 시 로그인 페이지로 리다이렉트

---

### 6. 500 서버 에러 페이지

**파일 경로**: `frontend/src/pages/error/ServerErrorPage.tsx`

**레이아웃**:
```
┌─────────────────────────────────────────┐
│                                         │
│           [500 아이콘]                   │
│                                         │
│        서버 오류가 발생했습니다          │
│                                         │
│   일시적인 문제가 발생했습니다.          │
│   잠시 후 다시 시도해주세요.             │
│                                         │
│   [새로고침]  [홈으로]                   │
│                                         │
└─────────────────────────────────────────┘
```

---

### 7. 403 Forbidden 페이지

**파일 경로**: `frontend/src/pages/error/ForbiddenPage.tsx`

**레이아웃**:
```
┌─────────────────────────────────────────┐
│                                         │
│           [403 아이콘]                   │
│                                         │
│      접근 권한이 없습니다                │
│                                         │
│   이 페이지에 접근할 권한이 없습니다.    │
│                                         │
│   [홈으로]  [로그인]                     │
│                                         │
└─────────────────────────────────────────┘
```

---

## 라우팅 구조

**파일 경로**: `frontend/src/App.tsx`

```tsx
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import GuestRoute from './components/auth/GuestRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/error/NotFoundPage';
import ServerErrorPage from './pages/error/ServerErrorPage';
import ForbiddenPage from './pages/error/ForbiddenPage';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />

      {/* Auth Routes (Guest Only) */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      {/* Protected Routes (Auth Required) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        {/* 나중에 추가: Dashboard, Reviews 등 */}
      </Route>

      {/* Error Pages */}
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="/500" element={<ServerErrorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
```

---

## 폴더 구조

```
frontend/src/pages/
├── HomePage.tsx                 # 홈/랜딩
├── ProfilePage.tsx              # 프로필/설정
│
├── auth/
│   ├── LoginPage.tsx            # 로그인 ✅
│   ├── RegisterPage.tsx         # 회원가입 ✅
│   ├── ForgotPasswordPage.tsx   # 비밀번호 찾기
│   └── ResetPasswordPage.tsx    # 비밀번호 재설정
│
└── error/
    ├── NotFoundPage.tsx         # 404
    ├── ServerErrorPage.tsx      # 500
    └── ForbiddenPage.tsx        # 403
```

---

## 필수 컴포넌트

### 공통 컴포넌트

```
frontend/src/components/
├── auth/
│   ├── ProtectedRoute.tsx       # 로그인 필요 라우트
│   └── GuestRoute.tsx           # 로그인 시 접근 불가 라우트
│
└── common/
    ├── Button.tsx               # 재사용 버튼
    ├── Input.tsx                # 재사용 인풋
    └── Loading.tsx              # 로딩 스피너
```

---

## 백엔드 API 필요 사항

### 프로필 관련
- `GET /api/users/me` - 내 정보 조회
- `PATCH /api/users/me` - 내 정보 수정
- `PATCH /api/users/me/password` - 비밀번호 변경

### 비밀번호 재설정
- `POST /api/auth/forgot-password` - 재설정 이메일 전송
- `POST /api/auth/reset-password/:token` - 비밀번호 재설정

---

## 구현 체크리스트

### Phase 1: 즉시 구현 (지금!)
- [ ] 404 Not Found 페이지
- [ ] 홈/랜딩 페이지
- [ ] 프로필/설정 페이지
- [ ] 비밀번호 찾기 페이지
- [ ] 비밀번호 재설정 페이지
- [ ] 500 서버 에러 페이지 (선택)
- [ ] 403 Forbidden 페이지 (선택)

### Phase 2: 핵심 기능 (다음 단계)
- [ ] 리뷰 작성 페이지
- [ ] 리뷰 목록 페이지
- [ ] 리뷰 상세 페이지
- [ ] 대시보드 페이지

### Phase 3: 배포 직전
- [ ] 이용약관
- [ ] 개인정보처리방침

### Phase 4: 배포 후 (여유 있을 때)
- [ ] 고객지원 페이지
- [ ] About 페이지
- [ ] 이메일 인증
- [ ] 알림 페이지
- [ ] 검색 페이지

---

## 다음 단계

**1단계**: 404 페이지 (10분) - 가장 빠르게
**2단계**: 홈/랜딩 페이지 (2시간)
**3단계**: 프로필 페이지 (2시간)
**4단계**: 비밀번호 찾기/재설정 (1시간)

**그 다음**: 리뷰 기능 같은 핵심 비즈니스 로직 구현!

---

## 참고 문서

- [API_SPEC.md](./API_SPEC.md) - API 명세
- [UI_DESIGN_GUIDE.md](./UI_DESIGN_GUIDE.md) - UI 디자인 가이드
- [CODING_CONVENTIONS.md](./CODING_CONVENTIONS.md) - 코딩 컨벤션

---

**문서 작성일**: 2025-11-28
**최종 수정일**: 2025-11-28
**작성자**: WorkReview Team
