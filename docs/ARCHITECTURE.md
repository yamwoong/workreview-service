# 🏗️ 기술 스택 & 아키텍처 설계서

> **프로젝트**: [프로젝트명]  
> **버전**: 1.0.0  
> **작성일**: 2025-11-22

---

## 📚 기술 스택

### Frontend
```json
{
  "프레임워크": "React 18.x + TypeScript",
  "빌드 도구": "Vite",
  "상태 관리": {
    "클라이언트 상태": "zustand",
    "서버 상태": "@tanstack/react-query"
  },
  "라우팅": "react-router-dom v6",
  "스타일링": "Tailwind CSS",
  "UI 컴포넌트": "shadcn/ui",
  "폼 관리": "react-hook-form + zod",
  "HTTP 클라이언트": "axios",
  "실시간": "socket.io-client"
}
```

### Backend
```json
{
  "런타임": "Node.js 20.x",
  "프레임워크": "Express.js + TypeScript",
  "데이터베이스": "MongoDB 7.x",
  "ODM": "Mongoose (또는 Prisma)",
  "인증": "JWT (jsonwebtoken) + bcrypt",
  "검증": "zod",
  "보안": ["helmet", "cors", "express-rate-limit"],
  "로깅": "winston",
  "실시간": "socket.io"
}
```

### DevOps & Tools
```json
{
  "컨테이너": "Docker + Docker Compose",
  "CI/CD": "GitHub Actions",
  "배포": {
    "Frontend": "Vercel",
    "Backend": "Railway",
    "Database": "MongoDB Atlas"
  },
  "모니터링": "Sentry",
  "버전 관리": "Git + GitHub"
}
```

### Development Tools
```json
{
  "에디터": "Cursor (VS Code 기반)",
  "코드 품질": ["ESLint", "Prettier"],
  "Git Hooks": "husky + lint-staged",
  "테스팅": {
    "Unit": "Vitest",
    "Integration": "Supertest",
    "E2E": "Playwright"
  }
}
```

---

## 🏛️ 시스템 아키텍처

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    Internet                              │
└───────────────────┬─────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼────────┐    ┌────────▼────────┐
│   Cloudflare   │    │   Cloudflare    │
│   CDN (FE)     │    │   Proxy (BE)    │
└───────┬────────┘    └────────┬────────┘
        │                      │
┌───────▼────────┐    ┌────────▼────────┐
│     Vercel     │    │    Railway      │
│  (React App)   │◄──►│  (Express API)  │
└────────────────┘    └────────┬────────┘
                               │
                      ┌────────┴────────┐
                      │  MongoDB Atlas  │
                      │   (Database)    │
                      └─────────────────┘
```

### Application Architecture

#### Frontend (React)
```
src/
├── components/        # UI 컴포넌트
│   ├── ui/           # shadcn/ui 기본 컴포넌트
│   └── features/     # 기능별 컴포넌트
├── pages/            # 페이지 컴포넌트
├── hooks/            # Custom Hooks
├── stores/           # Zustand 스토어
├── api/              # API 호출 함수
├── utils/            # 유틸리티 함수
├── types/            # TypeScript 타입
└── config/           # 설정 파일
```

#### Backend (Express)
```
src/
├── routes/           # API 라우트
├── controllers/      # 비즈니스 로직
├── models/           # DB 스키마/모델
├── middlewares/      # 미들웨어
├── services/         # 서비스 계층
├── utils/            # 유틸리티
├── validators/       # Zod 스키마
├── types/            # TypeScript 타입
└── config/           # 설정 파일
```

---

## 🔐 인증 & 보안 아키텍처

### 인증 플로우
```
1. 로그인 요청
   User → POST /api/auth/login {email, password}
   
2. 서버 검증
   Server → bcrypt.compare(password, hashedPassword)
   
3. JWT 토큰 발급
   Server → jwt.sign({userId, role}, SECRET, {expiresIn: '7d'})
   
4. 토큰 반환
   Server → {accessToken, refreshToken, user}
   
5. 클라이언트 저장
   Client → localStorage.setItem('token', accessToken)
   
6. 인증이 필요한 요청
   Client → headers: {Authorization: 'Bearer ${token}'}
   
7. 토큰 검증 (미들웨어)
   Server → jwt.verify(token, SECRET) → next()
```

### 보안 조치
```typescript
// helmet - 보안 헤더 설정
app.use(helmet());

// CORS 설정
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100 // IP당 100 요청
});
app.use('/api', limiter);

// 입력 검증 (모든 엔드포인트)
app.post('/api/tasks', validateRequest(taskSchema), createTask);
```

---

## 📊 데이터베이스 아키텍처

### MongoDB Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  password: String (hashed),
  name: String,
  role: Enum['admin', 'member', 'guest'],
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Projects Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  owner: ObjectId (ref: 'User', indexed),
  members: [ObjectId] (ref: 'User'),
  status: Enum['active', 'archived'],
  createdAt: Date,
  updatedAt: Date
}
```

#### Tasks Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  project: ObjectId (ref: 'Project', indexed),
  assignee: ObjectId (ref: 'User', indexed),
  status: Enum['todo', 'in_progress', 'done'],
  priority: Enum['low', 'medium', 'high'],
  dueDate: Date,
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### 인덱싱 전략
```javascript
// 자주 조회되는 필드에 인덱스 생성
User: ['email']
Project: ['owner', 'createdAt']
Task: ['project', 'assignee', 'status', 'createdAt']

// 복합 인덱스
Task: [['project', 'status'], ['assignee', 'status']]
```

