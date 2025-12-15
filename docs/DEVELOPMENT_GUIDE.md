# 개발 가이드

> **Claude Code + Cursor를 활용한 WorkReview 개발 워크플로우**

## 📋 목차

1. [개발 도구 소개](#개발-도구-소개)
2. [언제 어떤 도구를 사용할까](#언제-어떤-도구를-사용할까)
3. [개발 워크플로우](#개발-워크플로우)
4. [실전 시나리오별 가이드](#실전-시나리오별-가이드)
5. [베스트 프랙티스](#베스트-프랙티스)
6. [문서 활용법](#문서-활용법)
7. [트러블슈팅](#트러블슈팅)

---

## 개발 도구 소개

### 🤖 Claude Code (CLI)

**강점**:
- ✅ **프로젝트 전체 관점**: 여러 파일을 동시에 분석하고 수정
- ✅ **아키텍처 설계**: 전체 구조 파악 및 설계 결정
- ✅ **코드 리뷰**: 일관성, 베스트 프랙티스 검증
- ✅ **문서 작성**: 종합적인 문서 작성 및 업데이트
- ✅ **자동화**: 반복 작업 자동화, 스크립트 생성
- ✅ **디버깅 및 분석**: 복잡한 버그 추적, 로그 분석

**약점**:
- ❌ 실시간 UI 프리뷰 없음
- ❌ 즉각적인 피드백 제한적

**주요 사용처**:
```
- 백엔드 API 구현
- 데이터베이스 스키마 설계
- 복잡한 비즈니스 로직 구현
- 프로젝트 구조 리팩토링
- 코드 리뷰 및 최적화
- 문서 작성 및 업데이트
- 테스트 코드 작성
```

---

### 🎨 Cursor (IDE)

**강점**:
- ✅ **실시간 UI 피드백**: 변경 사항 즉시 확인
- ✅ **빠른 프로토타이핑**: UI/UX 빠르게 시도
- ✅ **디자인 작업**: 스타일, 레이아웃 조정
- ✅ **직관적 편집**: 파일 내 특정 부분만 빠르게 수정
- ✅ **비주얼 디버깅**: UI 버그 즉시 확인

**약점**:
- ❌ 전체 프로젝트 관점 제한적
- ❌ 복잡한 로직 구현에는 부담

**주요 사용처**:
```
- 프론트엔드 UI/UX 개발
- 스타일 조정 (Tailwind CSS)
- 레이아웃 구성
- 컴포넌트 디자인
- 즉각적인 버그 수정
- 프로토타입 작성
```

---

## 언제 어떤 도구를 사용할까

### 📊 작업별 도구 선택 가이드

| 작업 유형 | 추천 도구 | 이유 |
|----------|-----------|------|
| **백엔드 API 개발** | 🤖 Claude Code | 다중 파일 작업, 비즈니스 로직, 데이터베이스 연동 |
| **프론트엔드 UI 개발** | 🎨 Cursor | 실시간 프리뷰, 빠른 스타일 조정 |
| **컴포넌트 스타일링** | 🎨 Cursor | Tailwind 클래스 조정, 즉각적 확인 |
| **복잡한 로직 구현** | 🤖 Claude Code | 전체 구조 파악, 아키텍처 설계 |
| **코드 리뷰** | 🤖 Claude Code | 프로젝트 전체 일관성 검증 |
| **문서 작성** | 🤖 Claude Code | 종합적 분석 및 작성 |
| **빠른 버그 수정** | 🎨 Cursor | 즉각적 수정 및 확인 |
| **테스트 코드 작성** | 🤖 Claude Code | 엣지 케이스 고려, 체계적 작성 |
| **리팩토링** | 🤖 Claude Code | 다중 파일 수정, 의존성 파악 |
| **프로토타입** | 🎨 Cursor | 빠른 시도, 즉시 확인 |

---

### 🔄 협업 패턴

#### Pattern 1: Cursor 주도 → Claude 검증
```
1. Cursor에서 UI 빠르게 개발
2. Claude Code로 코드 리뷰 및 개선
3. Cursor에서 피드백 반영
```

**적합한 경우**: UI/UX 작업, 프로토타이핑

---

#### Pattern 2: Claude 주도 → Cursor 마무리
```
1. Claude Code로 전체 구조 설계 및 구현
2. Cursor에서 세부 스타일 조정
3. Claude Code로 최종 검증
```

**적합한 경우**: 백엔드 API, 복잡한 비즈니스 로직

---

#### Pattern 3: 병렬 작업
```
1. Claude Code로 백엔드 API 개발
2. 동시에 Cursor로 프론트엔드 UI 개발
3. 통합 후 Claude Code로 전체 검증
```

**적합한 경우**: 독립적인 프론트/백엔드 작업

---

## 개발 워크플로우

### 🚀 새 기능 개발 (Full Cycle)

#### Step 1: 계획 및 설계 (Claude Code)

**프롬프트 예시**:
```
@docs/PRD.md
@docs/DATABASE_SCHEMA.md
@docs/API_SPEC.md

지도 페이지 기능을 구현하려고 해.

다음 순서로 작업해줘:

1. 백엔드 API 먼저 구현
   - Store 모델 생성
   - Geospatial 인덱스 설정
   - GET /api/stores 엔드포인트 구현
   - 주변 매장 검색 로직

2. 구현 완료되면 알려줘
```

**Claude의 역할**:
- 전체 아키텍처 설계
- 필요한 파일 및 의존성 파악
- 단계별 구현 계획 수립

---

#### Step 2: 백엔드 구현 (Claude Code)

**프롬프트 예시**:
```
Store 모델을 구현해줘.

요구사항:
- Geospatial 인덱스 (2dsphere)
- 평균 평점 자동 계산
- 리뷰 개수 자동 업데이트
- Virtual 필드 활용

DATABASE_SCHEMA.md를 참고해서 정확히 구현해줘.
```

**Claude의 작업**:
- `backend/src/models/Store.model.ts` 생성
- Mongoose 스키마 정의
- Pre/Post hooks 구현
- Index 설정

---

#### Step 3: API 엔드포인트 구현 (Claude Code)

**프롬프트 예시**:
```
GET /api/stores 엔드포인트를 구현해줘.

기능:
- 위도/경도 기준 주변 매장 검색
- 반경 필터링 (기본 5km)
- 카테고리 필터링
- 페이지네이션

API_SPEC.md를 참고해서 구현해줘.
```

**Claude의 작업**:
- Controller 생성
- Service 로직 구현
- Validation 추가
- 라우트 등록

---

#### Step 4: 테스트 (Claude Code)

**프롬프트 예시**:
```
Store API에 대한 테스트 코드를 작성해줘.

테스트 케이스:
- 주변 매장 조회 성공
- 반경 필터링 동작 확인
- 카테고리 필터링 동작 확인
- 페이지네이션 동작 확인
- 잘못된 파라미터 처리
```

---

#### Step 5: 프론트엔드 UI 개발 (Cursor)

**프롬프트 예시**:
```
@docs/PAGE_STRUCTURE.md
@docs/UI_DESIGN_GUIDE.md

지도 페이지를 만들어줘.

요구사항:
- Kakao Map API 연동
- 왼쪽: 지도 (70%), 오른쪽: 매장 리스트 (30%)
- 반경 및 카테고리 필터
- UI_DESIGN_GUIDE의 컬러 및 스타일 적용

실시간으로 확인하면서 작업할게.
```

**Cursor의 작업**:
- `frontend/src/pages/MapPage.tsx` 생성
- Kakao Map 컴포넌트 통합
- UI 레이아웃 구성
- 스타일 적용

---

#### Step 6: 스타일 조정 (Cursor)

**프롬프트 예시**:
```
지도 페이지 스타일을 조정하고 싶어.

변경사항:
- 매장 리스트 카드 간격 늘리기
- 필터 버튼 색상 변경 (Primary 색상)
- 반응형: 모바일에서 탭 전환 방식으로
```

**Cursor의 작업**:
- Tailwind 클래스 조정
- 실시간 확인하며 미세 조정

---

#### Step 7: 통합 및 검증 (Claude Code)

**프롬프트 예시**:
```
@frontend/src/pages/MapPage.tsx
@backend/src/controllers/store.controller.ts
@docs/API_SPEC.md

지도 페이지를 검토해줘:

1. API 호출이 정확한지
2. 에러 처리가 되어있는지
3. 로딩 상태 표시가 있는지
4. UI_DESIGN_GUIDE 스타일이 적용되었는지
5. 코드 품질 (타입, 네이밍, 구조)

개선 사항 있으면 제안해줘.
```

**Claude의 작업**:
- 전체 코드 리뷰
- 일관성 검증
- 개선 사항 제안

---

### 🔧 버그 수정 워크플로우

#### 간단한 UI 버그 (Cursor)

**시나리오**: "버튼 색상이 이상해요"

```
1. Cursor 열기
2. 해당 파일 열기
3. Composer에서:
   "이 버튼 색상을 Primary 색상으로 변경해줘"
4. 즉시 확인 및 수정
```

---

#### 복잡한 로직 버그 (Claude Code)

**시나리오**: "리뷰 평점 계산이 안 맞아요"

```
1. Claude Code 실행
2. 프롬프트:
   @backend/src/models/Review.model.ts
   @backend/src/models/Store.model.ts

   리뷰 저장 시 매장 평균 평점이 제대로 업데이트되지 않는 버그가 있어.

   문제 원인 찾아서 수정해줘:
   1. Review post-save hook 확인
   2. Store 평균 계산 로직 확인
   3. Aggregation 파이프라인 검증

3. Claude가 원인 분석 및 수정
4. 테스트 코드로 검증
```

---

## 실전 시나리오별 가이드

### 📱 시나리오 1: 새 페이지 추가

**목표**: 리뷰 작성 페이지 만들기

#### Step 1: 설계 (Claude Code)

```bash
# Claude Code CLI 실행
claude

# 프롬프트
@docs/PAGE_STRUCTURE.md
@docs/API_SPEC.md

리뷰 작성 페이지 구현을 시작하려고 해.

먼저 다음을 확인해줘:
1. 필요한 API 엔드포인트가 있는지
2. 필요한 컴포넌트가 있는지
3. 구현 순서 제안

그 다음 백엔드 API부터 구현할게.
```

---

#### Step 2: 백엔드 API 구현 (Claude Code)

```
POST /api/stores/:storeId/reviews 엔드포인트를 구현해줘.

기능:
- 4가지 평점 받기 (salary, restTime, workEnv, management)
- 평균 평점 자동 계산
- 리뷰 내용 validation (최소 10자)
- 중복 리뷰 방지 (한 매장당 1개만)
- Store의 평균 평점 자동 업데이트

구현 후 테스트 코드도 작성해줘.
```

---

#### Step 3: 프론트엔드 폼 UI (Cursor)

```
@docs/PAGE_STRUCTURE.md - 리뷰 작성 페이지 레이아웃 참고
@docs/UI_DESIGN_GUIDE.md - 스타일 가이드

ReviewWritePage를 만들어줘.

요구사항:
- 4가지 평점 별점 입력 (클릭으로 선택)
- Textarea 리뷰 내용
- 근무 기간 날짜 선택
- 직책 입력
- React Hook Form + Zod validation
- Primary 버튼 스타일

실시간으로 보면서 조정할게.
```

---

#### Step 4: 스타일 미세 조정 (Cursor)

```
리뷰 작성 페이지 스타일 조정:

- 별점 아이콘 크기 키우기
- 입력 필드 간격 넓히기
- 버튼을 전체 너비로
- 에러 메시지 색상 Error 색상으로
```

---

#### Step 5: 통합 검증 (Claude Code)

```
@frontend/src/pages/ReviewWritePage.tsx
@backend/src/controllers/review.controller.ts

리뷰 작성 기능 전체를 검토해줘:

1. API 호출 로직
2. 에러 처리
3. 성공 시 리다이렉트
4. Validation 규칙
5. 코드 품질

개선 사항 있으면 제안해줘.
```

---

### 🎨 시나리오 2: UI 디자인 변경

**목표**: 로그인 페이지 스타일 전면 개편

#### Step 1: 참고 자료 준비 (Claude Code)

```
@docs/UI_DESIGN_GUIDE.md
@frontend/src/pages/auth/LoginPage.tsx

현재 로그인 페이지를 분석해서:
1. 적용되지 않은 디자인 가이드 요소
2. 개선 가능한 스타일 포인트
3. 접근성 이슈

리스트로 정리해줘.
```

---

#### Step 2: Cursor로 UI 변경

```
[참고 이미지 첨부 - GitHub 로그인 페이지 스타일]

@docs/UI_DESIGN_GUIDE.md
@frontend/src/pages/auth/LoginPage.tsx

이 참고 이미지처럼 로그인 페이지를 재디자인해줘:

적용사항:
- 중앙 정렬 카드 레이아웃
- Primary 버튼 스타일 (#4DCDB3)
- Input 스타일 (border-[#d0d7de])
- 깔끔한 간격 및 여백
- 반응형 디자인

실시간으로 확인하면서 조정할게.
```

---

#### Step 3: 세부 조정 (Cursor)

```
몇 가지만 더 조정하자:

- 버튼 호버 효과 더 부드럽게
- 입력 필드 focus 시 테두리 색상 Primary로
- 에러 메시지 위치 조정 (입력 필드 바로 아래)
- 모바일에서 패딩 줄이기
```

---

#### Step 4: 일관성 검증 (Claude Code)

```
@frontend/src/pages/auth/LoginPage.tsx
@docs/UI_DESIGN_GUIDE.md

로그인 페이지가 디자인 가이드를 따르는지 검증해줘:

체크 항목:
1. 컬러 팔레트 (Primary, Gray 등)
2. Typography (폰트 크기, 굵기)
3. Spacing (간격이 4px 배수인지)
4. Button/Input 스타일
5. Border Radius
6. Shadow

가이드와 다른 부분 있으면 알려줘.
```

---

### 🔍 시나리오 3: 버그 수정

**목표**: 매장 평점 계산 버그 수정

#### Step 1: 문제 파악 (Claude Code)

```
@backend/src/models/Review.model.ts
@backend/src/models/Store.model.ts
@backend/src/controllers/review.controller.ts

리뷰를 작성하면 매장 평균 평점이 업데이트되어야 하는데,
가끔 업데이트가 안 되는 것 같아.

문제 원인을 찾아줘:
1. Review post-save hook 로직 확인
2. Store 평균 계산 Aggregation 검증
3. Transaction 처리 확인
4. 에러 핸들링 확인

원인 찾으면 수정 방법 제안해줘.
```

---

#### Step 2: 수정 및 테스트 (Claude Code)

```
문제 원인 확인했어.

수정해줘:
1. Review post-save hook에서 에러 핸들링 추가
2. Aggregation 파이프라인 수정
3. 실패 시 로깅 추가

그리고 테스트 코드도 추가해줘:
- 리뷰 저장 후 평점 업데이트 확인
- 여러 리뷰 저장 시 정확한 평균 계산 확인
- 에러 발생 시 롤백 확인
```

---

#### Step 3: 검증 (Bash + Claude)

```bash
# Claude Code에서 테스트 실행
npm test -- review.controller.test.ts

# 결과 확인 후 프롬프트
테스트 결과를 보고 추가로 수정할 부분 있는지 확인해줘.
```

---

### 📦 시나리오 4: 리팩토링

**목표**: 공통 컴포넌트 추출

#### Step 1: 중복 코드 찾기 (Claude Code)

```
@frontend/src/pages/auth/LoginPage.tsx
@frontend/src/pages/auth/RegisterPage.tsx
@frontend/src/pages/ReviewWritePage.tsx

이 페이지들에서 중복되는 Input, Button 패턴을 찾아서
공통 컴포넌트로 추출할 수 있는지 분석해줘.

추출 가능한 컴포넌트:
1. 목록 나열
2. props 인터페이스 정의
3. 사용 예시
```

---

#### Step 2: 공통 컴포넌트 구현 (Claude Code)

```
Input, Button 공통 컴포넌트를 만들어줘.

요구사항:
- TypeScript strict 모드
- UI_DESIGN_GUIDE 스타일 적용
- 다양한 variants (primary, secondary, danger 등)
- 다양한 sizes (sm, md, lg)
- 접근성 (ARIA 레이블)
- React Hook Form과 호환

위치:
- frontend/src/components/common/Input.tsx
- frontend/src/components/common/Button.tsx
```

---

#### Step 3: 기존 페이지 리팩토링 (Claude Code)

```
LoginPage, RegisterPage, ReviewWritePage에서
기존 inline 스타일을 제거하고 새로 만든 공통 컴포넌트를 사용하도록
리팩토링해줘.

주의사항:
- 기능 변경 없이 순수하게 리팩토링만
- 기존 validation 로직 유지
- 스타일 100% 동일하게
```

---

#### Step 4: 스타일 확인 (Cursor)

```
리팩토링 후 LoginPage를 열어서 스타일이 이전과 동일한지 확인해줘.

다르면 공통 컴포넌트 스타일을 조정해줘.
```

---

## 베스트 프랙티스

### ✅ Claude Code 사용 시

#### DO
```
✓ 명확한 프롬프트 작성
  - 목표, 요구사항, 제약사항 명시
  - 참조할 문서 @mention

✓ 문서 참조 적극 활용
  @docs/API_SPEC.md
  @docs/DATABASE_SCHEMA.md

✓ 한 번에 한 가지 작업
  - 단계별로 진행
  - 검증 후 다음 단계

✓ 코드 리뷰 요청
  "이 코드 리뷰해줘"
  "개선 사항 제안해줘"

✓ 테스트 코드 함께 요청
  "테스트 코드도 작성해줘"
```

#### DON'T
```
✗ 모호한 프롬프트
  "뭔가 이상해" (X)
  → "리뷰 평점 계산이 안 맞아" (O)

✗ 너무 많은 작업 한꺼번에
  "백엔드 API 10개 만들어줘" (X)
  → "Store API부터 하나씩 만들자" (O)

✗ UI 디자인 작업
  Cursor가 더 효율적

✗ 문서 없이 복잡한 요청
  참조 문서 함께 제공
```

---

### ✅ Cursor 사용 시

#### DO
```
✓ UI/UX 작업에 집중
  - 스타일 조정
  - 레이아웃 변경
  - 프로토타입

✓ 실시간 확인하며 작업
  - 변경 → 확인 → 조정 반복

✓ 디자인 가이드 참조
  @docs/UI_DESIGN_GUIDE.md

✓ 작은 단위로 변경
  - 즉각 확인 가능
  - 롤백 쉬움
```

#### DON'T
```
✗ 복잡한 비즈니스 로직
  Claude Code가 더 적합

✗ 다중 파일 리팩토링
  전체 구조 파악 어려움

✗ 테스트 코드 작성
  Claude Code가 더 체계적
```

---

### 🔄 협업 워크플로우 팁

#### 1. 역할 분담 명확히
```
Claude Code: 설계, 로직, 구조
Cursor: UI, 스타일, 프로토타입
```

#### 2. 단계적 진행
```
1. Claude Code로 기반 구축
2. Cursor로 UI 다듬기
3. Claude Code로 최종 검증
```

#### 3. 문서 중심 소통
```
- 항상 docs/ 문서 참조
- 문서 업데이트 즉시 반영
- 일관성 유지
```

#### 4. 검증 습관화
```
- 구현 후 반드시 검토
- 테스트 코드 작성
- 코드 리뷰 요청
```

---

## 문서 활용법

### 📚 주요 문서 및 활용법

#### PRD.md
```
언제: 새 기능 개발 시작 전
목적: 요구사항 확인, 기능 범위 파악
프롬프트:
  @docs/PRD.md

  리뷰 작성 기능을 구현하려고 해.
  PRD에 명시된 요구사항을 확인해줘.
```

---

#### DATABASE_SCHEMA.md
```
언제: 모델 생성 또는 수정 시
목적: 스키마 정의, 관계 파악
프롬프트:
  @docs/DATABASE_SCHEMA.md

  Review 모델을 구현해줘.
  DATABASE_SCHEMA의 정의를 정확히 따라서.
```

---

#### API_SPEC.md
```
언제: API 구현 또는 호출 시
목적: 엔드포인트, 요청/응답 형식 확인
프롬프트:
  @docs/API_SPEC.md

  GET /api/stores 엔드포인트를 구현해줘.
  API_SPEC의 명세를 따라서.
```

---

#### UI_DESIGN_GUIDE.md
```
언제: UI/스타일 작업 시
목적: 일관된 디자인 적용
프롬프트:
  @docs/UI_DESIGN_GUIDE.md

  리뷰 작성 페이지 스타일을 적용해줘.
  UI_DESIGN_GUIDE의 컬러, 버튼, Input 스타일 사용.
```

---

#### PAGE_STRUCTURE.md
```
언제: 새 페이지 추가 시
목적: 페이지 레이아웃, 라우팅 확인
프롬프트:
  @docs/PAGE_STRUCTURE.md

  지도 페이지를 만들어줘.
  PAGE_STRUCTURE의 레이아웃을 따라서.
```

---

### 📝 문서 업데이트 타이밍

```
1. 새 기능 추가 후
   → PRD.md 업데이트
   → PAGE_STRUCTURE.md 업데이트

2. 스키마 변경 후
   → DATABASE_SCHEMA.md 업데이트

3. API 추가/변경 후
   → API_SPEC.md 업데이트

4. 디자인 시스템 변경 후
   → UI_DESIGN_GUIDE.md 업데이트
```

**프롬프트 예시**:
```
@docs/API_SPEC.md

POST /api/stores/:storeId/reviews 엔드포인트를 추가했어.

API_SPEC.md를 업데이트해줘:
- 엔드포인트 추가
- 요청/응답 예시
- 에러 코드
- 프론트엔드 통합 예시
```

---

## 트러블슈팅

### ❓ 자주 묻는 질문

#### Q1. Claude Code vs Cursor, 어느 것부터 시작?

**A**: 작업 유형에 따라 다름

**백엔드 작업**: Claude Code 먼저
```
1. Claude Code: API 구현
2. Claude Code: 테스트 작성
3. Cursor: 프론트엔드 통합
```

**프론트엔드 작업**: Cursor 먼저 가능
```
1. Cursor: UI 프로토타입
2. Claude Code: 코드 리뷰 및 개선
3. Cursor: 피드백 반영
```

---

#### Q2. 두 도구가 충돌하면?

**A**: 파일 수정 순서 정리

```
1. Git commit 먼저
2. 한 번에 하나의 도구만 사용
3. 변경 완료 후 다른 도구로 전환
```

**팁**:
- 각 도구에서 작업 완료 시 즉시 커밋
- 충돌 발생 시 Git으로 해결

---

#### Q3. 문서와 코드가 불일치하면?

**A**: 코드가 정답, 문서 즉시 업데이트

```
1. 코드 확인
2. Claude Code로 문서 업데이트 요청
3. 팀원과 공유
```

**프롬프트**:
```
@backend/src/models/Store.model.ts
@docs/DATABASE_SCHEMA.md

Store 모델 코드와 DATABASE_SCHEMA.md가 다른 것 같아.
코드를 기준으로 문서를 업데이트해줘.
```

---

#### Q4. 어떤 작업을 Claude에게 맡기기 어려운가?

**답**:
- 매우 특수한 비즈니스 로직 (도메인 지식 필요)
- 실시간 디버깅 (콘솔 로그 직접 확인 필요)
- 성능 프로파일링 (실제 측정 필요)

**해결**:
- 명확한 요구사항 제공
- 단계별로 나눠서 요청
- 검증 과정 추가

---

#### Q5. 너무 많은 파일을 한 번에 수정하면?

**A**: 작업 분할

**나쁜 예**:
```
모든 페이지를 한 번에 리팩토링해줘 (X)
```

**좋은 예**:
```
LoginPage부터 리팩토링해줘.
완료되면 다음 페이지 시작할게. (O)
```

---

### 🐛 일반적인 문제 해결

#### 문제 1: Claude가 오래된 정보 사용

**증상**: 최신 코드 변경을 반영하지 못함

**해결**:
```
@파일경로
최신 코드는 이렇게 변경되었어.
[코드 붙여넣기]
이걸 기준으로 작업해줘.
```

---

#### 문제 2: Cursor에서 복잡한 로직 요청

**증상**: 결과가 부정확하거나 일관성 없음

**해결**: Claude Code로 전환
```
1. Cursor 작업 중단
2. Claude Code에서 로직 구현
3. 완료 후 Cursor에서 UI만 조정
```

---

#### 문제 3: 스타일이 가이드와 다름

**증상**: 디자인 가이드를 따르지 않음

**해결**:
```
@docs/UI_DESIGN_GUIDE.md

이 컴포넌트가 UI_DESIGN_GUIDE를 따르는지 검증해줘.
다른 부분 있으면 수정해줘.
```

---

#### 문제 4: 테스트가 실패함

**증상**: 구현 후 테스트 실패

**해결**: Claude Code로 디버깅
```
@backend/src/__tests__/review.controller.test.ts
@backend/src/controllers/review.controller.ts

테스트가 실패해. 에러 메시지:
[에러 메시지 붙여넣기]

원인 찾아서 수정해줘.
```

---

## 💡 실전 팁

### Tip 1: 프롬프트 템플릿 활용

#### 백엔드 API 구현
```template
@docs/API_SPEC.md
@docs/DATABASE_SCHEMA.md

[엔드포인트] 를 구현해줘.

기능:
- [기능 1]
- [기능 2]
- [기능 3]

요구사항:
- Validation: [규칙]
- 에러 처리: [케이스]
- 테스트 코드 포함
```

---

#### 프론트엔드 페이지 생성
```template
@docs/PAGE_STRUCTURE.md
@docs/UI_DESIGN_GUIDE.md

[페이지명] 을 만들어줘.

레이아웃: PAGE_STRUCTURE 참고
스타일: UI_DESIGN_GUIDE 적용

기능:
- [기능 1]
- [기능 2]

주의사항:
- React Hook Form 사용
- 에러 처리
- 로딩 상태
```

---

#### 코드 리뷰 요청
```template
@[파일경로]
@docs/[관련 문서]

이 코드를 리뷰해줘:

체크 항목:
1. 코드 품질 (타입, 네이밍, 구조)
2. 문서 준수 (API_SPEC, DATABASE_SCHEMA 등)
3. 에러 처리
4. 성능
5. 보안

개선 사항 제안해줘.
```

---

### Tip 2: Git 커밋 전략

```
1. 백엔드 API 완성 → 커밋
   "feat(backend): Add Store API endpoints"

2. 프론트엔드 페이지 완성 → 커밋
   "feat(frontend): Add Map page with Kakao Map"

3. 스타일 조정 완료 → 커밋
   "style(frontend): Apply design guide to Map page"

4. 버그 수정 → 커밋
   "fix(backend): Fix store rating calculation bug"
```

**이점**:
- 롤백 용이
- 변경 사항 추적
- 도구 간 충돌 방지

---

### Tip 3: 작업 체크리스트

**새 기능 개발 시**:
```
□ PRD 확인
□ DATABASE_SCHEMA 확인 (필요 시)
□ API_SPEC 확인 (필요 시)
□ Claude Code로 백엔드 구현
□ 테스트 코드 작성
□ Cursor로 프론트엔드 UI 구현
□ 스타일 가이드 적용 확인
□ Claude Code로 전체 리뷰
□ 문서 업데이트
□ Git 커밋
```

---

### Tip 4: 효율적인 대화 관리

**Claude Code**:
```
- 작업 단위로 대화 분리
- 완료 후 새 대화 시작
- 컨텍스트 명확히 전달
```

**Cursor**:
```
- 파일별로 대화 분리
- 스타일 작업은 짧게
- 복잡하면 Claude로 전환
```

---

## 요약

### 🎯 핵심 원칙

1. **적재적소**: 각 도구의 강점을 활용
2. **문서 중심**: 항상 문서 참조 및 업데이트
3. **단계적 진행**: 한 번에 하나씩, 검증하며
4. **협업 패턴**: Claude 설계 → Cursor 구현 → Claude 검증
5. **명확한 소통**: 구체적인 프롬프트 작성

---

### 📋 빠른 참조

| 상황 | 도구 | 프롬프트 예시 |
|------|------|--------------|
| 백엔드 API | 🤖 Claude Code | `@docs/API_SPEC.md<br>GET /api/stores 구현해줘` |
| 페이지 UI | 🎨 Cursor | `@docs/PAGE_STRUCTURE.md<br>지도 페이지 만들어줘` |
| 스타일 조정 | 🎨 Cursor | `버튼 색상을 Primary로 변경해줘` |
| 코드 리뷰 | 🤖 Claude Code | `이 코드 리뷰하고 개선점 제안해줘` |
| 리팩토링 | 🤖 Claude Code | `공통 컴포넌트로 추출해줘` |
| 디버깅 | 🤖 Claude Code | `이 버그 원인 찾아서 수정해줘` |
| 문서 업데이트 | 🤖 Claude Code | `API_SPEC.md 업데이트해줘` |

---

**작성일**: 2025-12-11
**프로젝트**: WorkReview - 아르바이트 리뷰 플랫폼
**버전**: 1.0.0
