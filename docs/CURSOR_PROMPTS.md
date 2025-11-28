# 🎯 Cursor 프롬프트 가이드: workreview-service

> **프로젝트**: workreview-service  
> **목표**: Cursor를 활용해 단계별로 완벽한 프로젝트 구축

---

## 📋 시작 전 체크리스트

```bash
✅ 1. 모든 문서를 docs/ 폴더에 배치
✅ 2. Cursor 에디터 열기
✅ 3. Cursor Composer 열기 (Cmd/Ctrl + I)
✅ 4. 차근차근 단계별로 진행
```

---

## 🚀 Phase 0: 프로젝트 초기화

### Step 0-1: 프로젝트 폴더 생성
**터미널에서 직접 실행**
```bash
mkdir workreview-service
cd workreview-service
mkdir docs

# 다운로드한 문서들을 docs/ 폴더에 복사
```

---

## 📁 Phase 1: 프로젝트 구조 생성

### Step 1-1: 전체 디렉토리 구조 생성

**📎 첨부 파일:**
- `docs/DIRECTORY_STRUCTURE.md`
- `docs/ARCHITECTURE.md`

**🎯 프롬프트:**
```
docs/DIRECTORY_STRUCTURE.md를 참고해서 workreview-service 프로젝트의 
전체 디렉토리 구조를 생성해줘.

다음을 포함해야 해:
1. frontend/ - React + TypeScript + Vite 프로젝트
2. backend/ - Express + TypeScript 프로젝트  
3. shared/ - 공유 타입 폴더
4. 각 폴더의 하위 구조 (components, pages, routes, controllers 등)
5. 각 폴더에 .gitkeep 파일 (빈 폴더도 Git에 포함되도록)

DIRECTORY_STRUCTURE.md의 구조를 정확히 따라야 해.
```

**예상 결과:**
```
workreview-service/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── ...
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── ...
└── docs/
```

---

### Step 1-2: Frontend 초기화

**📎 첨부 파일:**
- `docs/ARCHITECTURE.md`

**🎯 프롬프트:**
```
frontend/ 폴더에서 Vite + React + TypeScript 프로젝트를 초기화해줘.

다음 명령어를 실행:
1. cd frontend
2. npm create vite@latest . -- --template react-ts
3. npm install

그리고 docs/ARCHITECTURE.md에 명시된 필수 라이브러리를 설치해줘:
- react-router-dom
- @tanstack/react-query
- zustand
- axios
- zod
- react-hook-form

개발 의존성:
- tailwindcss
- @types/node
- eslint
- prettier
```

---

### Step 1-3: Backend 초기화

**📎 첨부 파일:**
- `docs/ARCHITECTURE.md`

**🎯 프롬프트:**
```
backend/ 폴더에서 Node.js + TypeScript 프로젝트를 초기화해줘.

다음 작업을 수행:
1. npm init -y
2. TypeScript 및 필수 라이브러리 설치

필수 라이브러리 (docs/ARCHITECTURE.md 참고):
- express
- mongoose
- cors
- helmet  
- dotenv
- jsonwebtoken
- bcrypt
- zod
- winston
- socket.io

개발 의존성:
- typescript
- @types/node
- @types/express
- ts-node-dev
- nodemon

3. tsconfig.json 생성 (strict mode 활성화)
4. package.json에 scripts 추가:
   - "dev": "ts-node-dev --respawn src/server.ts"
   - "build": "tsc"
   - "start": "node dist/server.js"
```

---

## ⚙️ Phase 2: 설정 파일 생성

### Step 2-1: TypeScript 설정

**📎 첨부 파일:**
- `docs/DIRECTORY_STRUCTURE.md`
- `docs/CODING_CONVENTIONS.md`

**🎯 프롬프트:**
```
1. frontend/tsconfig.json을 생성해줘.
   docs/DIRECTORY_STRUCTURE.md의 설정을 따라야 하고,
   path alias 설정 포함:
   - "@/*": ["./src/*"]
   - "@shared/*": ["../shared/*"]

2. backend/tsconfig.json을 생성해줘.
   docs/DIRECTORY_STRUCTURE.md의 설정을 따라야 하고,
   path alias 설정 포함:
   - "@/*": ["./src/*"]
   - "@shared/*": ["../shared/*"]

3. 두 파일 모두 strict mode를 활성화해야 해.
```

