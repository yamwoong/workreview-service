# 🎯 Cursor 프롬프트 가이드: WorkReview

> **프로젝트**: WorkReview - 아르바이트 리뷰 플랫폼
> **목표**: Cursor와 Claude Code를 활용해 단계별로 완벽한 플랫폼 구축

---

## 📋 시작 전 체크리스트

```bash
✅ 1. Phase 1 완료: 인증 시스템 구축 완료
✅ 2. Cursor 에디터 열기
✅ 3. Cursor Composer 열기 (Cmd/Ctrl + I)
✅ 4. 문서 참조하며 단계별 진행
```

---

## 🗺️ Phase 2: 지도 & 매장 탐색

### Step 2-1: Store 모델 생성 (백엔드)

**📎 참조 문서:**
- `docs/DATABASE_SCHEMA.md`
- `docs/CODING_CONVENTIONS.md`

**🎯 Cursor 프롬프트:**
```
@docs/DATABASE_SCHEMA.md
@docs/CODING_CONVENTIONS.md

Store 모델을 생성해줘.

파일: backend/src/models/Store.model.ts

요구사항:
1. Geospatial 인덱스 (2dsphere) - 주변 매장 검색용
2. 평균 평점 필드 (salary, restTime, workEnv, management, overall)
3. 리뷰 개수 (reviewCount)
4. 카테고리 (cafe, restaurant, convenience, retail, service, education, entertainment, other)
5. Virtual fields 활용
6. DATABASE_SCHEMA.md의 스키마 정확히 따르기

모든 필드에 타입과 validation을 명시해야 해.
```

---

### Step 2-2: Store API 엔드포인트 (백엔드)

**📎 참조 문서:**
- `docs/API_SPEC.md`
- `docs/CODING_CONVENTIONS.md`

**🎯 Cursor 프롬프트:**
```
@docs/API_SPEC.md
@docs/CODING_CONVENTIONS.md

Store API를 구현해줘.

생성할 파일:
1. backend/src/validators/store.validator.ts
   - createStoreSchema (name, address, category, location)
   - 이름 최소 1자, 최대 100자
   - location { lng, lat } validation

2. backend/src/services/store.service.ts
   - getStores(lat, lng, radius, category) - 주변 매장 검색
   - getStoreById(id) - 매장 상세
   - createStore(data) - 매장 등록
   - Geospatial $geoNear 쿼리 사용

3. backend/src/controllers/store.controller.ts
   - getStores - GET /api/stores
   - getStoreById - GET /api/stores/:id
   - createStore - POST /api/stores

4. backend/src/routes/store.routes.ts
   - GET /stores (쿼리: lat, lng, radius, category, page, limit)
   - GET /stores/:id
   - POST /stores (인증 필요)

API_SPEC.md의 요청/응답 형식을 정확히 따라야 해.
```

---

### Step 2-3: 지도 페이지 UI (프론트엔드)

**📎 참조 문서:**
- `docs/PAGE_STRUCTURE.md` - 지도 페이지 섹션
- `docs/UI_DESIGN_GUIDE.md`

**🎯 Cursor 프롬프트:**
```
@docs/PAGE_STRUCTURE.md
@docs/UI_DESIGN_GUIDE.md

지도 페이지를 만들어줘.

파일: frontend/src/pages/MapPage.tsx

레이아웃:
- 왼쪽: Kakao Map (70%)
- 오른쪽: 매장 리스트 (30%)
- 상단: 필터 (반경, 카테고리)

기능:
1. Kakao Map API 연동
2. 현재 위치 기반 매장 마커 표시
3. 마커 클릭 시 정보창 (매장 이름, 평점)
4. 반경 필터링 (1km, 3km, 5km, 10km)
5. 카테고리 필터링 드롭다운
6. 매장 리스트 카드 (클릭 시 상세 페이지 이동)

스타일:
- UI_DESIGN_GUIDE의 컬러 시스템 사용
- Primary 색상: #4DCDB3
- 카드: rounded-xl border border-[#d0d7de]
- 반응형: 모바일에서는 탭 전환

react-kakao-maps-sdk 라이브러리 사용.
```

---

### Step 2-4: 매장 상세 페이지 (프론트엔드)

**📎 참조 문서:**
- `docs/PAGE_STRUCTURE.md` - 매장 상세 섹션
- `docs/UI_DESIGN_GUIDE.md`

