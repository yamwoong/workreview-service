# 🎨 UI Design Guide

> **workreview-service 디자인 시스템**  
> 업무 리뷰 및 평가 서비스를 위한 프로페셔널한 디자인 가이드

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
workreview-service는 업무 리뷰 및 평가를 효율적으로 관리하는 
프로페셔널한 엔터프라이즈 솔루션입니다.
```

### 타겟 사용자
- **HR 담당자**: 전사 리뷰 관리
- **팀 리더/매니저**: 팀원 평가 및 피드백
- **직원**: 자기평가 및 동료 리뷰

### 디자인 방향성
```
✓ 신뢰감 있는 (Trust) - 기업 업무용
✓ 직관적인 (Intuitive) - 쉬운 사용성
✓ 모던한 (Modern) - 최신 트렌드
✓ 프로페셔널한 (Professional) - 진지한 업무
✓ 깔끔한 (Clean) - 불필요한 요소 제거
```

### 디자인 키워드
```
신뢰, 효율, 명확성, 전문성, 협업
```

---

## 🎨 컬러 시스템

### Primary Color (블루 - 신뢰감)

```css
/* Tailwind Config */
primary: {
  50:  '#EFF6FF',  // 가장 밝음 - 배경
  100: '#DBEAFE',  // 매우 밝음 - hover 배경
  200: '#BFDBFE',  // 밝음
  300: '#93C5FD',  // 
  400: '#60A5FA',  // 
  500: '#3B82F6',  // 기본 - 메인 컬러 ⭐
  600: '#2563EB',  // 진함 - 버튼, 링크
  700: '#1D4ED8',  // 더 진함 - hover
  800: '#1E40AF',  // 
  900: '#1E3A8A',  // 가장 진함
}
```

**사용처:**
- 메인 버튼 (CTA)
- 링크
- 강조 요소
- 활성 상태 (active, selected)

---

### Secondary Color (퍼플 - 창의성)

```css
secondary: {
  50:  '#FAF5FF',
  100: '#F3E8FF',
  200: '#E9D5FF',
  300: '#D8B4FE',
  400: '#C084FC',
  500: '#A855F7',  // 기본 ⭐
  600: '#9333EA',  // 사용 추천
  700: '#7E22CE',
  800: '#6B21A8',
  900: '#581C87',
}
```

**사용처:**
- 보조 액션 버튼
- 배지 (Badge)
- 아이콘 강조
- 특별한 상태 표시

---

### Semantic Colors (의미 있는 색상)

```css
/* Success - 초록 */
success: {
  50:  '#F0FDF4',
  500: '#10B981',  // 기본 ⭐
  600: '#059669',  // 진함
  700: '#047857',
}

/* Error - 빨강 */
error: {
  50:  '#FEF2F2',
  500: '#EF4444',  // 기본 ⭐
  600: '#DC2626',
  700: '#B91C1C',
}

/* Warning - 주황 */
warning: {
  50:  '#FFFBEB',
  500: '#F59E0B',  // 기본 ⭐
  600: '#D97706',
  700: '#B45309',
}

