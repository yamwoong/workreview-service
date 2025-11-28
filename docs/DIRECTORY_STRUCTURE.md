# 📁 프로젝트 디렉토리 구조

> **프로젝트**: [프로젝트명]  
> **기술 스택**: TypeScript + React + Express + MongoDB  
> **작성일**: 2025-11-22

---

## 🏗️ 전체 프로젝트 구조

```
project-root/
├── frontend/              # React 프론트엔드
├── backend/               # Express 백엔드
├── shared/                # 공유 코드 (타입, 유틸)
├── docs/                  # 프로젝트 문서
├── .github/              # GitHub 설정 (CI/CD)
├── docker-compose.yml    # Docker 설정
└── README.md             # 프로젝트 소개
```

---

## ⚛️ Frontend 구조 (React + Vite)

```
frontend/
├── public/                         # 정적 파일
│   ├── favicon.ico
│   └── logo.png
│
├── src/
│   ├── app/                       # 앱 설정
│   │   ├── App.tsx               # 루트 컴포넌트
│   │   ├── AppRouter.tsx         # 라우터 설정
│   │   └── providers.tsx         # Provider 래퍼 (Query, Auth 등)
│   │
│   ├── components/               # 컴포넌트
│   │   ├── ui/                  # 기본 UI 컴포넌트 (shadcn/ui)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/              # 레이아웃 컴포넌트
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MainLayout.tsx
│   │   │
│   │   └── features/            # 기능별 컴포넌트
│   │       ├── auth/
│   │       │   ├── LoginForm.tsx
│   │       │   ├── RegisterForm.tsx
│   │       │   └── ProtectedRoute.tsx
│   │       │
│   │       ├── projects/
│   │       │   ├── ProjectCard.tsx
│   │       │   ├── ProjectList.tsx
│   │       │   ├── CreateProjectModal.tsx
│   │       │   └── ProjectFilters.tsx
│   │       │
│   │       └── tasks/
│   │           ├── TaskCard.tsx
│   │           ├── TaskBoard.tsx
│   │           ├── TaskDetail.tsx
│   │           ├── CreateTaskForm.tsx
│   │           └── TaskFilters.tsx
│   │
│   ├── pages/                    # 페이지 컴포넌트
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   │
│   │   ├── projects/
│   │   │   ├── ProjectsPage.tsx
│   │   │   └── ProjectDetailPage.tsx
│   │   │
│   │   ├── tasks/
│   │   │   └── TaskDetailPage.tsx
│   │   │
│   │   ├── settings/
│   │   │   └── SettingsPage.tsx
│   │   │
│   │   └── NotFoundPage.tsx
│   │
│   ├── hooks/                    # Custom Hooks
│   │   ├── useAuth.ts           # 인증 관련
│   │   ├── useDebounce.ts       # 유틸리티
│   │   ├── useLocalStorage.ts
│   │   └── useWebSocket.ts      # WebSocket 연결
│   │
│   ├── stores/                   # Zustand 스토어
│   │   ├── authStore.ts         # 인증 상태
│   │   ├── uiStore.ts           # UI 상태 (모달, 사이드바)
│   │   └── index.ts
│   │
│   ├── api/                      # API 호출
│   │   ├── client.ts            # Axios 인스턴스
│   │   ├── auth.api.ts          # 인증 API
│   │   ├── projects.api.ts      # 프로젝트 API
│   │   ├── tasks.api.ts         # 태스크 API
│   │   └── index.ts
│   │
│   ├── queries/                  # React Query
│   │   ├── useAuthQuery.ts
│   │   ├── useProjectsQuery.ts
│   │   ├── useTasksQuery.ts
│   │   └── queryClient.ts       # Query 클라이언트 설정
│   │
│   ├── types/                    # TypeScript 타입
│   │   ├── auth.types.ts
│   │   ├── project.types.ts
│   │   ├── task.types.ts
│   │   ├── user.types.ts
│   │   └── api.types.ts         # API 응답 타입
│   │
│   ├── utils/                    # 유틸리티 함수
│   │   ├── formatDate.ts
│   │   ├── validation.ts
│   │   ├── localStorage.ts
│   │   └── cn.ts                # className 유틸
│   │
│   ├── constants/                # 상수
│   │   ├── routes.ts            # 라우트 경로
│   │   ├── apiEndpoints.ts      # API 엔드포인트
│   │   └── config.ts            # 설정 값
│   │
│   ├── styles/                   # 스타일
│   │   ├── globals.css          # 전역 스타일
│   │   └── tailwind.css         # Tailwind 진입점
│   │
│   ├── assets/                   # 정적 자산
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── lib/                      # 외부 라이브러리 설정
│   │   ├── socket.ts            # Socket.io 설정
│   │   └── axios.ts             # Axios 설정
│   │
│   ├── main.tsx                  # 진입점
│   └── vite-env.d.ts            # Vite 타입 정의
│
├── tests/                        # 테스트
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example                  # 환경 변수 예시
├── .env.local                    # 로컬 환경 변수 (git ignore)
├── .gitignore
├── .eslintrc.cjs                # ESLint 설정
├── .prettierrc                   # Prettier 설정
├── tsconfig.json                # TypeScript 설정
├── tsconfig.node.json
├── vite.config.ts               # Vite 설정
├── tailwind.config.js           # Tailwind 설정
├── postcss.config.js
├── package.json
└── README.md
```