**🎯 Cursor 프롬프트:**
```
@docs/PAGE_STRUCTURE.md
@docs/UI_DESIGN_GUIDE.md

매장 상세 페이지를 만들어줘.

파일: frontend/src/pages/stores/StoreDetailPage.tsx

레이아웃:
1. 매장 정보 섹션
   - 매장 이름 (text-lg font-medium)
   - 주소, 카테고리
   - 종합 평점 (별점 + 숫자)

2. 평점 상세
   - 급여: ⭐⭐⭐⭐⭐ 4.5
   - 휴게시간: ⭐⭐⭐⭐☆ 4.0
   - 근무환경: ⭐⭐⭐⭐☆ 4.3
   - 관리자: ⭐⭐⭐⭐☆ 4.0

3. 리뷰 목록
   - 리뷰 카드 (작성자, 날짜, 평점, 내용 미리보기)
   - 페이지네이션

4. 리뷰 작성 버튼 (로그인 필요)

기능:
- useParams로 storeId 추출
- React Query로 매장 정보 및 리뷰 fetch
- 로딩/에러 상태 처리

스타일:
- UI_DESIGN_GUIDE 따르기
- Card: bg-white rounded-xl border border-[#d0d7de] p-6
- Button: bg-[#4DCDB3] hover:bg-[#3CB89F]
```

---

## ✍️ Phase 3: 리뷰 작성 및 관리

### Step 3-1: Review 모델 생성 (백엔드)

**📎 참조 문서:**
- `docs/DATABASE_SCHEMA.md`
- `docs/CODING_CONVENTIONS.md`

**🎯 Cursor 프롬프트:**
```
@docs/DATABASE_SCHEMA.md
@docs/CODING_CONVENTIONS.md

Review 모델을 생성해줘.

파일: backend/src/models/Review.model.ts

요구사항:
1. 4가지 평점 필드 (salary, restTime, workEnv, management) - 1~5
2. 평균 평점 자동 계산 (Virtual 또는 pre-save hook)
3. 리뷰 내용 (최소 10자)
4. 근무 기간 (workPeriod: { start, end })
5. 직책 (position)
6. store, user 참조
7. Unique 제약: { store: 1, user: 1 } - 한 매장당 1개만

Hooks:
- Post-save hook: Store의 평균 평점 업데이트

DATABASE_SCHEMA.md의 정의 정확히 따르기.
```

---

### Step 3-2: Review API 엔드포인트 (백엔드)

**📎 참조 문서:**
- `docs/API_SPEC.md`
- `docs/CODING_CONVENTIONS.md`

**🎯 Cursor 프롬프트:**
```
@docs/API_SPEC.md
@docs/CODING_CONVENTIONS.md

Review API를 구현해줘.

생성할 파일:

1. backend/src/validators/review.validator.ts
   - createReviewSchema
     * ratings: { salary, restTime, workEnv, management } (1-5)
     * content: 최소 10자
     * workPeriod: { start (required), end (optional) }
     * position: string

2. backend/src/services/review.service.ts
   - getReviewsByStore(storeId, page, limit) - 매장의 리뷰 목록
   - getMyReviews(userId, page, limit) - 내 리뷰 목록
   - getReviewById(id) - 리뷰 상세
   - createReview(storeId, userId, data) - 리뷰 작성
   - updateReview(id, userId, data) - 리뷰 수정
   - deleteReview(id, userId) - 리뷰 삭제
   - 중복 체크 로직 포함

3. backend/src/controllers/review.controller.ts
   - 모든 메서드 구현
   - 에러 처리 (중복, 권한 없음 등)

4. backend/src/routes/review.routes.ts
   - GET /stores/:storeId/reviews
   - POST /stores/:storeId/reviews (인증 필요)
   - GET /reviews/my (인증 필요)
   - GET /reviews/:id
   - PATCH /reviews/:id (인증 필요, 본인만)
   - DELETE /reviews/:id (인증 필요, 본인만)

API_SPEC.md의 명세 정확히 따르기.
```

---

### Step 3-3: 리뷰 작성 페이지 (프론트엔드)

**📎 참조 문서:**
- `docs/PAGE_STRUCTURE.md` - 리뷰 작성 섹션
- `docs/UI_DESIGN_GUIDE.md`