---

## 🌐 API 아키텍처

### RESTful API 설계 원칙
```
GET     /api/resources       - 리소스 목록 조회
GET     /api/resources/:id   - 특정 리소스 조회
POST    /api/resources       - 리소스 생성
PUT     /api/resources/:id   - 리소스 전체 업데이트
PATCH   /api/resources/:id   - 리소스 부분 업데이트
DELETE  /api/resources/:id   - 리소스 삭제
```

### 응답 포맷
```typescript
// 성공 응답
{
  success: true,
  data: {...},
  message?: string
}

// 에러 응답
{
  success: false,
  error: {
    code: 'ERROR_CODE',
    message: '사용자 친화적 메시지',
    details?: {...}
  }
}

// 페이지네이션 응답
{
  success: true,
  data: [...],
  pagination: {
    page: 1,
    limit: 20,
    total: 100,
    totalPages: 5
  }
}
```

---

## 🔄 실시간 통신 (WebSocket)

### Socket.io 이벤트 설계
```typescript
// 클라이언트 → 서버
'task:create'
'task:update'
'task:delete'
'chat:message'
'user:typing'

// 서버 → 클라이언트
'task:created'
'task:updated'
'task:deleted'
'chat:newMessage'
'user:online'
'user:offline'
```

### Room 구조
```typescript
// 프로젝트별 Room
socket.join(`project:${projectId}`);

// 사용자별 Room (알림용)
socket.join(`user:${userId}`);

// 브로드캐스트 예시
io.to(`project:${projectId}`).emit('task:created', newTask);
```

---

## 📦 배포 아키텍처

### CI/CD Pipeline (GitHub Actions)

#### Frontend
```yaml
# .github/workflows/frontend.yml
on: [push]
jobs:
  build:
    - Lint & Type Check
    - Run Tests
    - Build Production
    - Deploy to Vercel
```

#### Backend
```yaml
# .github/workflows/backend.yml
on: [push]
jobs:
  build:
    - Lint & Type Check
    - Run Tests
    - Build Docker Image
    - Deploy to Railway
```

### 환경 구성
```
Development  → localhost:3000 (FE) + localhost:5000 (BE)
Staging      → staging.example.com + staging-api.example.com
Production   → example.com + api.example.com
```

---

## 🔍 모니터링 & 로깅

### 로깅 레벨
```typescript
// Winston Logger 설정
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// 사용 예시
logger.error('Database connection failed', { error });
logger.info('User logged in', { userId });
logger.debug('Processing request', { requestId });
```

### Sentry 통합
```typescript
// Backend
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

// Frontend
Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  integrations: [new BrowserTracing()]
});
```

---

## ⚡ 성능 최적화 전략

### Frontend
- Code Splitting (React.lazy)
- 이미지 최적화 (WebP, lazy loading)
- React Query 캐싱
- Virtual Scrolling (긴 리스트)
- Debouncing/Throttling (검색, 스크롤)

### Backend
- DB 쿼리 최적화 (인덱싱, lean())
- Redis 캐싱 (자주 조회되는 데이터)
- Compression (gzip)
- Connection Pooling
- 페이지네이션 (limit/skip)

### Network
- CDN 활용 (정적 파일)
- HTTP/2
- Brotli/Gzip 압축

---

## 🧪 테스트 전략

### 테스트 피라미드
```
       /\
      /E2E\      ← 5% (핵심 사용자 플로우)
     /──────\
    /  통합   \   ← 15% (API 엔드포인트)
   /──────────\
  /   단위     \  ← 80% (함수, 컴포넌트)
 ──────────────
```

### 테스트 범위
- **Unit Tests**: 유틸 함수, Hooks, 서비스 로직
- **Integration Tests**: API 엔드포인트, DB 연동
- **E2E Tests**: 로그인 → 태스크 생성 → 수정 → 삭제

---

## 📋 기술 결정 기록 (ADR)

### ADR-001: Mongoose vs Prisma
- **결정**: Mongoose 선택
- **이유**: MongoDB에 특화, 팀 경험 있음, 유연한 스키마
- **대안**: Prisma (타입 안전성은 뛰어나지만 학습 곡선)

### ADR-002: zustand vs Redux
- **결정**: zustand 선택
- **이유**: 간단한 API, 보일러플레이트 적음, 프로젝트 규모 적합
- **대안**: Redux Toolkit (대규모 앱에 적합)

### ADR-003: Vite vs Create React App
- **결정**: Vite 선택
- **이유**: 빠른 HMR, 최신 빌드 도구, CRA는 더 이상 권장되지 않음

---

## 🚀 마이그레이션 계획

### Phase 1 → Phase 2 이동 시
- [ ] WebSocket 서버 추가
- [ ] Redis 캐싱 레이어 도입
- [ ] 파일 업로드 (S3 또는 Cloudinary)
- [ ] 이메일 서비스 (SendGrid/Resend)

---

**작성자**: [이름]  
**검토자**: [이름]  
**승인일**: [날짜]