### 주요 파일 설명 (Frontend)

#### `src/main.tsx`
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/queries/queryClient';
import App from '@/app/App';
import '@/styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
```

#### `src/app/App.tsx`
```typescript
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './AppRouter';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
```

#### `src/api/client.ts`
```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 🔧 Backend 구조 (Express + TypeScript)

```
backend/
├── src/
│   ├── config/                   # 설정 파일
│   │   ├── database.ts          # MongoDB 연결
│   │   ├── env.ts               # 환경 변수 검증
│   │   ├── cors.ts              # CORS 설정
│   │   └── logger.ts            # Winston 로거
│   │
│   ├── routes/                   # API 라우트
│   │   ├── index.ts             # 라우트 통합
│   │   ├── auth.routes.ts
│   │   ├── users.routes.ts
│   │   ├── projects.routes.ts
│   │   └── tasks.routes.ts
│   │
│   ├── controllers/              # 컨트롤러
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── project.controller.ts
│   │   └── task.controller.ts
│   │
│   ├── services/                 # 비즈니스 로직
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── project.service.ts
│   │   ├── task.service.ts
│   │   └── notification.service.ts
│   │
│   ├── models/                   # Mongoose 모델
│   │   ├── User.model.ts
│   │   ├── Project.model.ts
│   │   ├── Task.model.ts
│   │   └── Comment.model.ts
│   │
│   ├── middlewares/              # 미들웨어
│   │   ├── auth.middleware.ts   # JWT 인증
│   │   ├── validation.middleware.ts
│   │   ├── errorHandler.middleware.ts
│   │   ├── rateLimiter.middleware.ts
│   │   └── requestLogger.middleware.ts
│   │
│   ├── validators/               # Zod 스키마
│   │   ├── auth.validator.ts
│   │   ├── user.validator.ts
│   │   ├── project.validator.ts
│   │   └── task.validator.ts
│   │
│   ├── types/                    # TypeScript 타입
│   │   ├── express.d.ts         # Express 확장
│   │   ├── auth.types.ts
│   │   ├── project.types.ts
│   │   └── task.types.ts
│   │
│   ├── utils/                    # 유틸리티
│   │   ├── jwt.util.ts
│   │   ├── bcrypt.util.ts
│   │   ├── email.util.ts
│   │   └── errors.util.ts       # 커스텀 에러 클래스
│   │
│   ├── socket/                   # WebSocket
│   │   ├── index.ts             # Socket.io 서버
│   │   ├── handlers/
│   │   │   ├── task.handler.ts
│   │   │   └── chat.handler.ts
│   │   └── middleware/
│   │       └── auth.middleware.ts
│   │
│   ├── jobs/                     # 백그라운드 작업 (선택)
│   │   └── emailQueue.ts
│   │
│   ├── tests/                    # 테스트
│   │   ├── unit/
│   │   ├── integration/
│   │   └── fixtures/
│   │
│   ├── app.ts                    # Express 앱 설정
│   └── server.ts                # 서버 시작
│
├── .env.example
├── .env
├── .gitignore
├── .eslintrc.cjs
├── .prettierrc
├── tsconfig.json
├── nodemon.json
├── package.json
└── README.md
```