**🎯 Cursor 프롬프트:**
```
@docs/PAGE_STRUCTURE.md
@docs/UI_DESIGN_GUIDE.md

리뷰 작성 페이지를 만들어줘.

파일: frontend/src/pages/reviews/ReviewWritePage.tsx

레이아웃:
1. 매장 정보 표시 (이름, 주소)
2. 4가지 평점 입력 (별점 클릭)
   - 급여
   - 휴게시간
   - 근무환경
   - 관리자
3. 리뷰 내용 (Textarea, 최소 10자)
4. 근무 기간 (시작일, 종료일 - 선택)
5. 직책 입력
6. 작성 완료 버튼

기능:
- React Hook Form + Zod validation
- useParams로 storeId 추출
- 별점 컴포넌트 (클릭으로 1-5 선택)
- 작성 완료 시 매장 상세 페이지로 이동
- 에러 처리 (이미 리뷰 작성한 경우)

스타일:
- UI_DESIGN_GUIDE 따르기
- Input: border border-[#d0d7de] rounded-md
- Button: bg-[#4DCDB3] w-full
- 별점: text-[#4DCDB3] (채워진), text-gray-300 (빈)
```

---

### Step 3-4: 내 리뷰 페이지 (프론트엔드)

**📎 참조 문서:**
- `docs/PAGE_STRUCTURE.md` - 내 리뷰 섹션
- `docs/UI_DESIGN_GUIDE.md`

**🎯 Cursor 프롬프트:**
```
@docs/PAGE_STRUCTURE.md
@docs/UI_DESIGN_GUIDE.md

내 리뷰 페이지를 만들어줘.

파일: frontend/src/pages/MyReviewsPage.tsx

레이아웃:
- 총 리뷰 개수 표시
- 리뷰 카드 목록
  * 매장 이름
  * 평점 (별점)
  * 작성일
  * 리뷰 내용 미리보기 (1줄)
  * 수정/삭제 버튼
- 페이지네이션

기능:
- React Query로 내 리뷰 fetch
- 카드 클릭 시 매장 상세 페이지로 이동
- 수정 버튼 → 리뷰 수정 페이지
- 삭제 버튼 → 확인 모달 후 삭제
- 빈 상태: "아직 작성한 리뷰가 없습니다" + 지도 페이지 버튼

스타일:
- UI_DESIGN_GUIDE 따르기
- Card: bg-white rounded-xl border p-6 hover:shadow-md
- 반응형 그리드: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

---

## 🎨 Phase 4: UI 개선 및 공통 컴포넌트

### Step 4-1: 공통 Input 컴포넌트

**📎 참조 문서:**
- `docs/UI_DESIGN_GUIDE.md`
- `docs/CODING_CONVENTIONS.md`

**🎯 Cursor 프롬프트:**
```
@docs/UI_DESIGN_GUIDE.md
@docs/CODING_CONVENTIONS.md

공통 Input 컴포넌트를 만들어줘.

파일: frontend/src/components/common/Input.tsx

Props:
- label?: string
- error?: string
- helperText?: string
- ...InputHTMLAttributes<HTMLInputElement>