/* Info - 하늘색 */
info: {
  50:  '#F0F9FF',
  500: '#06B6D4',  // 기본 ⭐
  600: '#0891B2',
  700: '#0E7490',
}
```

**사용처:**
- Success: 성공 메시지, 완료 상태
- Error: 에러 메시지, 삭제 버튼
- Warning: 경고 메시지, 주의 필요
- Info: 정보 알림, 도움말

---

### Neutral Colors (회색 - 텍스트, 배경, 테두리)

```css
gray: {
  50:  '#F9FAFB',  // 배경
  100: '#F3F4F6',  // 카드 배경
  200: '#E5E7EB',  // 테두리
  300: '#D1D5DB',  // 비활성 테두리
  400: '#9CA3AF',  // Placeholder
  500: '#6B7280',  // 보조 텍스트
  600: '#4B5563',  // 일반 텍스트
  700: '#374151',  // 진한 텍스트
  800: '#1F2937',  // 헤더 텍스트
  900: '#111827',  // 가장 진함 - 주요 텍스트
}
```

**사용처:**
- 50-100: 배경 (body, card)
- 200-300: 테두리 (border, divider)
- 400-500: 보조 텍스트 (placeholder, caption)
- 600-900: 주요 텍스트 (body, heading)

---

### 컬러 사용 규칙

```
✓ Primary 컬러: 메인 액션에만 사용 (버튼, 링크)
✓ Secondary 컬러: 보조 액션, 강조
✓ Semantic 컬러: 의미에 맞게 정확히 사용
✓ Gray: 텍스트, 배경, 테두리에 주로 사용
✓ 너무 많은 컬러 사용 금지 (혼란 방지)
```

---

## 📝 타이포그래피

### 폰트 패밀리

```css
/* Primary Font */
font-family: 
  'Inter', 
  'Pretendard', 
  -apple-system, 
  BlinkMacSystemFont, 
  'Segoe UI', 
  'Apple SD Gothic Neo',
  sans-serif;
```

**우선순위:**
1. Inter (웹폰트 - 영문)
2. Pretendard (한글 최적화)
3. 시스템 폰트 (폴백)

---

### 폰트 크기 (Font Size)

```css
/* Tailwind Classes */
text-xs:   12px  // Caption, 작은 라벨
text-sm:   14px  // 보조 텍스트, 설명
text-base: 16px  // 기본 본문 텍스트 ⭐
text-lg:   18px  // 강조 텍스트
text-xl:   20px  // 서브 헤딩
text-2xl:  24px  // 섹션 제목
text-3xl:  30px  // 페이지 제목
text-4xl:  36px  // 메인 타이틀
text-5xl:  48px  // 랜딩 페이지 헤더
```

**사용 가이드:**
```
- 본문: text-base (16px)
- 버튼: text-sm ~ text-base
- 제목: text-2xl ~ text-3xl
- 입력 필드: text-sm ~ text-base
```

---

### 폰트 무게 (Font Weight)

```css
font-light:    300  // 거의 사용 안 함
font-normal:   400  // 일반 텍스트 ⭐
font-medium:   500  // 강조, 버튼
font-semibold: 600  // 제목, 중요 텍스트
font-bold:     700  // 주요 제목, 헤더
```

**사용 가이드:**
```
- 본문: font-normal (400)
- 버튼: font-medium (500)
- 서브 헤딩: font-semibold (600)
- 페이지 제목: font-bold (700)
```

---

### 줄 간격 (Line Height)

```css
leading-none:   1      // 거의 사용 안 함
leading-tight:  1.25   // 제목
leading-snug:   1.375  // 
leading-normal: 1.5    // 본문 텍스트 ⭐
leading-relaxed: 1.625 // 긴 텍스트
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
- Input: px-4 py-2
- Card: p-6 (24px)
- Modal: p-8 (32px)
```

**컴포넌트 간격 (Margin/Gap):**
```
- 같은 그룹: gap-2 (8px)
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
- Card: shadow-md
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
rounded-md:   6px   // 기본 ⭐
rounded-lg:   8px   // 카드, 버튼 ⭐
rounded-xl:   12px  // 큰 카드
rounded-2xl:  16px  // 모달
rounded-full: 9999px // 원형 (아바타)
```

**사용처:**
```
- Button: rounded-lg (8px)
- Input: rounded-md (6px)
- Card: rounded-xl (12px)
- Avatar: rounded-full
- Badge: rounded-full
```

---

### 테두리 (Border)

```css
/* Width */
border:   1px   // 기본 ⭐
border-2: 2px   // 강조
border-4: 4px   // 매우 강조

/* Color */
border-gray-200  // 일반 테두리 ⭐
border-gray-300  // 약간 진한
border-primary-600 // 강조
```

**사용처:**
```
- Input: border border-gray-300
- Card: border-0 (그림자만)
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
// Primary (메인 액션)
bg-primary-600 hover:bg-primary-700 text-white
shadow hover:shadow-md
transition-all duration-150