### 주요 파일 설명 (Backend)

#### `src/server.ts`
```typescript
import app from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import { logger } from './config/logger';

const PORT = env.API_PORT || 5000;

async function startServer() {
  try {
    // DB 연결
    await connectDatabase();
    
    // 서버 시작
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
```

#### `src/app.ts`
```typescript
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { corsOptions } from './config/cors';

const app = express();

// 미들웨어
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// 라우트
app.use('/api', routes);

// 에러 핸들러
app.use(errorHandler);

export default app;
```

#### `src/routes/index.ts`
```typescript
import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './users.routes';
import projectRoutes from './projects.routes';
import taskRoutes from './tasks.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);

export default router;
```

#### `src/types/express.d.ts`
```typescript
// Express 타입 확장
declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      email: string;
      role: 'admin' | 'member' | 'guest';
    };
  }
}
```

---

## 🔗 Shared 구조 (공유 코드)

```
shared/
├── types/                # 공유 TypeScript 타입
│   ├── user.types.ts
│   ├── project.types.ts
│   └── task.types.ts
│
├── validators/           # 공유 검증 스키마 (Zod)
│   ├── auth.schema.ts
│   └── task.schema.ts
│
├── constants/            # 공유 상수
│   ├── roles.ts
│   └── status.ts
│
└── utils/               # 공유 유틸리티
    └── date.utils.ts
```

### 사용 예시
```typescript
// Frontend에서
import { TaskStatus } from '@shared/types/task.types';

// Backend에서
import { TaskStatus } from '@shared/types/task.types';
```

---

## 📚 Docs 구조 (문서)

```
docs/
├── PRD.md                      # 요구사항 명세서
├── ARCHITECTURE.md             # 아키텍처 설계
├── API_SPEC.md                 # API 명세서
├── CODING_CONVENTIONS.md       # 코딩 컨벤션
├── DIRECTORY_STRUCTURE.md      # 디렉토리 구조 (이 문서)
├── DATABASE_SCHEMA.md          # DB 스키마
├── DEPLOYMENT.md               # 배포 가이드
└── CHANGELOG.md                # 변경 이력
```

---

## 🐳 Docker 구조

```
project-root/
├── docker-compose.yml          # 로컬 개발용
├── docker-compose.prod.yml     # 프로덕션용
│
├── frontend/
│   └── Dockerfile
│
└── backend/
    └── Dockerfile
```

### `docker-compose.yml`
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:5000/api
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=mongodb://mongo:27017/myapp
      - JWT_SECRET=your-secret-key
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - mongo

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

---

## 🔄 CI/CD 구조 (GitHub Actions)

```
.github/
├── workflows/
│   ├── frontend-ci.yml         # Frontend CI
│   ├── backend-ci.yml          # Backend CI
│   ├── deploy-staging.yml      # Staging 배포
│   └── deploy-production.yml   # Production 배포
│
└── PULL_REQUEST_TEMPLATE.md
```

### `frontend-ci.yml` 예시
```yaml
name: Frontend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'frontend/**'
  pull_request:
    branches: [main, develop]
    paths:
      - 'frontend/**'

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci
        
      - name: Lint
        working-directory: ./frontend
        run: npm run lint
        
      - name: Type check
        working-directory: ./frontend
        run: npm run type-check
        
      - name: Run tests
        working-directory: ./frontend
        run: npm test
        
      - name: Build
        working-directory: ./frontend
        run: npm run build
```

---

## 📝 중요 설정 파일

### Frontend `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["../shared/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Backend `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["../shared/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

---

## 📊 디렉토리 구조 설계 원칙

### 1. 기능별 구분 (Feature-based)
같은 기능에 관련된 파일들을 가까이 배치
```
features/
  tasks/
    TaskCard.tsx
    TaskList.tsx
    useTaskQuery.ts
    task.types.ts
```

### 2. 계층별 구분 (Layer-based)
백엔드는 계층별로 명확히 분리
```
controllers/ → services/ → models/
```

### 3. 공유 코드 분리
프론트엔드와 백엔드에서 공통으로 사용하는 코드는 `shared/`에

### 4. 설정 파일 중앙화
모든 설정은 `config/` 디렉토리에 집중

---

**작성일**: 2025-11-22  
**작성자**: 개발팀  
**버전**: 1.0.0