---

### Step 2-2: ESLint & Prettier 설정

**📎 첨부 파일:**
- `docs/CODING_CONVENTIONS.md`

**🎯 프롬프트:**
```
docs/CODING_CONVENTIONS.md를 참고해서 다음 설정 파일들을 생성해줘:

1. frontend/.eslintrc.cjs
   - React + TypeScript 규칙
   - no-console 경고
   - no-unused-vars 에러
   - strict 타입 체크

2. frontend/.prettierrc
   - semi: true
   - singleQuote: true
   - tabWidth: 2
   - trailingComma: 'es5'

3. backend/.eslintrc.cjs (같은 규칙)
4. backend/.prettierrc (같은 규칙)

5. 루트에 .prettierignore
   - node_modules
   - dist
   - build
```

---

### Step 2-3: 환경 변수 템플릿

**📎 첨부 파일:**
- `docs/ARCHITECTURE.md`

**🎯 프롬프트:**
```
docs/ARCHITECTURE.md의 환경 변수 섹션을 참고해서:

1. backend/.env.example 파일 생성:
   - DATABASE_URL (MongoDB)
   - JWT_SECRET
   - JWT_EXPIRES_IN
   - API_PORT
   - NODE_ENV
   - FRONTEND_URL (CORS용)

2. frontend/.env.example 파일 생성:
   - VITE_API_URL

3. .gitignore에 .env 추가 (루트, frontend, backend)
```

---

### Step 2-4: .cursorrules 생성

**📎 첨부 파일:**
- `docs/CODING_CONVENTIONS.md`
- `docs/ARCHITECTURE.md`

**🎯 프롬프트:**
```
프로젝트 루트에 .cursorrules 파일을 생성해줘.

내용:
- docs/CODING_CONVENTIONS.md의 모든 규칙 준수 명시
- TypeScript strict mode 필수
- 네이밍 컨벤션 (camelCase, PascalCase)
- any 타입 사용 금지
- 에러 처리 필수
- 주요 참고 문서 경로 명시
```

---

## 🔧 Phase 3: 핵심 설정 파일 구현

### Step 3-1: Backend 기본 구조

**📎 첨부 파일:**
- `docs/DIRECTORY_STRUCTURE.md`
- `docs/ARCHITECTURE.md`
- `docs/CODING_CONVENTIONS.md`

**🎯 프롬프트:**
```
docs/DIRECTORY_STRUCTURE.md와 docs/ARCHITECTURE.md를 참고해서
backend의 핵심 파일들을 생성해줘. docs/CODING_CONVENTIONS.md의 
규칙을 엄격히 따라야 해.

생성할 파일:

1. src/config/database.ts
   - MongoDB 연결 함수
   - 에러 처리 포함
   - winston 로거 사용

2. src/config/env.ts
   - zod로 환경 변수 검증
   - 타입 안전한 env 객체 export

3. src/config/logger.ts
   - winston 로거 설정
   - 개발/프로덕션 환경 분리

4. src/config/cors.ts
   - CORS 설정 객체
   - FRONTEND_URL 화이트리스트

5. src/app.ts
   - Express 앱 설정
   - 미들웨어 (helmet, cors, express.json)
   - 라우트 연결 준비
   - 에러 핸들러 연결

6. src/server.ts
   - 서버 시작
   - DB 연결
   - 포트 리스닝

모든 파일에 적절한 주석과 타입 정의를 포함해야 해.
```

---

### Step 3-2: Frontend 기본 구조

**📎 첨부 파일:**
- `docs/DIRECTORY_STRUCTURE.md`
- `docs/ARCHITECTURE.md`
- `docs/CODING_CONVENTIONS.md`