// Secondary (보조 액션)
bg-gray-200 hover:bg-gray-300 text-gray-800
transition-colors duration-150

// Outline (덜 중요한 액션)
border-2 border-primary-600 text-primary-600
hover:bg-primary-50
transition-colors duration-150

// Ghost (미니멀한 액션)
text-gray-700 hover:bg-gray-100
transition-colors duration-150
```

#### Sizes

```jsx
// Small
px-3 py-1.5 text-sm
rounded-md

// Medium (기본)
px-4 py-2 text-base
rounded-lg

// Large
px-6 py-3 text-lg
rounded-lg
```

#### States

```jsx
// Loading
opacity-70 cursor-not-allowed

// Disabled
opacity-50 cursor-not-allowed

// Focus
focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
```

---

### Input

```jsx
// 기본 스타일
w-full px-4 py-2
border border-gray-300 rounded-md
text-base
focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
transition-colors duration-150

// Error 상태
border-red-500
focus:ring-red-500

// Disabled
bg-gray-100 cursor-not-allowed opacity-50

// Label
text-sm font-medium text-gray-700 mb-1

// Error Message
text-sm text-red-600 mt-1
```

---

### Card

```jsx
// 기본
bg-white rounded-xl shadow-md p-6
border-0

// Hover 효과
hover:shadow-lg
transition-shadow duration-150

// Padding variants
p-4  // Small
p-6  // Medium (기본)
p-8  // Large
```

---

### Badge

```jsx
// 기본
inline-flex items-center
px-2.5 py-0.5
rounded-full
text-xs font-medium

// Primary
bg-primary-100 text-primary-800

// Success
bg-green-100 text-green-800

// Error
bg-red-100 text-red-800

// Gray
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
w-8 h-8    // Small
w-10 h-10  // Medium
w-12 h-12  // Large
w-16 h-16  // XLarge
```

---

## 📐 레이아웃

### Container

```jsx
// 최대 너비
max-w-7xl mx-auto  // 1280px (기본)
max-w-6xl mx-auto  // 1152px
max-w-5xl mx-auto  // 1024px
max-w-4xl mx-auto  // 896px

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

// 그리드
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

---

### 그리드 시스템

```jsx
// 기본 그리드
grid gap-6

// 반응형 컬럼
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
✓ 버튼: white on primary-600 (AAA)
✓ 링크: primary-600 (AA)
```

**규칙:**
- 본문 텍스트: WCAG AAA (7:1)
- UI 요소: WCAG AA (4.5:1)

---

### 키보드 네비게이션

```jsx
// Focus visible
focus:outline-none focus:ring-2 focus:ring-primary-500

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
✓ Linear (linear.app)
  - 미니멀하고 세련된
  - 부드러운 애니메이션
  - 깔끔한 타이포그래피

✓ Notion (notion.so)
  - 직관적인 UI
  - 명확한 계층 구조
  - 사용하기 쉬움

✓ Vercel (vercel.com)
  - 모던한 그라디언트
  - 대담한 타이포그래피
  - 미래지향적

✓ Stripe (stripe.com)
  - 프로페셔널한
  - 신뢰감 있는
  - 깔끔한 레이아웃

✓ Supabase (supabase.com)
  - 개발자 친화적
  - 다크 모드
  - 모던한 느낌
```

---

## 📋 체크리스트

### 새 컴포넌트 만들 때

```
□ 정의된 컬러 사용 (primary, gray, semantic)
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
// Primary Button
className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"

// Input
className="w-full px-4 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-150"

// Card
className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-150"

// Text (Body)
className="text-base text-gray-700 leading-normal"

// Text (Heading)
className="text-2xl font-bold text-gray-900"
```

---

**작성일**: 2025-11-27  
**프로젝트**: workreview-service  
**버전**: 1.0.0
