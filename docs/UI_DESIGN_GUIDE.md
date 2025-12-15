# 🎨 UI Design Guide

> **WorkReview 디자인 시스템**
> 아르바이트 리뷰 플랫폼을 위한 깔끔하고 신뢰감 있는 디자인 가이드

---

## 📖 목차

1. [브랜드 아이덴티티](#브랜드-아이덴티티)
2. [컬러 시스템](#컬러-시스템)
3. [타이포그래피](#타이포그래피)
4. [간격 시스템](#간격-시스템)
5. [그림자 & 테두리](#그림자--테두리)
6. [애니메이션](#애니메이션)
7. [컴포넌트 스타일](#컴포넌트-스타일)
8. [레이아웃](#레이아웃)
9. [접근성](#접근성)
10. [참고 디자인](#참고-디자인)

---

## 🎯 브랜드 아이덴티티

### 프로젝트 컨셉
```
WorkReview는 아르바이트 경험을 공유하는 리뷰 플랫폼입니다.
지도 기반으로 주변 매장을 탐색하고, 실제 근무 경험을 기반으로 한
솔직한 리뷰를 제공하여 더 나은 일자리 선택을 돕습니다.
```

### 타겟 사용자
- **아르바이트 구직자**: 실제 근무 환경 정보 탐색
- **현재/전직 아르바이트생**: 근무 경험 공유 및 리뷰 작성
- **일반 사용자**: 지역 매장 정보 및 평가 확인

### 디자인 방향성
```
✓ 친근한 (Friendly) - 누구나 쉽게 접근
✓ 신뢰감 있는 (Trustworthy) - 실제 경험 기반
✓ 깔끔한 (Clean) - 정보 전달에 집중
✓ 직관적인 (Intuitive) - 쉬운 사용성
✓ 모던한 (Modern) - 젊은 층 친화적
```

### 디자인 키워드
```
신뢰, 공유, 투명성, 접근성, 커뮤니티
```

---

## 🎨 컬러 시스템

### Primary Color (아쿠아마린 파스텔 - 신뢰감 & 친근함)

```css
/* Tailwind Config */
primary: {
  50:  '#E8F9F6',  // 매우 연한 아쿠아 - 배경
  100: '#C2F0E8',  // 연한 민트 - hover 배경
  200: '#9AE6D8',  // 밝은 아쿠아마린
  300: '#72DBC8',  // 파스텔 터코이즈
  400: '#56D4BD',  // 중간 아쿠아마린
  500: '#4DCDB3',  // 메인 색상 - 파스텔 아쿠아마린 ⭐
  600: '#3CB89F',  // 진함 - 버튼, 링크
  700: '#2FA48B',  // 더 진함 - hover
  800: '#239076',  //
  900: '#187B61',  // 가장 진함
}
```

**사용처:**
- 메인 버튼 (CTA)
- 링크
- 강조 요소
- 활성 상태 (active, selected)
- 평점 표시 (별점)

---

### Secondary Color (티ール - 보조 액션)

```css
secondary: {
  50:  '#E8F9F6',  // 매우 연한 티ール
  100: '#C2F0E8',  // 연한 티ール
  200: '#9AE6D8',
  300: '#72DBC8',
  400: '#56D4BD',
  500: '#2FA48B',  // 링크 색상 - 진한 터코이즈 ⭐
  600: '#239076',  // 진한 링크 색상
  700: '#187B61',  // 더 진한 티ール
  800: '#136654',
  900: '#0F5244',
}
```

**사용처:**
- 보조 액션 버튼
- 텍스트 링크
- 아이콘 강조
- 정보 표시 (Info)

---

### Semantic Colors (의미 있는 색상)

```css
/* Success - 초록 (리뷰 작성 완료, 긍정적 평가) */
success: {
  50:  '#F0FDF4',
  500: '#4DCDB3',  // Primary 아쿠아마린 사용 ⭐
  600: '#3CB89F',
  700: '#2FA48B',
}

/* Error - 빨강 (에러, 삭제, 부정적 경고) */
error: {
  50:  '#FEF2F2',
  500: '#CF222E',  // GitHub Red ⭐
  600: '#A40E26',
  700: '#82071E',
}

/* Warning - 주황 (주의 필요, 중립적 알림) */
warning: {
  50:  '#FFFBEB',
  500: '#F59E0B',  // 기본 ⭐
  600: '#D97706',
  700: '#B45309',
}

/* Info - 하늘색 (정보 알림) */
info: {
  50:  '#E8F9F6',
  500: '#2FA48B',  // Secondary Teal 사용 ⭐
  600: '#239076',
  700: '#187B61',
}
```

**사용처:**
- Success: 리뷰 작성 완료, 업데이트 성공
- Error: 에러 메시지, 삭제 확인, 필수 입력 누락
- Warning: 주의 사항, 검토 필요
- Info: 도움말, 안내 메시지

---

### Neutral Colors (회색 - 텍스트, 배경, 테두리)

```css
gray: {
  50:  '#F6F8FA',  // 배경 - GitHub 스타일
  100: '#EAEEF2',  // 밝은 배경
  200: '#D0D7DE',  // 테두리 - 연한
  300: '#AFB8C1',  // 중간 연한 회색
  400: '#8C959F',  // Placeholder
  500: '#6E7781',  // 보조 텍스트
  600: '#57606A',  // 일반 텍스트
  700: '#424A53',  // 진한 텍스트
  800: '#32383F',  // 헤더 텍스트
  900: '#24292F',  // 가장 진함 - 주요 텍스트
}
```

**사용처:**
- 50-100: 배경 (body, card background)
- 200-300: 테두리 (border, divider)
- 400-500: 보조 텍스트 (placeholder, caption, 날짜)
- 600-900: 주요 텍스트 (본문, 제목, 리뷰 내용)

---

### 컬러 사용 규칙

```
✓ Primary 컬러: 메인 액션, CTA 버튼, 중요한 링크
✓ Secondary 컬러: 텍스트 링크, 보조 정보
✓ Semantic 컬러: 의미에 맞게 정확히 사용
✓ Gray: 텍스트, 배경, 테두리에 주로 사용
✓ 과도한 컬러 사용 지양 (혼란 방지)
```

---

## 📝 타이포그래피

### 폰트 패밀리

```css
/* Primary Font */
font-family:
  'Pretendard',
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  'Apple SD Gothic Neo',
  sans-serif;
```

**우선순위:**
1. Pretendard (한글 최적화)
2. 시스템 폰트 (폴백)

---

### 폰트 크기 (Font Size)

```css
/* Tailwind Classes */
text-xs:   12px  // Caption, 날짜, 작은 라벨
text-sm:   14px  // 보조 텍스트, 리뷰 메타 정보
text-base: 16px  // 기본 본문 텍스트 (리뷰 내용) ⭐
text-lg:   18px  // 강조 텍스트, 매장 이름
text-xl:   20px  // 서브 헤딩, 카드 제목
text-2xl:  24px  // 섹션 제목, 페이지 타이틀
text-3xl:  30px  // 페이지 메인 제목
text-4xl:  36px  // 랜딩 페이지 히어로
text-5xl:  48px  // 랜딩 페이지 대형 헤더
```

**사용 가이드:**
```
- 리뷰 본문: text-base (16px)
- 매장 이름: text-lg ~ text-xl
- 버튼: text-sm ~ text-base
- 제목: text-2xl ~ text-3xl
- 평점/날짜: text-sm
```

---

### 폰트 무게 (Font Weight)

```css
font-light:    300  // 거의 사용 안 함
font-normal:   400  // 일반 텍스트 (리뷰 내용) ⭐
font-medium:   500  // 강조, 버튼, 매장 이름
font-semibold: 600  // 제목, 중요 정보
font-bold:     700  // 주요 제목, 헤더
```

**사용 가이드:**
```
- 리뷰 본문: font-normal (400)
- 매장 이름: font-medium (500)
- 버튼: font-medium (500)
- 카드 제목: font-semibold (600)
- 페이지 제목: font-bold (700)
```

---

### 줄 간격 (Line Height)

```css
leading-none:   1      // 거의 사용 안 함
leading-tight:  1.25   // 제목
leading-snug:   1.375  //
leading-normal: 1.5    // 본문 텍스트 (리뷰) ⭐
leading-relaxed: 1.625 // 긴 리뷰 텍스트
leading-loose:  2      // 여유 있는 텍스트
```

---

## 📏 간격 시스템 (Spacing)

### 기본 단위: 4px

```css
/* Tailwind Classes */
0:   0px
0.5: 2px   // 1 * 0.5
1:   4px   // 1 * 4
1.5: 6px   // 1.5 * 4
2:   8px   // 2 * 4
3:   12px  // 3 * 4
4:   16px  // 4 * 4  ⭐ 기본
5:   20px  // 5 * 4
6:   24px  // 6 * 4  ⭐ 자주 사용
8:   32px  // 8 * 4  ⭐ 섹션 간격
10:  40px
12:  48px  ⭐ 큰 섹션 간격
16:  64px
20:  80px
24:  96px
```

---

### 사용 가이드

**컴포넌트 내부 (Padding):**
```
- Button: px-4 py-2 (16px, 8px)
- Input: px-3 py-2 (12px, 8px)
- Card (리뷰): p-6 (24px)
- Card (매장): p-4 (16px)
- Modal: p-8 (32px)
```

**컴포넌트 간격 (Margin/Gap):**
```
- 리뷰 항목 간: gap-4 (16px)
- 매장 카드 간: gap-6 (24px)
- 섹션 내: gap-4 (16px)
- 섹션 간: gap-8 (32px)
- 페이지 상단: mt-12 (48px)
```

**일관성 규칙:**
```
✓ 4의 배수 사용 (4, 8, 12, 16, 24, 32...)
✓ 2, 3은 미세 조정용
✓ 1은 거의 사용 안 함
```

---

## 🎭 그림자 & 테두리

### 그림자 (Shadow)

```css
/* Tailwind Classes */
shadow-sm:   0 1px 2px rgba(0,0,0,0.05)      // 미세한
shadow:      0 1px 3px rgba(0,0,0,0.1)       // 기본 ⭐
shadow-md:   0 4px 6px rgba(0,0,0,0.1)       // 중간 ⭐
shadow-lg:   0 10px 15px rgba(0,0,0,0.1)     // 큼
shadow-xl:   0 20px 25px rgba(0,0,0,0.1)     // 매우 큼
shadow-2xl:  0 25px 50px rgba(0,0,0,0.25)    // 모달
```

**사용처:**
```
- 리뷰 Card: shadow-sm
- 매장 Card: shadow-md
- Button (hover): shadow
- Modal: shadow-2xl
- Dropdown: shadow-lg
```

---

### 테두리 반경 (Border Radius)

```css
/* Tailwind Classes */
rounded-none: 0px
rounded-sm:   2px   // 거의 사용 안 함
rounded:      4px   // 작은 요소 ⭐
rounded-md:   6px   // 기본 (Input, 작은 버튼) ⭐
rounded-lg:   8px   // 버튼, 작은 카드 ⭐
rounded-xl:   12px  // 카드 (리뷰, 매장)
rounded-2xl:  16px  // 모달, 큰 컨테이너
rounded-full: 9999px // 원형 (아바타, 배지)
```

**사용처:**
```
- Button: rounded-md (6px)
- Input: rounded-md (6px)
- Card (리뷰/매장): rounded-xl (12px)
- Avatar: rounded-full
- Badge (평점): rounded-full
```

---

### 테두리 (Border)

```css
/* Width */
border:   1px   // 기본 ⭐
border-2: 2px   // 강조
border-4: 4px   // 매우 강조

/* Color */
border-gray-200  // 일반 테두리 (GitHub 스타일) ⭐
border-gray-300  // 약간 진한
border-primary-600 // 강조
```

**사용처:**
```
- Input: border border-[#d0d7de]
- Card: border border-[#d0d7de]
- Outline Button: border-2 border-primary-600
```

---

## ✨ 애니메이션 & 전환

### Duration (지속 시간)

```css
duration-75:   75ms   // 매우 빠름
duration-100:  100ms  // 빠름
duration-150:  150ms  // 기본 ⭐
duration-200:  200ms  // 보통
duration-300:  300ms  // 느림
duration-500:  500ms  // 매우 느림
```

**사용 가이드:**
```
- Hover 효과: duration-150
- 메뉴 열기/닫기: duration-200
- 모달: duration-300
- 페이지 전환: duration-500
```

---

### Easing (이징)

```css
ease-linear:     linear        // 일정한 속도
ease-in:         cubic-bezier(0.4, 0, 1, 1)
ease-out:        cubic-bezier(0, 0, 0.2, 1)
ease-in-out:     cubic-bezier(0.4, 0, 0.2, 1)  ⭐ 추천
```

**추천:**
```
대부분: ease-in-out (부드러운 시작과 끝)
```

---

### 자주 사용하는 transition

```css
/* Hover 효과 */
transition-colors duration-150 ease-in-out

/* 그림자 */
transition-shadow duration-150 ease-in-out

/* Transform */
transition-transform duration-200 ease-in-out

/* 전체 */
transition-all duration-150 ease-in-out
```

---

## 🧩 컴포넌트 스타일

### Button

#### Variants

```jsx
// Primary (메인 액션 - 리뷰 작성, 로그인)
bg-[#4DCDB3] hover:bg-[#3CB89F] text-white
border border-[#4DCDB3] hover:border-[#3CB89F]
transition-colors duration-150

// Secondary (보조 액션)
bg-[#f6f8fa] hover:bg-[#eaeef2] text-gray-900
border border-[#d0d7de]
transition-colors duration-150

// Outline (덜 중요한 액션)
border-2 border-[#4DCDB3] text-[#4DCDB3]
hover:bg-[#E8F9F6]
transition-colors duration-150

// Danger (삭제, 위험한 액션)
bg-[#cf222e] hover:bg-[#a40e26] text-white
border border-[#cf222e]
transition-colors duration-150

// Link (텍스트 링크)
text-[#2FA48B] hover:text-[#239076]
font-medium text-sm underline hover:no-underline
```

#### Sizes

```jsx
// Small
px-3 py-1.5 text-xs
rounded-md

// Medium (기본)
px-4 py-2.5 text-sm
rounded-md

// Large
px-5 py-3 text-base
rounded-md
```

#### States

```jsx
// Loading
opacity-70 cursor-not-allowed

// Disabled
opacity-50 cursor-not-allowed

// Focus
focus:outline-none focus:ring-2 focus:ring-[#4DCDB3] focus:ring-offset-2
```

---

### Input

```jsx
// 기본 스타일
w-full px-3 py-2
border border-[#d0d7de] rounded-md
text-sm text-gray-900 bg-white
placeholder:text-gray-500
focus:outline-none
focus:border-[#4DCDB3] focus:ring-1 focus:ring-[#4DCDB3]
transition-colors duration-150

// Error 상태
border-[#cf222e]
focus:border-[#cf222e] focus:ring-[#cf222e]

// Disabled
bg-gray-50 cursor-not-allowed opacity-50

// Label
text-sm font-medium text-gray-900 mb-1.5

// Error Message
text-xs text-[#cf222e] mt-1.5

// Helper Text
text-xs text-gray-600 mt-1
```

---

### Card

```jsx
// 리뷰 Card
bg-white rounded-xl border border-[#d0d7de] p-6
shadow-sm

// 매장 Card
bg-white rounded-xl border border-[#d0d7de] p-4
shadow-md hover:shadow-lg
transition-shadow duration-150

// Clickable Card
bg-white rounded-xl border border-[#d0d7de] p-4
cursor-pointer hover:border-gray-400
transition-all duration-150 hover:shadow-sm
```

---

### Badge

```jsx
// 기본
inline-flex items-center
px-2.5 py-0.5
rounded-full
text-xs font-medium

// Primary (높은 평점)
bg-[#E8F9F6] text-[#187B61]

// Success
bg-green-100 text-green-800

// Error (낮은 평점)
bg-red-100 text-red-800

// Gray (중립)
bg-gray-100 text-gray-800
```

---

### Avatar

```jsx
// 기본
w-10 h-10
rounded-full
bg-gray-200
overflow-hidden

// Sizes
w-8 h-8    // Small (리뷰 목록)
w-10 h-10  // Medium
w-12 h-12  // Large (프로필)
w-16 h-16  // XLarge
```

---

### Rating (평점 표시)

```jsx
// 별점 컨테이너
flex items-center gap-1

// 별 아이콘 (채워진)
text-[#4DCDB3]

// 별 아이콘 (빈)
text-gray-300

// 평점 숫자
text-sm font-medium text-gray-700 ml-2
```

---

## 📐 레이아웃

### Container

```jsx
// 최대 너비
max-w-7xl mx-auto  // 1280px (기본 - 메인 페이지)
max-w-6xl mx-auto  // 1152px
max-w-5xl mx-auto  // 1024px (리뷰 리스트)
max-w-4xl mx-auto  // 896px
max-w-3xl mx-auto  // 768px (리뷰 작성 폼)

// Padding
px-4 sm:px-6 lg:px-8  // 반응형 패딩
```

---

### 반응형 Breakpoints

```css
/* Tailwind 기본 */
sm:  640px   // 모바일 가로
md:  768px   // 태블릿
lg:  1024px  // 데스크톱
xl:  1280px  // 큰 데스크톱
2xl: 1536px  // 매우 큰 화면
```

**사용 예시:**
```jsx
// 모바일: 세로 스택
// 태블릿 이상: 가로 배치
flex flex-col md:flex-row

// 그리드 (매장 카드)
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

---

### 그리드 시스템

```jsx
// 리뷰 리스트 (세로 나열)
flex flex-col gap-4

// 매장 카드 그리드
grid gap-6
grid-cols-1           // 모바일: 1열
sm:grid-cols-2        // 작은 화면: 2열
md:grid-cols-3        // 중간: 3열
lg:grid-cols-4        // 큰 화면: 4열
```

---

## ♿ 접근성 (Accessibility)

### 색상 대비

```
✓ 본문 텍스트: gray-900 on white (AAA)
✓ 보조 텍스트: gray-600 on white (AA)
✓ 버튼: white on primary-500 (AAA)
✓ 링크: secondary-500 (AA)
```

**규칙:**
- 본문 텍스트: WCAG AAA (7:1)
- UI 요소: WCAG AA (4.5:1)

---

### 키보드 네비게이션

```jsx
// Focus visible
focus:outline-none focus:ring-2 focus:ring-[#4DCDB3]

// Tab index
tabIndex={0}  // 포커스 가능
tabIndex={-1} // 포커스 불가

// Skip to content
<a href="#main" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

---

### ARIA 레이블

```jsx
// 버튼
<button aria-label="Close menu">
  <XIcon />
</button>

// 평점
<div role="img" aria-label="평점 4.5점">
  {/* 별 아이콘 */}
</div>

// 입력
<input
  aria-label="Email address"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby="email-error"
/>

// 에러 메시지
<p id="email-error" role="alert">
  Invalid email
</p>
```

---

### 스크린 리더

```jsx
// 숨기기 (시각적으로만)
sr-only

// 보이기 (포커스 시)
sr-only focus:not-sr-only

// 로딩 상태
aria-live="polite"
aria-busy="true"
```

---

## 🎨 참고 디자인

### 벤치마크 사이트

```
✓ GitHub (github.com)
  - 깔끔하고 신뢰감 있는
  - 명확한 계층 구조
  - 일관된 컬러 시스템

✓ Airbnb (airbnb.com)
  - 리뷰 시스템 참고
  - 평점 표시 방식
  - 카드 레이아웃

✓ Google Maps
  - 지도 + 리스트 레이아웃
  - 매장 정보 표시
  - 리뷰 UI

✓ 당근마켓 (karrot.com)
  - 지역 기반 서비스
  - 친근한 UI
  - 커뮤니티 느낌

✓ Glassdoor (glassdoor.com)
  - 직장 리뷰 시스템
  - 다중 평점 카테고리
  - 리뷰 작성 UI
```

---

## 📋 체크리스트

### 새 컴포넌트 만들 때

```
□ 정의된 컬러 사용 (primary, secondary, gray, semantic)
□ 4px 기반 간격 사용
□ Tailwind 클래스 사용
□ 반응형 고려 (sm, md, lg)
□ Hover 효과 추가
□ Focus 상태 정의
□ 로딩/에러/비활성 상태
□ ARIA 레이블
□ 키보드 네비게이션
□ 부드러운 전환 효과
```

---

### 페이지 만들 때

```
□ Container 사용 (max-w-7xl)
□ 일관된 패딩 (px-4 sm:px-6 lg:px-8)
□ 반응형 레이아웃
□ 명확한 제목 계층 (h1 > h2 > h3)
□ 읽기 쉬운 줄 간격
□ 적절한 여백
□ 로딩 상태
□ 에러 처리
□ 빈 상태 (Empty state)
```

---

## 🚀 Quick Reference

### 자주 사용하는 조합

```jsx
// Primary Button (리뷰 작성, 로그인)
className="px-4 py-2.5 bg-[#4DCDB3] hover:bg-[#3CB89F] text-white font-medium text-sm rounded-md border border-[#4DCDB3] hover:border-[#3CB89F] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#4DCDB3] focus:ring-offset-2"

// Input (검색, 폼)
className="w-full px-3 py-2 border border-[#d0d7de] rounded-md text-sm text-gray-900 bg-white placeholder:text-gray-500 focus:outline-none focus:border-[#4DCDB3] focus:ring-1 focus:ring-[#4DCDB3] transition-colors duration-150"

// Card (리뷰, 매장)
className="bg-white rounded-xl border border-[#d0d7de] p-6 shadow-sm hover:shadow-md transition-shadow duration-150"

// Text (리뷰 본문)
className="text-base text-gray-700 leading-normal"

// Text (매장 이름)
className="text-lg font-medium text-gray-900"

// Text (제목)
className="text-2xl font-bold text-gray-900"

// Badge (평점)
className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E8F9F6] text-[#187B61]"

// Link (텍스트 링크)
className="text-[#2FA48B] hover:text-[#239076] font-medium text-sm underline hover:no-underline transition-colors duration-150"
```

---

**작성일**: 2025-12-11
**프로젝트**: WorkReview - 아르바이트 리뷰 플랫폼
**버전**: 2.0.0
