# 📐 코딩 컨벤션 & 개발 규칙

> **프로젝트**: [프로젝트명]  
> **작성일**: 2025-11-22

---

## 🎯 핵심 원칙

1. **일관성**: 코드 스타일의 일관성 유지
2. **가독성**: 명확하고 이해하기 쉬운 코드 작성
3. **타입 안전성**: TypeScript strict mode 활용
4. **재사용성**: DRY (Don't Repeat Yourself) 원칙
5. **테스트 가능성**: 테스트하기 쉬운 구조

---

## 📝 TypeScript 규칙

### 타입 정의
```typescript
// ✅ GOOD: 명시적 타입 정의
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member' | 'guest';
}

// ✅ GOOD: Type Alias 사용 (유니온, 인터섹션)
type UserRole = 'admin' | 'member' | 'guest';
type AuthenticatedUser = User & { accessToken: string };

// ❌ BAD: any 사용 지양
const data: any = fetchData(); // 피하기

// ✅ GOOD: unknown 또는 제네릭 사용
const data: unknown = fetchData();
const data = fetchData<User>();
```

### tsconfig.json 설정
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

---

## 🎨 네이밍 컨벤션

### 변수 & 함수
```typescript
// ✅ GOOD: camelCase
const userName = 'John';
const isAuthenticated = true;
const getUserData = () => {};

// ❌ BAD
const user_name = 'John';  // snake_case 지양
const UserName = 'John';   // PascalCase 지양 (상수 제외)
```

### 상수
```typescript
// ✅ GOOD: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// ✅ GOOD: 객체 상수는 camelCase
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
} as const;
```

### 컴포넌트 & 클래스
```typescript
// ✅ GOOD: PascalCase
class UserService {}
interface UserRepository {}
const LoginForm = () => {};
```

### 타입 & 인터페이스
```typescript
// ✅ GOOD: PascalCase
interface User {}
type UserRole = 'admin' | 'member';

// ✅ GOOD: Props는 컴포넌트명 + Props
interface LoginFormProps {
  onSubmit: (data: LoginData) => void;
}
```

### 파일명
```typescript
// ✅ GOOD
UserService.ts        // 클래스
userService.ts        // 함수/객체
LoginForm.tsx         // React 컴포넌트
useAuth.ts           // Custom Hook
user.types.ts        // 타입 정의
user.test.ts         // 테스트 파일

// ❌ BAD
User-Service.ts
user_service.ts
loginform.tsx
```

---

## ⚛️ React 컨벤션

### 컴포넌트 구조
```typescript
// ✅ GOOD: 함수형 컴포넌트 + TypeScript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// ❌ BAD: export default 지양 (named export 선호)
export default Button;
```

### Hooks 규칙
```typescript
// ✅ GOOD: Custom Hook은 use로 시작
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // 초기화 로직
  }, []);
  
  return { user, setUser };
};

// ✅ GOOD: Hook은 최상위에서만 호출
const MyComponent = () => {
  const { user } = useAuth();  // ✅
  
  if (condition) {
    // ❌ BAD: 조건문 내부에서 Hook 호출 금지
    // const data = useData();
  }
  
  return <div>{user?.name}</div>;
};
```

### Props 전달
```typescript
// ✅ GOOD: 구조 분해 할당
const UserCard: React.FC<{ user: User }> = ({ user }) => {
  return <div>{user.name}</div>;
};

// ✅ GOOD: Props 스프레드 (필요시)
const Input = (props: InputHTMLAttributes<HTMLInputElement>) => {
  return <input {...props} />;
};

// ❌ BAD: 과도한 props 전달 지양
<Component
  prop1={value1}
  prop2={value2}
  prop3={value3}
  prop4={value4}
  prop5={value5}
  // 5개 이상이면 객체로 묶기 고려
/>
```

### 조건부 렌더링
```typescript
// ✅ GOOD: 간단한 조건
{isLoading && <Spinner />}
{user ? <UserProfile user={user} /> : <LoginButton />}

// ✅ GOOD: 복잡한 조건은 early return
const UserDashboard = ({ user }: { user: User | null }) => {
  if (!user) {
    return <LoginPage />;
  }
  
  if (user.role !== 'admin') {
    return <AccessDenied />;
  }
  
  return <AdminDashboard />;
};

// ❌ BAD: 중첩된 삼항 연산자
{condition1 ? (
  condition2 ? <A /> : <B />
) : (
  condition3 ? <C /> : <D />
)}
```

---

## 🔧 백엔드 (Express) 컨벤션

### 라우터 구조
```typescript
// ✅ GOOD: RESTful 라우팅
// routes/tasks.routes.ts
import express from 'express';
import { TaskController } from '../controllers/task.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { taskSchemas } from '../validators/task.validator';

const router = express.Router();

router.get('/', authenticate, TaskController.getTasks);
router.post(
  '/',
  authenticate,
  validateRequest(taskSchemas.create),
  TaskController.createTask
);
router.patch(
  '/:id',
  authenticate,
  validateRequest(taskSchemas.update),
  TaskController.updateTask
);

export default router;
```

### 컨트롤러 패턴
```typescript
// ✅ GOOD: 클래스 기반 컨트롤러
export class TaskController {
  // ✅ GOOD: async/await + try-catch
  static async getTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId, status } = req.query;
      const tasks = await TaskService.getTasks({
        projectId: projectId as string,
        status: status as TaskStatus
      });
      
      return res.json({
        success: true,
        data: tasks
      });
    } catch (error) {
      next(error); // ✅ 에러 미들웨어로 전달
    }
  }
  
  static async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const taskData = req.body;
      const userId = req.user!.id; // authenticate 미들웨어에서 설정
      
      const newTask = await TaskService.createTask(taskData, userId);
      
      return res.status(201).json({
        success: true,
        data: newTask,
        message: '태스크가 생성되었습니다'
      });
    } catch (error) {
      next(error);
    }
  }
}

// ❌ BAD: 함수 기반 (일관성 없음)
export const getTasks = async (req, res) => {
  // ...
};
```

### 서비스 레이어
```typescript
// ✅ GOOD: 비즈니스 로직 분리
export class TaskService {
  static async getTasks(filters: TaskFilters): Promise<Task[]> {
    const query = TaskModel.find();
    
    if (filters.projectId) {
      query.where('project').equals(filters.projectId);
    }
    
    if (filters.status) {
      query.where('status').equals(filters.status);
    }
    
    return query.lean().exec();
  }
  
  static async createTask(data: CreateTaskDto, userId: string): Promise<Task> {
    // 권한 체크
    const project = await ProjectModel.findById(data.projectId);
    if (!project) {
      throw new NotFoundError('프로젝트를 찾을 수 없습니다');
    }
    
    // 태스크 생성
    const task = new TaskModel({
      ...data,
      createdBy: userId
    });
    
    await task.save();
    
    // 실시간 알림
    await NotificationService.notifyTaskCreated(task);
    
    return task;
  }
}
```

### 에러 처리
```typescript
// ✅ GOOD: 커스텀 에러 클래스
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = '리소스를 찾을 수 없습니다') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public details?: any) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

// ✅ GOOD: 에러 미들웨어
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: (err as ValidationError).details
      }
    });
  }
  
  // 예상치 못한 에러
  logger.error('Unexpected error:', err);
  
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: '서버 오류가 발생했습니다'
    }
  });
};
```

---

## 🗄️ 데이터베이스 컨벤션

### Mongoose 스키마
```typescript
// ✅ GOOD
import { Schema, model, Document } from 'mongoose';

interface ITask extends Document {
  title: string;
  description: string;
  project: Schema.Types.ObjectId;
  assignee?: Schema.Types.ObjectId;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  assignee: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  status: {
    type: String,
    enum: ['todo', 'in_progress', 'done'],
    default: 'todo',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ✅ 인덱스 설정
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignee: 1, status: 1 });

export const TaskModel = model<ITask>('Task', taskSchema);
```

---

## 🧪 테스트 컨벤션

### 테스트 파일 구조
```typescript
// ✅ GOOD
describe('TaskService', () => {
  describe('getTasks', () => {
    it('should return all tasks for a project', async () => {
      // Arrange
      const projectId = 'test-project-id';
      
      // Act
      const tasks = await TaskService.getTasks({ projectId });
      
      // Assert
      expect(tasks).toHaveLength(5);
      expect(tasks[0].project.toString()).toBe(projectId);
    });
    
    it('should filter tasks by status', async () => {
      // Arrange
      const filters = { projectId: 'xxx', status: 'done' as TaskStatus };
      
      // Act
      const tasks = await TaskService.getTasks(filters);
      
      // Assert
      expect(tasks.every(t => t.status === 'done')).toBe(true);
    });
  });
  
  describe('createTask', () => {
    it('should create a new task', async () => {
      // ...
    });
    
    it('should throw error if project not found', async () => {
      // ...
      await expect(
        TaskService.createTask(data, userId)
      ).rejects.toThrow(NotFoundError);
    });
  });
});
```

---

## 📁 Import 순서

```typescript
// 1. Node.js 내장 모듈
import { readFile } from 'fs/promises';
import path from 'path';

// 2. 외부 라이브러리
import express from 'express';
import { z } from 'zod';

// 3. 내부 절대 경로 (alias)
import { TaskService } from '@/services/task.service';
import { authenticate } from '@/middlewares/auth.middleware';
import type { Task } from '@/types/task.types';

// 4. 상대 경로
import { logger } from '../utils/logger';
import { validateTask } from './validators';

// 5. CSS/스타일
import './styles.css';
```

---

## 💬 주석 규칙

### 함수 주석 (JSDoc)
```typescript
/**
 * 태스크 목록을 조회합니다
 * @param filters - 필터 조건
 * @param filters.projectId - 프로젝트 ID
 * @param filters.status - 태스크 상태
 * @returns 태스크 목록
 * @throws {NotFoundError} 프로젝트를 찾을 수 없을 때
 */
async function getTasks(filters: TaskFilters): Promise<Task[]> {
  // ...
}
```

### 코드 주석
```typescript
// ✅ GOOD: 왜(Why)를 설명
// 캐시 무효화를 위해 타임스탬프 추가
const url = `${baseUrl}?t=${Date.now()}`;

// ❌ BAD: 무엇(What)을 설명 (코드만 봐도 알 수 있음)
// 변수에 1을 더함
count = count + 1;

// ✅ GOOD: TODO/FIXME 주석
// TODO: 페이지네이션 구현 필요
// FIXME: 에지 케이스 처리 추가
```

---

## 🔐 환경 변수

### .env 파일 구조
```bash
# .env.example (Git에 커밋)
# Database
DATABASE_URL=mongodb://localhost:27017/myapp

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# API
API_PORT=5000
API_URL=http://localhost:5000

# Frontend
VITE_API_URL=http://localhost:5000/api

# Email (선택)
# SMTP_HOST=
# SMTP_PORT=
```

### 환경 변수 사용
```typescript
// ✅ GOOD: config 파일에서 중앙 관리
// config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string(),
  API_PORT: z.string().transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test'])
});

export const env = envSchema.parse(process.env);

// ❌ BAD: 직접 사용
const secret = process.env.JWT_SECRET; // 타입 안전하지 않음
```

---

## ✅ 커밋 메시지 규칙

### Conventional Commits
```bash
# 형식: <type>(<scope>): <subject>

# Types:
feat:     새로운 기능
fix:      버그 수정
docs:     문서 변경
style:    코드 포맷팅 (기능 변경 없음)
refactor: 리팩토링
test:     테스트 추가/수정
chore:    빌드/설정 변경

# 예시:
feat(auth): JWT 토큰 인증 구현
fix(tasks): 태스크 삭제 시 에러 수정
docs(api): API 명세서 업데이트
refactor(user): UserService 클래스로 리팩토링
test(tasks): TaskService 단위 테스트 추가
```

---

## 🚫 금지 사항

### ❌ 절대 하지 말 것
```typescript
// ❌ console.log 남기기 (프로덕션)
console.log('User data:', user); // logger 사용

// ❌ any 타입 남발
const data: any = fetchData();

// ❌ 하드코딩
const apiUrl = 'https://api.example.com'; // env 사용

// ❌ 중복 코드
if (user.role === 'admin') { /* ... */ }
if (user.role === 'admin') { /* ... */ }
// → 함수로 추출

// ❌ 매직 넘버
if (users.length > 100) { /* ... */ }
// → const MAX_USERS = 100;

// ❌ 거대한 함수 (100줄 이상)
function hugeFunction() {
  // 500 lines...
}
// → 작은 함수로 분리
```

---

## 📊 코드 리뷰 체크리스트

- [ ] TypeScript strict mode 준수
- [ ] 모든 함수/변수 명명 규칙 준수
- [ ] 에러 핸들링 구현
- [ ] 주석이 필요한 복잡한 로직에만 주석 작성
- [ ] 테스트 코드 작성 (중요 로직)
- [ ] 중복 코드 제거
- [ ] console.log 제거
- [ ] 환경 변수 사용 (하드코딩 금지)
- [ ] Git 커밋 메시지 규칙 준수

---

**작성일**: 2025-11-22  
**검토자**: 개발팀  
**승인일**: [날짜]