스타일 (UI_DESIGN_GUIDE):
- 기본: border border-[#d0d7de] rounded-md px-3 py-2 text-sm
- Focus: border-[#4DCDB3] ring-1 ring-[#4DCDB3]
- Error: border-[#cf222e] ring-[#cf222e]
- Label: text-sm font-medium text-gray-900 mb-1.5
- Error message: text-xs text-[#cf222e] mt-1.5

React Hook Form과 호환되도록 forwardRef 사용.
TypeScript strict 모드 준수.
```

---

### Step 4-2: 공통 Button 컴포넌트

**📎 참조 문서:**
- `docs/UI_DESIGN_GUIDE.md`
- `docs/CODING_CONVENTIONS.md`

**🎯 Cursor 프롬프트:**
```
@docs/UI_DESIGN_GUIDE.md
@docs/CODING_CONVENTIONS.md

공통 Button 컴포넌트를 만들어줘.

파일: frontend/src/components/common/Button.tsx

Props:
- variant: 'primary' | 'secondary' | 'outline' | 'danger'
- size: 'sm' | 'md' | 'lg'
- isLoading?: boolean
- children: React.ReactNode
- ...ButtonHTMLAttributes<HTMLButtonElement>

Variants (UI_DESIGN_GUIDE):
- primary: bg-[#4DCDB3] hover:bg-[#3CB89F] text-white
- secondary: bg-[#f6f8fa] hover:bg-[#eaeef2] text-gray-900 border
- outline: border-2 border-[#4DCDB3] text-[#4DCDB3] hover:bg-[#E8F9F6]
- danger: bg-[#cf222e] hover:bg-[#a40e26] text-white

Sizes:
- sm: px-3 py-1.5 text-xs rounded-md
- md: px-4 py-2.5 text-sm rounded-md
- lg: px-5 py-3 text-base rounded-md

Loading 시 스피너 표시, disabled 처리.
```

---

### Step 4-3: 별점 컴포넌트

**📎 참조 문서:**
- `docs/UI_DESIGN_GUIDE.md`

**🎯 Cursor 프롬프트:**
```
@docs/UI_DESIGN_GUIDE.md

별점 컴포넌트를 만들어줘.

파일: frontend/src/components/common/Rating.tsx

Props:
- value: number (1-5)
- onChange?: (value: number) => void
- readonly?: boolean
- size?: 'sm' | 'md' | 'lg'

기능:
- readonly일 때: 별점만 표시
- onChange 있을 때: 클릭으로 별점 선택
- 마우스 hover 시 미리보기

스타일:
- 채워진 별: text-[#4DCDB3]
- 빈 별: text-gray-300
- 크기:
  * sm: w-4 h-4
  * md: w-5 h-5
  * lg: w-6 h-6

react-icons의 FaStar, FaRegStar 사용.
```

---

### Step 4-4: 카드 컴포넌트

**📎 참조 문서:**
- `docs/UI_DESIGN_GUIDE.md`

**🎯 Cursor 프롬프트:**
```
@docs/UI_DESIGN_GUIDE.md

공통 Card 컴포넌트를 만들어줘.

파일: frontend/src/components/common/Card.tsx

Props:
- children: React.ReactNode
- onClick?: () => void
- className?: string
- variant?: 'default' | 'clickable'

스타일:
- default: bg-white rounded-xl border border-[#d0d7de] p-6 shadow-sm
- clickable: + hover:shadow-md cursor-pointer transition-all

className으로 추가 스타일 가능하도록 merge.
```

---

## 🔧 Phase 5: 기능 개선

### Step 5-1: 매장 검색 기능

**🎯 Cursor 프롬프트:**
```
@docs/PAGE_STRUCTURE.md

검색 페이지를 만들어줘.

파일: frontend/src/pages/SearchPage.tsx

기능:
1. 검색어 입력 (매장 이름, 주소)
2. 카테고리 필터 (다중 선택)
3. 평점 필터 (최소 평점)
4. 검색 결과 매장 카드 목록
5. 페이지네이션

백엔드 API:
- GET /api/stores/search?q={query}&category={cat}&minRating={rating}

스타일:
- UI_DESIGN_GUIDE 따르기
- 반응형 그리드
```

---

### Step 5-2: 댓글 기능 (선택)

**🎯 Cursor 프롬프트:**
```
@docs/DATABASE_SCHEMA.md

댓글 기능을 추가해줘.

백엔드:
1. backend/src/models/Comment.model.ts
   - review 참조
   - user 참조
   - content

2. backend/src/routes/comment.routes.ts
   - GET /reviews/:reviewId/comments
   - POST /reviews/:reviewId/comments
   - DELETE /comments/:id

프론트엔드:
3. frontend/src/components/features/reviews/CommentList.tsx
   - 댓글 목록
   - 댓글 작성 폼

4. ReviewDetailPage에 통합
```

---

## 📱 Phase 6: Kakao Map 통합

### Step 6-1: Kakao Map 설정

**🎯 Cursor 프롬프트:**
```
Kakao Map API를 설정해줘.

1. react-kakao-maps-sdk 설치
   npm install react-kakao-maps-sdk

2. frontend/public/index.html에 스크립트 추가
   <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY&libraries=services"></script>

3. frontend/.env에 VITE_KAKAO_MAP_KEY 추가

4. frontend/src/components/features/map/KakaoMap.tsx
   - Map 컴포넌트
   - MapMarker 컴포넌트
   - CustomOverlayMap 사용

5. frontend/src/hooks/useKakaoMap.ts
   - 현재 위치 가져오기
   - 주소 → 좌표 변환
   - 좌표 → 주소 변환
```

---

### Step 6-2: 주소 검색 기능

**🎯 Cursor 프롬프트:**
```
@docs/PAGE_STRUCTURE.md - 매장 등록 섹션

매장 등록 페이지를 만들어줘.

파일: frontend/src/pages/stores/StoreCreatePage.tsx

기능:
1. 매장 이름 입력
2. 주소 검색 (Kakao 주소 API)
   - 주소 검색 버튼 클릭
   - 모달에서 주소 선택
   - 선택 시 자동으로 위도/경도 계산
3. 카테고리 선택 (드롭다운)
4. 지도 미리보기 (선택한 위치 마커 표시)
5. 등록 버튼

validation:
- 중복 매장 체크 (이름 + 주소)
- 모든 필드 필수

스타일:
- UI_DESIGN_GUIDE 따르기
```

---

## 🎨 Phase 7: UI/UX 개선

### Step 7-1: 로딩 스켈레톤

**🎯 Cursor 프롬프트:**
```
@docs/UI_DESIGN_GUIDE.md

로딩 스켈레톤 컴포넌트를 만들어줘.

파일: frontend/src/components/common/Skeleton.tsx

종류:
1. SkeletonCard - 카드 로딩
2. SkeletonList - 리스트 로딩
3. SkeletonText - 텍스트 로딩

스타일:
- 애니메이션: animate-pulse
- 색상: bg-gray-200

사용처:
- MapPage: 매장 리스트 로딩 시
- StoreDetailPage: 매장 정보 로딩 시
- MyReviewsPage: 리뷰 목록 로딩 시
```

---

### Step 7-2: 에러 바운더리

**🎯 Cursor 프롬프트:**
```
@docs/CODING_CONVENTIONS.md

에러 바운더리를 만들어줘.

파일: frontend/src/components/common/ErrorBoundary.tsx

기능:
1. React 에러 캐치
2. 에러 메시지 표시
3. "새로고침" 버튼
4. 에러 로깅 (선택)

스타일:
- 중앙 정렬
- 에러 아이콘
- 간결한 메시지
```

---

### Step 7-3: Toast 알림

**🎯 Cursor 프롬프트:**
```
react-hot-toast를 설정해줘.

1. 설치
   npm install react-hot-toast

2. frontend/src/components/common/Toaster.tsx
   - react-hot-toast의 Toaster 설정
   - 위치: top-right
   - 스타일: UI_DESIGN_GUIDE 색상 사용

3. frontend/src/utils/toast.ts
   - toast.success()
   - toast.error()
   - toast.loading()
   - 헬퍼 함수들

4. main.tsx에 Toaster 추가

사용 예시:
- 리뷰 작성 완료: toast.success("리뷰가 작성되었습니다")
- API 에러: toast.error(error.message)
```

---

## 📚 참고 프롬프트 패턴

### 패턴 1: 백엔드 API 구현

```template
@docs/API_SPEC.md
@docs/DATABASE_SCHEMA.md
@docs/CODING_CONVENTIONS.md

[기능명] API를 구현해줘.

생성할 파일:
1. backend/src/validators/[name].validator.ts
2. backend/src/services/[name].service.ts
3. backend/src/controllers/[name].controller.ts
4. backend/src/routes/[name].routes.ts

요구사항:
- [요구사항 1]
- [요구사항 2]

API_SPEC.md의 명세를 정확히 따라야 해.
```

---

### 패턴 2: 프론트엔드 페이지 생성

```template
@docs/PAGE_STRUCTURE.md - [페이지명] 섹션
@docs/UI_DESIGN_GUIDE.md

[페이지명]을 만들어줘.

파일: frontend/src/pages/[PageName].tsx

레이아웃: PAGE_STRUCTURE 참고

기능:
- [기능 1]
- [기능 2]

스타일:
- UI_DESIGN_GUIDE 따르기
- [특정 스타일 요구사항]

React Hook Form + Zod validation 사용.
```

---

### 패턴 3: 공통 컴포넌트

```template
@docs/UI_DESIGN_GUIDE.md
@docs/CODING_CONVENTIONS.md

[컴포넌트명] 컴포넌트를 만들어줘.

파일: frontend/src/components/common/[ComponentName].tsx

Props:
- [prop1]: type
- [prop2]: type

기능:
- [기능 설명]

스타일: UI_DESIGN_GUIDE의 [섹션] 참고

TypeScript strict mode, forwardRef 사용.
```

---

### 패턴 4: 코드 리뷰 요청

```template
@[파일경로]
@docs/[관련 문서]

이 코드를 리뷰해줘:

체크 항목:
1. UI_DESIGN_GUIDE 스타일 준수
2. API_SPEC.md 응답 형식 일치
3. 에러 처리
4. TypeScript 타입 정의
5. 접근성 (ARIA 레이블)

개선 사항 제안해줘.
```

---

## 💡 Cursor 사용 팁

### ✅ DO

```
✓ 문서 참조 적극 활용
  @docs/API_SPEC.md
  @docs/UI_DESIGN_GUIDE.md

✓ 구체적인 파일 경로 명시
  파일: frontend/src/pages/MapPage.tsx

✓ 요구사항 명확히 나열
  1. 기능 1
  2. 기능 2
  3. 스타일 규칙

✓ 참고 문서 섹션 명시
  @docs/PAGE_STRUCTURE.md - 지도 페이지 섹션

✓ 실시간 확인
  Composer에서 생성 → 즉시 브라우저 확인
```

---

### ❌ DON'T

```
✗ 모호한 요청
  "지도 페이지 만들어줘" (X)

✗ 여러 작업 한꺼번에
  "지도, 리뷰, 검색 다 만들어줘" (X)

✗ 문서 없이 요청
  참고할 문서 첨부 필수

✗ 스타일 가이드 무시
  임의로 색상 선택하지 말 것
```

---

## 🔄 Claude Code vs Cursor 사용 시나리오

### Cursor 사용 (UI/UX 중심)

```
✓ 페이지 레이아웃 구성
✓ 컴포넌트 스타일링
✓ 실시간 디자인 조정
✓ 프로토타입 작성
✓ 빠른 버그 수정
```

**예시 프롬프트:**
```
@docs/UI_DESIGN_GUIDE.md

리뷰 작성 페이지의 별점 아이콘 크기를 키우고,
간격을 넓혀줘.

별점: w-6 h-6 (기존 w-5 h-5)
간격: gap-2 (기존 gap-1)
```

---

### Claude Code 사용 (로직/구조 중심)

```
✓ 백엔드 API 전체 구현
✓ 복잡한 비즈니스 로직
✓ 다중 파일 리팩토링
✓ 코드 리뷰 및 최적화
✓ 문서 작성 및 업데이트
```

**예시 프롬프트:**
```
@docs/API_SPEC.md
@docs/DATABASE_SCHEMA.md

Review 저장 시 Store의 평균 평점을 자동으로
업데이트하는 로직을 구현해줘.

Aggregation 파이프라인으로 정확히 계산하고,
트랜잭션 처리도 추가해줘.
```

---

## 🎯 완성 체크리스트

### Phase 2: 지도 & 매장 탐색
- [ ] Store 모델 (Geospatial 인덱스)
- [ ] Store API (주변 검색, 상세)
- [ ] 지도 페이지 UI
- [ ] 매장 상세 페이지

### Phase 3: 리뷰 작성 및 관리
- [ ] Review 모델 (평점, 중복 체크)
- [ ] Review API (CRUD)
- [ ] 리뷰 작성 페이지
- [ ] 내 리뷰 페이지

### Phase 4: 공통 컴포넌트
- [ ] Input 컴포넌트
- [ ] Button 컴포넌트
- [ ] Rating (별점) 컴포넌트
- [ ] Card 컴포넌트

### Phase 5: 기능 개선
- [ ] 검색 기능
- [ ] 댓글 기능 (선택)

### Phase 6: Kakao Map
- [ ] Map 설정
- [ ] 주소 검색
- [ ] 매장 등록 페이지

### Phase 7: UI/UX 개선
- [ ] 로딩 스켈레톤
- [ ] 에러 바운더리
- [ ] Toast 알림

---

## 🚀 다음 단계

**WorkReview 완성 후:**
- 배포 준비 (이용약관, 개인정보처리방침)
- 성능 최적화
- SEO 최적화
- PWA 변환 (선택)

---

**참고 문서:**
- [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - Claude + Cursor 협업 가이드
- [UI_DESIGN_GUIDE.md](./UI_DESIGN_GUIDE.md) - UI 디자인 시스템
- [API_SPEC.md](./API_SPEC.md) - API 명세
- [PAGE_STRUCTURE.md](./PAGE_STRUCTURE.md) - 페이지 구조

---

**작성일**: 2025-12-11
**프로젝트**: WorkReview - 아르바이트 리뷰 플랫폼
**버전**: 2.0.0