**🎯 프롬프트:**
```
docs/DIRECTORY_STRUCTURE.md를 참고해서 frontend의 핵심 파일들을 생성해줘.
docs/CODING_CONVENTIONS.md의 규칙을 따라야 해.

생성할 파일:

1. src/main.tsx
   - React 진입점
   - QueryClientProvider 설정
   - Strict Mode 포함

2. src/app/App.tsx
   - BrowserRouter 설정
   - 전역 레이아웃

3. src/api/client.ts
   - axios 인스턴스 생성
   - baseURL 설정 (환경 변수)
   - request interceptor (JWT 토큰 자동 추가)
   - response interceptor (401 처리)

4. src/queries/queryClient.ts
   - React Query 클라이언트 설정
   - 기본 옵션 설정

5. src/types/api.types.ts
   - 공통 API 응답 타입
   - ApiResponse<T> 제네릭 타입
   - ApiError 타입

6. tailwind.config.js
   - Tailwind 기본 설정

7. src/styles/globals.css
   - Tailwind imports
   - 전역 스타일

모든 파일에 TypeScript 타입을 명시해야 해.
```

---

## 🗄️ Phase 4: 데이터베이스 모델

### Step 4-1: MongoDB 스키마 생성

**📎 첨부 파일:**
- `docs/DATABASE_SCHEMA.md`
- `docs/CODING_CONVENTIONS.md`

**🎯 프롬프트:**
```
docs/DATABASE_SCHEMA.md를 참고해서 Mongoose 모델들을 생성해줘.
docs/CODING_CONVENTIONS.md의 규칙을 따라야 해.

생성할 파일:

1. backend/src/models/User.model.ts
   - User 인터페이스 정의
   - 스키마 정의 (필드, 검증, 인덱스)
   - 비밀번호 해싱 pre-save hook
   - comparePassword 메서드
   - JSON 변환 시 password 제거

2. backend/src/models/Project.model.ts
   - Project 인터페이스
   - 스키마 정의
   - owner, members 참조
   - virtual fields (taskCount, memberCount)

3. backend/src/models/Task.model.ts
   - Task 인터페이스  
   - 스키마 정의
   - project, assignee 참조
   - 복합 인덱스 설정
   - virtual field (isOverdue)

4. backend/src/models/Comment.model.ts
   - Comment 인터페이스
   - 스키마 정의
   - task, author 참조

모든 모델은 DATABASE_SCHEMA.md의 스키마를 정확히 따라야 해.
타입스크립트 타입도 함께 정의해야 해.
```

---

## 🔐 Phase 5: 인증 시스템 구현

### Step 5-1: 인증 관련 유틸리티

**📎 첨부 파일:**
- `docs/ARCHITECTURE.md`
- `docs/CODING_CONVENTIONS.md`

**🎯 프롬프트:**
```
인증 시스템에 필요한 유틸리티 파일들을 생성해줘.
docs/ARCHITECTURE.md의 인증 아키텍처를 참고하고,
docs/CODING_CONVENTIONS.md의 규칙을 따라야 해.

생성할 파일:

1. backend/src/utils/jwt.util.ts
   - generateToken(userId, role) 함수
   - verifyToken(token) 함수
   - JWT_SECRET, JWT_EXPIRES_IN 사용

2. backend/src/utils/bcrypt.util.ts
   - hashPassword(password) 함수
   - comparePassword(password, hash) 함수

3. backend/src/utils/errors.util.ts
   - AppError 클래스
   - NotFoundError 클래스
   - ValidationError 클래스
   - UnauthorizedError 클래스
   - ForbiddenError 클래스

모든 함수에 타입 정의와 에러 처리를 포함해야 해.
```

---

### Step 5-2: 인증 검증 (Zod)

**📎 첨부 파일:**
- `docs/API_SPEC.md`
- `docs/CODING_CONVENTIONS.md`

**🎯 프롬프트:**
```
docs/API_SPEC.md의 인증 API를 참고해서 Zod 검증 스키마를 생성해줘.

생성할 파일:

1. backend/src/validators/auth.validator.ts
   - registerSchema (email, password, name 검증)
   - loginSchema (email, password 검증)
   - 이메일 형식 검증
   - 비밀번호 최소 8자, 영문+숫자 포함

2. backend/src/middlewares/validation.middleware.ts
   - validateRequest(schema) 미들웨어 함수
   - zod 검증 실패 시 ValidationError 발생
   - 에러 메시지를 깔끔하게 포맷팅

타입 안전성을 위해 TypeScript 제네릭을 사용해야 해.
```

---

### Step 5-3: 인증 미들웨어

**📎 첨부 파일:**
- `docs/ARCHITECTURE.md`
- `docs/CODING_CONVENTIONS.md`

