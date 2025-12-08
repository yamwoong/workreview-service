# UI 재디자인 계획서

> **작성일**: 2025-12-06
> **목적**: WorkReview 프로젝트의 모든 페이지에 일관된 UI 디자인 시스템 적용
> **범위**: 인증 페이지(5) + 홈 페이지(1) + 에러 페이지(3) = 총 9개 페이지

---

## 📋 목차

1. [프로젝트 현황](#1-프로젝트-현황)
2. [UI 디자인 방향](#2-ui-디자인-방향)
3. [디자인 시스템](#3-디자인-시스템)
4. [페이지별 수정 계획](#4-페이지별-수정-계획)
5. [작업 순서](#5-작업-순서)
6. [도구 사용 가이드](#6-도구-사용-가이드)
7. [새 대화 시작 가이드](#7-새-대화-시작-가이드)

---

## 1. 프로젝트 현황

### 1.1 기술 스택
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **UI 라이브러리**: React Hook Form, Zod (validation)
- **상태 관리**: Zustand, React Query
- **라우팅**: React Router v6

### 1.2 현재 페이지 목록

#### 🔐 인증 관련 (5개)
| 페이지 | 파일 경로 | 현재 상태 | 우선순위 |
|--------|-----------|-----------|----------|
| 로그인 | `frontend/src/pages/auth/LoginPage.tsx` | ✅ 구현 완료 | 🔴 High |
| 회원가입 | `frontend/src/pages/auth/RegisterPage.tsx` | ✅ 구현 완료 | 🔴 High |
| 비밀번호 찾기 | `frontend/src/pages/auth/ForgotPasswordPage.tsx` | ✅ 구현 완료 | 🟡 Medium |
| 비밀번호 재설정 | `frontend/src/pages/auth/ResetPasswordPage.tsx` | ✅ 구현 완료 (보안 강화됨) | 🟡 Medium |
| 프로필 | `frontend/src/pages/ProfilePage.tsx` | ✅ 구현 완료 | 🔴 High |

#### 🏠 메인 페이지 (1개)
| 페이지 | 파일 경로 | 현재 상태 | 우선순위 |
|--------|-----------|-----------|----------|
| 홈/랜딩 | `frontend/src/pages/HomePage.tsx` | ✅ 구현 완료 | 🔴 High |

#### ⚠️ 에러 페이지 (3개)
| 페이지 | 파일 경로 | 현재 상태 | 우선순위 |
|--------|-----------|-----------|----------|
| 404 Not Found | `frontend/src/pages/error/NotFoundPage.tsx` | ✅ 구현 완료 | 🟢 Low |
| 500 Server Error | `frontend/src/pages/error/ServerErrorPage.tsx` | ✅ 구현 완료 | 🟢 Low |
| 403 Forbidden | `frontend/src/pages/error/ForbiddenPage.tsx` | ✅ 구현 완료 | 🟢 Low |

### 1.3 현재 UI 특징

**공통 패턴:**
- Split-screen 레이아웃 (로그인/회원가입)
  - 왼쪽: 그라데이션 배경 (purple-600 → indigo-600 → blue-600)
  - 오른쪽: 흰색 배경 + 폼
- React Hook Form + Zod validation
- 에러 메시지 표시 방식 일관성

**문제점:**
- 사용자가 현재 UI 스타일에 불만족
- 페이지 간 일관성은 있으나 디자인 개선 필요
- 공통 컴포넌트 미추출 (중복 코드 존재)

---

## 2. UI 디자인 방향

### 2.1 참고 이미지

> **✅ GitHub 로그인 페이지 스타일 참고**

**분석 결과:**
```
✅ 이미지 1: GitHub 로그인 페이지
    - 색상: GitHub Green (#2da44e), 파란 링크 (#0969da), 회색 톤
    - 레이아웃: 중앙 정렬, 단일 컬럼, 최소주의적
    - 버튼/Input:
      * 녹색 Primary 버튼 (전체 너비)
      * 회색 Secondary 버튼 (OAuth)
      * 심플한 Input (회색 테두리)
      * 둥근 모서리 (rounded-md)
    - 특징:
      * 충분한 여백 (whitespace)
      * 명확한 계층 구조
      * 깔끔한 타이포그래피
      * 아이콘 사용 (GitHub, Google, Apple)
```

### 2.2 디자인 컨셉

**키워드:**
- ✅ 전체 느낌: **미니멀, 클린, 프로페셔널**
- ✅ 색상 분위기: **차분하고 신뢰감 있는 (GitHub Green + 회색 톤)**
- ✅ 레이아웃 스타일: **중앙 정렬 카드, 단일 컬럼 폼**

**핵심 디자인 원칙:**
1. **Simplicity First**: 불필요한 요소 제거, 기능에 집중
2. **Consistent Spacing**: 일정한 간격으로 시각적 리듬 생성
3. **Clear Hierarchy**: 크기와 굵기로 명확한 정보 계층
4. **Subtle Interactions**: 부드러운 hover/focus 효과

---

## 3. 디자인 시스템

### 3.1 색상 팔레트

> **✅ 아쿠아마린 파스텔 톤 적용**

#### Primary Colors (주요 액션 - Aquamarine Pastel)
```css
--primary-50: #E8F9F6   /* 매우 연한 아쿠아 */
--primary-100: #C2F0E8  /* 연한 민트 */
--primary-200: #9AE6D8  /* 밝은 아쿠아마린 */
--primary-300: #72DBC8  /* 파스텔 터코이즈 */
--primary-400: #56D4BD  /* 중간 아쿠아마린 */
--primary-500: #4DCDB3  /* 메인 색상 - 파스텔 아쿠아마린 */
--primary-600: #3CB89F  /* 살짝 진한 */
--primary-700: #2FA48B  /* 진한 터코이즈 */
--primary-800: #239076  /* 더 진한 */
--primary-900: #187B61  /* 가장 진한 */
```

#### Secondary Colors (보조 - Teal Links)
```css
--secondary-50: #E8F9F6   /* 매우 연한 티ール */
--secondary-100: #C2F0E8  /* 연한 티║ */
--secondary-500: #2FA48B  /* 링크 색상 - 진한 터코이즈 */
--secondary-600: #239076  /* 진한 링크 색상 */
--secondary-700: #187B61  /* 더 진한 티║ */
```

#### Neutral Colors (배경, 텍스트)
```css
--gray-50: #f6f8fa    /* 배경 - 매우 연한 회색 */
--gray-100: #eaeef2   /* 밝은 배경 */
--gray-200: #d0d7de   /* Border - 연한 테두리 */
--gray-300: #afb8c1   /* 중간 연한 회색 */
--gray-400: #8c959f   /* 중간 회색 */
--gray-500: #6e7781   /* 보조 텍스트 */
--gray-600: #57606a   /* 진한 보조 텍스트 */
--gray-700: #424a53   /* 더 진한 텍스트 */
--gray-800: #32383f   /* 매우 진한 텍스트 */
--gray-900: #24292f   /* 메인 텍스트 - 거의 검정 */
```

#### Semantic Colors
```css
--success: #4DCDB3   /* 성공 - Primary Aquamarine 사용 */
--error: #cf222e     /* 에러 - Red */
--warning: #bf8700   /* 경고 - Yellow */
--info: #2FA48B      /* 정보 - Secondary Teal 사용 */
```

#### Tailwind Config 적용
```javascript
// frontend/tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--primary-50)',
          // ... 나머지
        },
      },
    },
  },
};
```

### 3.2 Typography

#### Font Family
```css
--font-primary: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
/* 또는 참고 이미지의 폰트 */
```

#### Font Sizes
| 용도 | Tailwind Class | 크기 | 용례 |
|------|----------------|------|------|
| Page Title | `text-4xl` | 36px | 페이지 제목 |
| Section Title | `text-3xl` | 30px | 섹션 제목 |
| Card Title | `text-2xl` | 24px | 카드 제목 |
| Heading | `text-xl` | 20px | 소제목 |
| Body Large | `text-lg` | 18px | 중요 본문 |
| Body | `text-base` | 16px | 기본 본문 |
| Body Small | `text-sm` | 14px | 보조 텍스트 |
| Caption | `text-xs` | 12px | 캡션, 힌트 |

#### Font Weights
```css
--font-light: 300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### 3.3 컴포넌트 스타일 가이드

> **✅ GitHub 스타일 참고 이미지 기반으로 작성됨**

#### Button 스타일

**Primary Button (메인 액션 - Aquamarine Pastel)**
```tsx
className="
  w-full px-4 py-2.5
  bg-[#4DCDB3] hover:bg-[#3CB89F]
  text-white font-medium text-sm
  rounded-md
  border border-[#4DCDB3] hover:border-[#3CB89F]
  transition-colors duration-150
  disabled:opacity-50 disabled:cursor-not-allowed
  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4DCDB3]
"
```

**Secondary Button (OAuth 등 보조 액션)**
```tsx
className="
  w-full px-4 py-2.5
  bg-[#f6f8fa] hover:bg-[#eaeef2]
  text-gray-900 font-medium text-sm
  rounded-md
  border border-[#d0d7de]
  transition-colors duration-150
  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
"
```

**Danger Button (삭제, 위험한 액션)**
```tsx
className="
  w-full px-4 py-2.5
  bg-[#cf222e] hover:bg-[#a40e26]
  text-white font-medium text-sm
  rounded-md
  border border-[#cf222e] hover:border-[#a40e26]
  transition-colors duration-150
  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
"
```

**Link Button (텍스트 링크)**
```tsx
className="
  text-[#2FA48B] hover:text-[#239076]
  font-medium text-sm
  underline hover:no-underline
  transition-colors duration-150
"
```

**사이즈 변형:**
- Small: `px-3 py-1.5 text-xs`
- Medium: `px-4 py-2.5 text-sm` (기본)
- Large: `px-5 py-3 text-base`

#### Input 스타일

**기본 Input**
```tsx
className="
  w-full px-3 py-2
  border border-[#d0d7de]
  rounded-md
  text-sm text-gray-900
  bg-white
  placeholder:text-gray-500
  focus:outline-none
  focus:border-[#4DCDB3]
  focus:ring-1 focus:ring-[#4DCDB3]
  transition-colors duration-150
  disabled:bg-gray-50 disabled:cursor-not-allowed
"
```

**Error 상태 Input**
```tsx
className="
  w-full px-3 py-2
  border border-[#cf222e]
  rounded-md
  text-sm text-gray-900
  bg-white
  focus:outline-none
  focus:border-[#cf222e]
  focus:ring-1 focus:ring-[#cf222e]
"
```

**Label**
```tsx
className="block text-sm font-medium text-gray-900 mb-1.5"
```

**Error Message**
```tsx
className="text-xs text-[#cf222e] mt-1.5"
```

**Helper Text**
```tsx
className="text-xs text-gray-600 mt-1"
```

**Link in Form (Forgot password 등)**
```tsx
className="text-xs text-[#2FA48B] hover:underline float-right"
```

#### Card 스타일

**기본 Card (Form Container)**
```tsx
className="
  bg-white
  rounded-md
  border border-[#d0d7de]
  p-6
  max-w-sm mx-auto
"
```

**Elevated Card (Centered Login Card)**
```tsx
className="
  bg-white
  rounded-md
  border border-[#d0d7de]
  p-6
  max-w-sm mx-auto
  shadow-sm
"
```

**Clickable Card**
```tsx
className="
  bg-white
  rounded-md
  border border-[#d0d7de] hover:border-gray-400
  p-6
  cursor-pointer
  transition-all duration-150
  hover:shadow-sm
"
```

#### Spacing 시스템

**Container Padding**
- Mobile: `px-6`
- Tablet: `px-8`
- Desktop: `px-12 lg:px-16`

**Section Spacing**
- Between sections: `space-y-8` (32px)
- Between elements: `space-y-4` (16px)
- Between form fields: `space-y-6` (24px)

**Card Padding**
- Small: `p-4` (16px)
- Medium: `p-6` (24px) - 기본
- Large: `p-8` (32px)

#### Border Radius

```css
--radius-sm: 0.375rem  /* 6px - 작은 요소 */
--radius-md: 0.5rem    /* 8px - 기본 */
--radius-lg: 0.75rem   /* 12px - 카드, 버튼 */
--radius-xl: 1rem      /* 16px - 큰 카드 */
```

#### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
```

---

## 4. 페이지별 수정 계획

### 4.1 🏠 HomePage (최우선)

**파일**: `frontend/src/pages/HomePage.tsx`

**현재 상태 분석:**
- Cursor로 생성됨
- 기본 구조만 있음

**수정 계획:**
```
[ ] Hero Section
    - 메인 헤드라인
    - 서브 헤드라인
    - CTA 버튼 (로그인/회원가입)

[ ] Features Section (선택)
    - WorkReview의 주요 기능 3-4가지
    - 아이콘 + 설명

[ ] Footer (선택)
    - 간단한 링크
    - 저작권 정보
```

**적용할 디자인:**
- [ ] 색상: 새로 정의한 Primary 색상 사용
- [ ] 레이아웃: 참고 이미지 기반
- [ ] CTA 버튼: Primary Button 스타일
- [ ] Typography: 정의한 크기 시스템 적용

### 4.2 🔐 LoginPage

**파일**: `frontend/src/pages/auth/LoginPage.tsx`

**현재 상태 분석:**
```tsx
- Split-screen 레이아웃
- 왼쪽: 그라데이션 배경 (purple → indigo → blue)
- 오른쪽: 로그인 폼
- React Hook Form + Zod
```

**수정 계획:**
```
[ ] 전체 레이아웃
    - 참고 이미지 기반으로 재구성
    - Split-screen 유지 또는 변경

[ ] 왼쪽 영역 (있다면)
    - 배경 색상 변경 (새 Primary 색상)
    - 텍스트 내용 개선
    - 이미지/일러스트 추가 (선택)

[ ] 오른쪽 폼 영역
    - Input 스타일 적용 (새 디자인 시스템)
    - Button 스타일 적용
    - 에러 메시지 스타일
    - 간격 조정

[ ] 기타
    - "비밀번호 찾기" 링크 스타일
    - "회원가입" 링크 스타일
    - 로고 추가 (선택)
```

**주의사항:**
- ✅ React Hook Form 로직 유지
- ✅ Validation 로직 유지
- ✅ 에러 처리 로직 유지
- ⚠️ 스타일만 변경!

### 4.3 📝 RegisterPage

**파일**: `frontend/src/pages/auth/RegisterPage.tsx`

**현재 상태 분석:**
```tsx
- LoginPage와 동일한 구조
- 필드: 이메일, 비밀번호, 비밀번호 확인, 이름
- Department, Position 제거됨
```

**수정 계획:**
```
[ ] LoginPage와 일관성 유지
    - 동일한 레이아웃 구조
    - 동일한 색상/스타일

[ ] 폼 필드
    - Input 스타일 통일
    - Label 스타일 통일
    - Error 메시지 위치/스타일 통일

[ ] 왼쪽 영역 텍스트
    - "회원가입" 맞는 문구로 변경
```

**주의사항:**
- ✅ 기존 기능 100% 유지
- ✅ LoginPage와 스타일 완전히 일치

### 4.4 👤 ProfilePage

**파일**: `frontend/src/pages/ProfilePage.tsx`

**현재 상태 분석:**
```tsx
- Cursor로 생성됨
- 프로필 정보 조회/수정
- 비밀번호 변경 기능
```

**수정 계획:**
```
[ ] 전체 레이아웃
    - 헤더: "프로필 설정" 제목
    - 카드 기반 섹션 분리

[ ] 프로필 정보 섹션
    - Card 컴포넌트 사용
    - 이름, 이메일, 부서, 직급 표시
    - 수정 버튼

[ ] 프로필 수정 폼
    - Input 스타일 적용
    - 저장/취소 버튼

[ ] 비밀번호 변경 섹션
    - 별도 Card
    - 현재 비밀번호, 새 비밀번호, 확인
    - 변경 버튼

[ ] 네비게이션
    - 뒤로 가기 또는 홈 버튼
```

**주의사항:**
- ✅ 백엔드 API 연동 유지 (GET/PATCH /api/auth/me, PUT /api/auth/me/password)
- ✅ React Query 사용 유지

### 4.5 🔑 ForgotPasswordPage

**파일**: `frontend/src/pages/auth/ForgotPasswordPage.tsx`

**현재 상태 분석:**
```tsx
- 이메일 입력 폼
- 재설정 링크 전송
```

**수정 계획:**
```
[ ] 레이아웃
    - LoginPage와 일관성 유지
    - 또는 단순화된 버전

[ ] 폼
    - 이메일 Input 하나
    - 전송 버튼
    - 뒤로가기 링크

[ ] 성공 메시지
    - 이메일 전송 완료 안내
```

### 4.6 🔄 ResetPasswordPage

**파일**: `frontend/src/pages/auth/ResetPasswordPage.tsx`

**현재 상태 분석:**
```tsx
- 토큰 검증 로직 추가됨 (보안 강화)
- 새 비밀번호, 확인 입력
```

**수정 계획:**
```
[ ] 로딩 상태 (토큰 검증 중)
    - 스피너 디자인 개선

[ ] 에러 상태 (토큰 무효)
    - 에러 페이지 디자인
    - "다시 시도하기" 버튼

[ ] 폼 (토큰 유효)
    - Password Input 스타일
    - 변경 버튼

[ ] 성공 상태
    - 성공 메시지 디자인
```

### 4.7 ⚠️ NotFoundPage (404)

**파일**: `frontend/src/pages/error/NotFoundPage.tsx`

**수정 계획:**
```
[ ] 중앙 정렬 레이아웃
[ ] 404 아이콘/일러스트
[ ] "페이지를 찾을 수 없습니다" 메시지
[ ] 홈으로 돌아가기 버튼
[ ] 전체 색상/스타일 통일
```

### 4.8 ⚠️ ServerErrorPage (500)

**파일**: `frontend/src/pages/error/ServerErrorPage.tsx`

**수정 계획:**
```
[ ] 404와 유사한 구조
[ ] 500 아이콘/일러스트
[ ] "서버 오류가 발생했습니다" 메시지
[ ] 새로고침 버튼
[ ] 홈으로 돌아가기 버튼
```

### 4.9 ⚠️ ForbiddenPage (403)

**파일**: `frontend/src/pages/error/ForbiddenPage.tsx`

**수정 계획:**
```
[ ] 404/500과 일관된 구조
[ ] 403 아이콘/일러스트
[ ] "접근 권한이 없습니다" 메시지
[ ] 로그인 페이지로 이동 버튼
```

---

## 5. 작업 순서

### 5.1 우선순위별 그룹

#### Phase 1: 핵심 페이지 (필수) 🔴
```
1. HomePage - 가장 먼저 보는 페이지
2. LoginPage - 가장 많이 사용
3. RegisterPage - LoginPage와 세트
4. ProfilePage - 로그인 후 주요 페이지
```

**예상 시간**: 2-3시간

#### Phase 2: 비밀번호 관련 (중요) 🟡
```
5. ForgotPasswordPage
6. ResetPasswordPage
```

**예상 시간**: 1시간

#### Phase 3: 에러 페이지 (선택) 🟢
```
7. NotFoundPage (404)
8. ServerErrorPage (500)
9. ForbiddenPage (403)
```

**예상 시간**: 30분-1시간

### 5.2 페이지별 작업 흐름

**각 페이지마다 반복:**

```
1️⃣ Cursor에서 UI 수정
   - 참고 이미지 기반
   - 디자인 시스템 적용
   - 실시간 프리뷰 확인

2️⃣ Claude Code에서 검토
   - 코드 리뷰
   - 스타일 일관성 체크
   - TypeScript 타입 확인
   - 기능 동작 확인

3️⃣ 브라우저 테스트
   - 실제 동작 확인
   - 반응형 확인
   - 에러 케이스 확인

4️⃣ 다음 페이지로
```

---

## 6. 도구 사용 가이드

### 6.1 Cursor 사용 (UI 수정)

**언제 사용:**
- ✅ 디자인/레이아웃 변경
- ✅ 스타일 조정
- ✅ 색상 변경
- ✅ 실시간 프리뷰가 필요할 때

**프롬프트 예시:**

```
@frontend/src/pages/HomePage.tsx
@docs/UI_REDESIGN_PLAN.md

HomePage를 문서의 디자인 시스템에 맞춰 수정해줘.

적용할 것:
- 색상: Primary 색상 사용
- 버튼: Primary Button 스타일
- Typography: 정의된 크기 시스템
- 레이아웃: [참고 이미지 설명]

기존 기능은 모두 유지해줘.
```

### 6.2 Claude Code 사용 (검토/최적화)

**언제 사용:**
- ✅ 코드 리뷰
- ✅ 스타일 일관성 체크
- ✅ TypeScript 타입 검증
- ✅ 리팩토링
- ✅ 베스트 프랙티스 적용

**프롬프트 예시:**

```
@frontend/src/pages/HomePage.tsx
@docs/UI_REDESIGN_PLAN.md

HomePage를 검토해줘:

1. 디자인 시스템 적용 확인
   - 색상이 정의된 팔레트 사용하는지
   - 버튼/Input 스타일이 일관되는지
   - Typography 크기가 맞는지

2. 코드 품질
   - TypeScript 타입 확인
   - 불필요한 중복 제거
   - 접근성 (a11y) 확인

3. 개선 제안
```

### 6.3 작업 분담 권장

| 작업 | Cursor | Claude Code |
|------|--------|-------------|
| UI 레이아웃 변경 | ✅ 주도 | 검토 |
| 색상 변경 | ✅ 주도 | 검토 |
| 버튼/Input 스타일 | ✅ 주도 | 검토 |
| 스타일 일관성 체크 | 보조 | ✅ 주도 |
| TypeScript 타입 | 보조 | ✅ 주도 |
| 로직 수정 | 보조 | ✅ 주도 |
| 리팩토링 | 보조 | ✅ 주도 |

---

## 7. 새 대화 시작 가이드

### 7.1 준비물 체크리스트

```
[ ] 참고 이미지 1-3개 준비
[ ] 이 문서 (UI_REDESIGN_PLAN.md) 확인
[ ] 백엔드/프론트엔드 개발 서버 실행 중
[ ] MongoDB 실행 중 (Docker)
```

### 7.2 새 대화 시작 프롬프트

**Cursor 새 대화:**

```
[참고 이미지 1-3개 첨부]

@docs/UI_REDESIGN_PLAN.md

참고 이미지를 기반으로 HomePage부터 UI를 수정하려고 해.

먼저 이미지를 분석해서:
1. 색상 팔레트 추출 (HEX 값)
2. 버튼/Input/Card 스타일 파악
3. Typography 크기 정리

그다음 UI_REDESIGN_PLAN.md의 "3. 디자인 시스템" 섹션을 채워줘.
특히:
- 3.1 색상 팔레트
- 3.3 컴포넌트 스타일 가이드 (Button, Input, Card)

채우고 나서 HomePage 수정 시작하자.

@frontend/src/pages/HomePage.tsx
```

**Claude Code 새 대화 (검토용):**

```
@docs/UI_REDESIGN_PLAN.md
@frontend/src/pages/HomePage.tsx

Cursor에서 HomePage UI를 수정했어.
문서의 디자인 시스템에 맞게 잘 적용되었는지 검토해줘:

1. 색상 팔레트 사용 확인
2. 버튼/Input 스타일 일관성
3. Typography 크기
4. Spacing 시스템
5. 코드 품질 (TypeScript, 접근성)

문제 있으면 수정 제안해줘.
```

### 7.3 작업 플로우

```
새 대화 시작
    ↓
[Cursor] 참고 이미지 첨부 + 디자인 시스템 채우기
    ↓
[Cursor] HomePage 수정
    ↓
[Claude Code] 검토 및 피드백
    ↓
수정 필요시 [Cursor]로 돌아가서 수정
    ↓
완료 → LoginPage로 이동
    ↓
(반복)
```

---

## 8. 체크리스트

### 8.1 페이지별 완료 체크

#### Phase 1: 핵심 페이지
- [ ] HomePage
  - [ ] Cursor 수정 완료
  - [ ] Claude 검토 완료
  - [ ] 브라우저 테스트 완료
  - [ ] 반응형 확인 완료

- [ ] LoginPage
  - [ ] Cursor 수정 완료
  - [ ] Claude 검토 완료
  - [ ] 로그인 기능 동작 확인
  - [ ] 반응형 확인 완료

- [ ] RegisterPage
  - [ ] Cursor 수정 완료
  - [ ] Claude 검토 완료
  - [ ] 회원가입 기능 동작 확인
  - [ ] LoginPage와 스타일 일치 확인

- [ ] ProfilePage
  - [ ] Cursor 수정 완료
  - [ ] Claude 검토 완료
  - [ ] 프로필 조회/수정 동작 확인
  - [ ] 비밀번호 변경 동작 확인

#### Phase 2: 비밀번호 관련
- [ ] ForgotPasswordPage
  - [ ] Cursor 수정 완료
  - [ ] Claude 검토 완료
  - [ ] 이메일 전송 확인

- [ ] ResetPasswordPage
  - [ ] Cursor 수정 완료
  - [ ] Claude 검토 완료
  - [ ] 토큰 검증 확인
  - [ ] 비밀번호 변경 확인

#### Phase 3: 에러 페이지
- [ ] NotFoundPage (404)
- [ ] ServerErrorPage (500)
- [ ] ForbiddenPage (403)

### 8.2 디자인 시스템 적용 체크

**모든 페이지 공통:**
- [ ] 색상 팔레트 사용 (Primary, Secondary, Neutral)
- [ ] Typography 시스템 적용 (크기, 굵기)
- [ ] Button 스타일 통일
- [ ] Input 스타일 통일
- [ ] Card 스타일 통일 (사용하는 페이지)
- [ ] Spacing 시스템 적용
- [ ] Border Radius 통일
- [ ] Shadow 사용 일관성

### 8.3 코드 품질 체크

- [ ] TypeScript 에러 없음
- [ ] ESLint 경고 없음 (중요한 것)
- [ ] 접근성 (a11y) 기본 준수
  - [ ] Label-Input 연결
  - [ ] aria-label 적절히 사용
  - [ ] 키보드 네비게이션 가능
- [ ] 반응형 디자인 (모바일, 태블릿, 데스크탑)
- [ ] 로딩 상태 처리
- [ ] 에러 상태 처리

### 8.4 기능 동작 체크

- [ ] 모든 폼 제출 정상 작동
- [ ] React Hook Form validation 동작
- [ ] API 호출 성공/실패 처리
- [ ] 라우팅 정상 작동
- [ ] Protected/Guest Route 동작
- [ ] 에러 메시지 표시 정상

---

## 9. 참고 자료

### 9.1 현재 프로젝트 문서
- `docs/PAGE_STRUCTURE.md` - 전체 페이지 구조
- `docs/API_SPEC.md` - API 명세
- `backend/src/controllers/auth.controller.ts` - 인증 API
- `frontend/src/validators/auth.validator.ts` - Validation 스키마

### 9.2 유용한 링크
- Tailwind CSS 문서: https://tailwindcss.com/docs
- React Hook Form: https://react-hook-form.com/
- Headless UI (선택): https://headlessui.com/
- Hero Icons (선택): https://heroicons.com/

---

## 10. 주의사항 ⚠️

### 10.1 절대 하지 말아야 할 것

**❌ 기존 기능 제거:**
- React Hook Form 로직 삭제
- Validation 로직 삭제
- API 호출 로직 삭제
- 에러 처리 로직 삭제

**❌ 구조적 변경:**
- 라우팅 변경 (별도 논의 필요)
- 상태 관리 방식 변경
- API 엔드포인트 변경

**❌ 새 라이브러리 추가 (사전 논의 없이):**
- UI 컴포넌트 라이브러리
- 애니메이션 라이브러리
- 기타 외부 의존성

### 10.2 권장 사항

**✅ 스타일만 변경:**
- Tailwind CSS 클래스 수정
- 색상, 간격, 크기 조정
- 레이아웃 구조 개선

**✅ 점진적 개선:**
- 한 페이지씩 완성
- 테스트 후 다음 페이지
- 문제 발견 즉시 수정

**✅ 일관성 유지:**
- 모든 페이지 같은 디자인 시스템
- 버튼/Input 스타일 동일
- 에러 메시지 표시 방식 동일

---

## 11. 완료 조건

**모든 Phase 완료 시:**

```
✅ 9개 페이지 모두 새 디자인 적용
✅ 디자인 시스템 일관성 100%
✅ 모든 기능 정상 작동
✅ TypeScript/ESLint 에러 없음
✅ 반응형 디자인 완성
✅ 브라우저 테스트 통과
```

**다음 단계:**
- 공통 컴포넌트 추출 (Button, Input, Card)
- 코어 리뷰 기능 구현
- 대시보드 구현

---

**문서 업데이트**: 새 대화에서 참고 이미지 분석 후 "3. 디자인 시스템" 섹션을 채워넣으세요!

**작성자**: Claude Code
**버전**: 1.0
**최종 수정**: 2025-12-06