**🎯 프롬프트:**
```
JWT 기반 인증 미들웨어를 생성해줘.
docs/ARCHITECTURE.md의 인증 플로우를 따라야 해.

생성할 파일:

1. backend/src/middlewares/auth.middleware.ts
   - authenticate 미들웨어
     * Authorization 헤더에서 토큰 추출
     * 토큰 검증
     * req.user에 사용자 정보 저장
     * 토큰 없거나 invalid면 UnauthorizedError
   
   - authorize(...roles) 미들웨어 팩토리
     * 특정 역할만 접근 가능하도록
     * admin, member, guest 체크

2. backend/src/types/express.d.ts
   - Express.Request 타입 확장
   - user 속성 추가 (id, email, role)

모든 에러는 적절한 커스텀 에러 클래스를 사용해야 해.
```

---

### Step 5-4: 인증 서비스

**📎 첨부 파일:**
- `docs/API_SPEC.md`
- `docs/CODING_CONVENTIONS.md`

**🎯 프롬프트:**
```
인증 비즈니스 로직을 처리하는 서비스를 생성해줘.
docs/API_SPEC.md의 인증 API 명세를 따라야 해.

생성할 파일:

backend/src/services/auth.service.ts

다음 메서드를 포함:

1. register(email, password, name)
   - 이메일 중복 체크
   - 비밀번호 해싱
   - 사용자 생성
   - JWT 토큰 발급
   - { user, accessToken, refreshToken } 반환

2. login(email, password)
   - 사용자 조회
   - 비밀번호 검증
   - lastLogin 업데이트
   - JWT 토큰 발급
   - { user, accessToken, refreshToken } 반환

3. verifyToken(token)
   - 토큰 검증
   - 사용자 조회
   - 사용자 정보 반환

모든 에러 케이스를 처리하고 적절한 에러를 throw해야 해.
docs/CODING_CONVENTIONS.md의 컨트롤러-서비스 패턴을 따라야 해.
```

---

### Step 5-5: 인증 컨트롤러

**📎 첨부 파일:**
- `docs/API_SPEC.md`
- `docs/CODING_CONVENTIONS.md`

**🎯 프롬프트:**
```
인증 API 엔드포인트를 처리하는 컨트롤러를 생성해줘.
docs/API_SPEC.md의 응답 형식을 정확히 따라야 해.

생성할 파일:

backend/src/controllers/auth.controller.ts

다음 메서드를 포함:

1. register(req, res, next)
   - req.body에서 데이터 추출
   - AuthService.register 호출
   - 201 Created 응답
   - try-catch로 에러를 next()에 전달

2. login(req, res, next)
   - req.body에서 데이터 추출
   - AuthService.login 호출
   - 200 OK 응답
   - try-catch로 에러 처리

3. logout(req, res, next)
   - 200 OK 응답
   - 토큰 무효화 로직 (선택)

4. getMe(req, res, next)
   - req.user에서 사용자 정보 추출
   - 200 OK 응답

모든 응답은 docs/API_SPEC.md의 형식을 따라야 해:
{ success: true, data: {...}, message: "..." }

클래스 기반 컨트롤러로 작성하고, static 메서드를 사용해야 해.
```

---

### Step 5-6: 인증 라우트

**📎 첨부 파일:**
- `docs/API_SPEC.md`
- `docs/DIRECTORY_STRUCTURE.md`

**🎯 프롬프트:**
```
인증 API 라우트를 생성해줘.
docs/API_SPEC.md의 엔드포인트를 정확히 따라야 해.

생성할 파일:

backend/src/routes/auth.routes.ts

다음 라우트를 정의:

POST   /register  - AuthController.register (검증 미들웨어 포함)
POST   /login     - AuthController.login (검증 미들웨어 포함)
POST   /logout    - AuthController.logout (인증 필요)
GET    /me        - AuthController.getMe (인증 필요)

validateRequest 미들웨어를 사용해서 요청 검증을 해야 해.
authenticate 미들웨어를 사용해서 인증이 필요한 라우트를 보호해야 해.

Express Router를 사용하고 export default router 형식으로 작성해야 해.
```

---

### Step 5-7: 에러 핸들러

**📎 첨부 파일:**
- `docs/API_SPEC.md`
- `docs/CODING_CONVENTIONS.md`

**🎯 프롬프트:**
```
전역 에러 핸들러 미들웨어를 생성해줘.
docs/API_SPEC.md의 에러 응답 형식을 따라야 해.

생성할 파일:

backend/src/middlewares/errorHandler.middleware.ts

기능:
1. AppError 인스턴스 처리
   - statusCode, code, message 사용
   - 적절한 HTTP 상태 코드 반환

2. Mongoose 에러 처리
   - ValidationError
   - CastError (잘못된 ObjectId)
   - Duplicate key error (11000)

3. JWT 에러 처리
   - JsonWebTokenError
   - TokenExpiredError

4. 예상치 못한 에러
   - 500 Internal Server Error
   - 로그 남기기 (winston)
   - 프로덕션에서는 상세 정보 숨기기

모든 에러 응답은 다음 형식:
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "사용자 친화적 메시지",
    details?: {...}
  }
}
```

---

### Step 5-8: 라우트 통합

**📎 첨부 파일:**
- `docs/DIRECTORY_STRUCTURE.md`

**🎯 프롬프트:**
```
모든 라우트를 통합하는 index 라우터를 생성해줘.

생성할 파일:

backend/src/routes/index.ts

기능:
1. 모든 라우트 import
   - authRoutes
   - (나중에 추가될 다른 라우트들)

2. /api prefix 아래에 마운트
   - /api/auth → authRoutes
   - /api/users → userRoutes (준비)
   - /api/projects → projectRoutes (준비)
   - /api/tasks → taskRoutes (준비)

3. Express Router 사용
4. export default router

그리고 backend/src/app.ts를 업데이트해서:
- routes import
- app.use('/api', routes) 추가
- errorHandler import 및 사용
```

---

## 🎨 Phase 6: Frontend 인증 UI

### Step 6-1: 인증 타입 정의

**📎 첨부 파일:**
- `docs/API_SPEC.md`

**🎯 프롬프트:**
```
frontend의 인증 관련 타입들을 생성해줘.
docs/API_SPEC.md의 API 응답을 참고해야 해.

생성할 파일:

1. frontend/src/types/auth.types.ts
   - User 인터페이스
   - LoginRequest 인터페이스
   - RegisterRequest 인터페이스
   - AuthResponse 인터페이스 (user, accessToken, refreshToken)

2. shared/types/user.types.ts
   - User 타입 (frontend와 backend 공유)
   - UserRole 타입

모든 타입은 백엔드 API 응답과 정확히 일치해야 해.
```

---

### Step 6-2: 인증 API 클라이언트

**📎 첨부 파일:**
- `docs/API_SPEC.md`
- `docs/CODING_CONVENTIONS.md`

**🎯 프롬프트:**
```
인증 API 호출 함수들을 생성해줘.
docs/API_SPEC.md의 엔드포인트를 사용해야 해.

생성할 파일:

frontend/src/api/auth.api.ts

다음 함수를 포함:

1. register(data: RegisterRequest): Promise<AuthResponse>
   - POST /api/auth/register
   - 회원가입

2. login(data: LoginRequest): Promise<AuthResponse>
   - POST /api/auth/login
   - 로그인

3. logout(): Promise<void>
   - POST /api/auth/logout
   - 로그아웃

4. getMe(): Promise<User>
   - GET /api/auth/me
   - 내 정보 조회

모든 함수는 src/api/client.ts의 axios 인스턴스를 사용해야 해.
에러 처리도 포함해야 해.
```

---

### Step 6-3: 인증 상태 관리 (Zustand)

**📎 첨부 파일:**
- `docs/ARCHITECTURE.md`
- `docs/CODING_CONVENTIONS.md`

**🎯 프롬프트:**
```
Zustand로 인증 상태를 관리하는 스토어를 생성해줘.

생성할 파일:

frontend/src/stores/authStore.ts

상태:
- user: User | null
- token: string | null
- isAuthenticated: boolean

액션:
- setUser(user: User, token: string)
- logout()
- initialize() - localStorage에서 복원

기능:
1. 로그인 시 user와 token을 localStorage에 저장
2. 로그아웃 시 localStorage 클리어
3. 새로고침 시 자동으로 복원

TypeScript 타입을 명시적으로 정의해야 해.
```

---

### Step 6-4: 인증 Hook

**📎 첨부 파일:**
- `docs/CODING_CONVENTIONS.md`

**🎯 프롬프트:**
```
인증 관련 커스텀 훅을 생성해줘.

생성할 파일:

frontend/src/hooks/useAuth.ts

기능:
1. authStore 사용
2. 로그인, 로그아웃, 회원가입 함수 제공
3. React Query와 통합
4. 에러 처리

반환값:
{
  user,
  isAuthenticated,
  login: (data) => Promise<void>,
  register: (data) => Promise<void>,
  logout: () => void,
  isLoading,
  error
}

React Query의 useMutation을 사용해서 최적화해야 해.
```

---

### Step 6-5: 로그인 페이지

**📎 첨부 파일:**
- `docs/CODING_CONVENTIONS.md`
- `docs/PRD.md`

**🎯 프롬프트:**
```
로그인 페이지를 생성해줘.
docs/PRD.md의 사용자 스토리와 docs/CODING_CONVENTIONS.md의 
React 컨벤션을 따라야 해.

생성할 파일:

frontend/src/pages/auth/LoginPage.tsx

기능:
1. react-hook-form으로 폼 관리
2. zod로 클라이언트 검증
3. useAuth 훅으로 로그인
4. 로그인 성공 시 /dashboard로 리다이렉트
5. 에러 메시지 표시
6. 로딩 상태 표시

UI:
- Tailwind CSS 사용
- 이메일 input
- 비밀번호 input
- 로그인 버튼
- 회원가입 링크

깔끔하고 반응형 디자인으로 작성해야 해.
TypeScript strict mode를 준수해야 해.
```

---

### Step 6-6: 회원가입 페이지

**📎 첨부 파일:**
- `docs/CODING_CONVENTIONS.md`
- `docs/PRD.md`

**🎯 프롬프트:**
```
회원가입 페이지를 생성해줘.
로그인 페이지와 비슷한 구조로 만들어야 해.

생성할 파일:

frontend/src/pages/auth/RegisterPage.tsx

기능:
1. react-hook-form + zod 검증
2. 이메일, 비밀번호, 이름 입력
3. 비밀번호 확인 필드
4. useAuth 훅으로 회원가입
5. 성공 시 자동 로그인 및 /dashboard 이동
6. 에러 메시지 표시

UI:
- Tailwind CSS
- 반응형 디자인
- 로그인 페이지와 일관된 스타일

TypeScript 타입을 명시해야 해.
```

---

### Step 6-7: Protected Route

**📎 첨부 파일:**
- `docs/CODING_CONVENTIONS.md`

**🎯 프롬프트:**
```
인증이 필요한 페이지를 보호하는 컴포넌트를 생성해줘.

생성할 파일:

frontend/src/components/features/auth/ProtectedRoute.tsx

기능:
1. useAuth로 인증 상태 확인
2. 인증되지 않으면 /login으로 리다이렉트
3. 인증되면 children 렌더링
4. 로딩 중일 때 스피너 표시

Props:
- children: React.ReactNode
- requiredRole?: UserRole (선택)

TypeScript로 타입 안전하게 작성해야 해.
```

---

### Step 6-8: 라우터 설정

**📎 첨부 파일:**
- `docs/DIRECTORY_STRUCTURE.md`
- `docs/PRD.md`

**🎯 프롬프트:**
```
React Router로 전체 라우팅을 설정해줘.
docs/PRD.md의 화면 구성을 참고해야 해.

생성할 파일:

frontend/src/app/AppRouter.tsx

라우트:
- / → 홈 (리다이렉트)
- /login → LoginPage
- /register → RegisterPage
- /dashboard → DashboardPage (Protected)
- /projects → ProjectsPage (Protected)
- /projects/:id → ProjectDetailPage (Protected)
- /tasks/:id → TaskDetailPage (Protected)
- /settings → SettingsPage (Protected)
- * → NotFoundPage

Protected 라우트는 ProtectedRoute 컴포넌트로 감싸야 해.

그리고 src/app/App.tsx를 업데이트해서 AppRouter를 사용해야 해.
```

---

## 🎉 Phase 7: 첫 번째 테스트

### Step 7-1: 인증 시스템 테스트

**터미널에서 직접 실행**

```bash
# Backend 실행
cd backend
npm run dev

# 새 터미널에서 Frontend 실행
cd frontend
npm run dev
```

**Postman/Thunder Client로 테스트:**
```
1. POST http://localhost:5000/api/auth/register
   Body: { "email": "test@example.com", "password": "password123", "name": "Test User" }

2. POST http://localhost:5000/api/auth/login
   Body: { "email": "test@example.com", "password": "password123" }

3. GET http://localhost:5000/api/auth/me
   Header: Authorization: Bearer [받은 토큰]
```

**브라우저에서 테스트:**
```
http://localhost:3000/register
→ 회원가입 테스트

http://localhost:3000/login
→ 로그인 테스트

로그인 성공 → /dashboard로 이동 확인
```

---

## 🚀 Phase 8: 다음 기능들

이제 인증 시스템이 완성되었으니 다음 기능을 구현할 수 있어요!

### 다음 단계 프롬프트 예시:

```
[docs/API_SPEC.md, docs/DATABASE_SCHEMA.md, docs/CODING_CONVENTIONS.md 첨부]

"인증 시스템처럼 프로젝트(Project) CRUD 기능을 처음부터 끝까지 구현해줘:
1. Backend: 모델, 서비스, 컨트롤러, 라우트
2. Frontend: API 클라이언트, React Query, 페이지, 컴포넌트
3. docs/API_SPEC.md의 프로젝트 API를 정확히 따라야 해
4. docs/CODING_CONVENTIONS.md의 규칙을 준수해야 해"
```

---

## 📋 전체 체크리스트

### Phase 0-2: 초기 설정
- [ ] 프로젝트 폴더 생성
- [ ] 디렉토리 구조 생성
- [ ] Frontend 초기화
- [ ] Backend 초기화
- [ ] TypeScript 설정
- [ ] ESLint & Prettier 설정
- [ ] 환경 변수 템플릿
- [ ] .cursorrules 생성

### Phase 3: 핵심 설정
- [ ] Backend 기본 구조 (config, app, server)
- [ ] Frontend 기본 구조 (main, App, api client)

### Phase 4: 데이터베이스
- [ ] User 모델
- [ ] Project 모델
- [ ] Task 모델
- [ ] Comment 모델

### Phase 5: Backend 인증
- [ ] 인증 유틸리티 (JWT, bcrypt, errors)
- [ ] 인증 검증 (Zod)
- [ ] 인증 미들웨어
- [ ] 인증 서비스
- [ ] 인증 컨트롤러
- [ ] 인증 라우트
- [ ] 에러 핸들러
- [ ] 라우트 통합

### Phase 6: Frontend 인증
- [ ] 인증 타입
- [ ] 인증 API 클라이언트
- [ ] 인증 스토어 (Zustand)
- [ ] useAuth 훅
- [ ] 로그인 페이지
- [ ] 회원가입 페이지
- [ ] ProtectedRoute
- [ ] 라우터 설정

### Phase 7: 테스트
- [ ] Backend API 테스트
- [ ] Frontend UI 테스트
- [ ] 로그인/회원가입 플로우 확인

---

## 💡 프롬프트 작성 팁

### ✅ 좋은 프롬프트
```
[여러 문서 첨부]

"docs/API_SPEC.md와 docs/CODING_CONVENTIONS.md를 참고해서
태스크 생성 API를 구현해줘.

구현할 것:
1. backend/src/validators/task.validator.ts - Zod 스키마
2. backend/src/services/task.service.ts - createTask 메서드
3. backend/src/controllers/task.controller.ts - createTask 메서드
4. backend/src/routes/tasks.routes.ts - POST /tasks 라우트

모든 코드는 CODING_CONVENTIONS.md의 규칙을 따라야 하고,
API_SPEC.md의 요청/응답 형식을 정확히 따라야 해."
```

### ❌ 나쁜 프롬프트
```
"태스크 만드는 기능 만들어줘"
```

---

## 🎯 성공 포인트

1. **한 번에 하나씩**: 너무 많은 걸 한 번에 요청하지 마세요
2. **문서 첨부**: 항상 관련 문서를 첨부하세요
3. **구체적 요청**: 어떤 파일을, 어떤 내용으로 만들지 명확히
4. **검증 확인**: 각 단계마다 실제로 작동하는지 테스트
5. **에러 해결**: 에러 나면 에러 로그와 함께 다시 질문

---

**행운을 빕니다! 🚀**
