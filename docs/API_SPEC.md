# 📡 API 명세서

> **Base URL**: `https://api.example.com`  
> **Version**: v1  
> **Protocol**: REST + WebSocket

---

## 🔑 인증

모든 보호된 엔드포인트는 JWT 토큰이 필요합니다.

### Header 형식
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📚 API 엔드포인트

## 1️⃣ 인증 (Authentication)

### 회원가입
```http
POST /api/auth/register
```

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "securePassword123!",
  "name": "홍길동"
}
```

**Response** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "홍길동",
      "role": "member"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "회원가입이 완료되었습니다"
}
```

**Validation Errors** `400 Bad Request`
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력값이 유효하지 않습니다",
    "details": [
      {
        "field": "email",
        "message": "이메일 형식이 올바르지 않습니다"
      },
      {
        "field": "password",
        "message": "비밀번호는 최소 8자 이상이어야 합니다"
      }
    ]
  }
}
```

---

### 로그인
```http
POST /api/auth/login
```

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "securePassword123!"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "홍길동",
      "role": "member",
      "avatar": "https://..."
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error** `401 Unauthorized`
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "이메일 또는 비밀번호가 올바르지 않습니다"
  }
}
```

---

### 토큰 갱신
```http
POST /api/auth/refresh
```

**Request Body**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 로그아웃
```http
POST /api/auth/logout
🔒 Requires Authentication
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "로그아웃되었습니다"
}
```

---

## 2️⃣ 사용자 (Users)

### 내 정보 조회
```http
GET /api/users/me
🔒 Requires Authentication
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "홍길동",
    "role": "member",
    "avatar": "https://...",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### 프로필 수정
```http
PATCH /api/users/me
🔒 Requires Authentication
```

**Request Body**
```json
{
  "name": "김철수",
  "avatar": "https://..."
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "김철수",
    "avatar": "https://...",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  },
  "message": "프로필이 업데이트되었습니다"
}
```

---

### 비밀번호 변경
```http
PUT /api/users/me/password
🔒 Requires Authentication
```

**Request Body**
```json
{
  "currentPassword": "oldPassword123!",
  "newPassword": "newPassword456!"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "비밀번호가 변경되었습니다"
}
```

---

## 3️⃣ 프로젝트 (Projects)

### 프로젝트 목록 조회
```http
GET /api/projects?page=1&limit=20&status=active
🔒 Requires Authentication
```

**Query Parameters**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | 페이지 번호 |
| limit | number | 20 | 페이지당 항목 수 |
| status | string | all | active, archived, all |
| search | string | - | 검색어 (제목, 설명) |

**Response** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "웹 애플리케이션 개발",
      "description": "React + Node.js 프로젝트",
      "owner": {
        "id": "507f1f77bcf86cd799439012",
        "name": "홍길동",
        "avatar": "https://..."
      },
      "members": [
        {
          "id": "507f1f77bcf86cd799439013",
          "name": "김영희",
          "role": "member"
        }
      ],
      "status": "active",
      "taskCount": {
        "total": 45,
        "todo": 10,
        "inProgress": 15,
        "done": 20
      },
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

---

### 프로젝트 생성
```http
POST /api/projects
🔒 Requires Authentication
```

**Request Body**
```json
{
  "title": "새 프로젝트",
  "description": "프로젝트 설명",
  "members": ["507f1f77bcf86cd799439013"]
}
```

**Response** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "title": "새 프로젝트",
    "description": "프로젝트 설명",
    "owner": {
      "id": "507f1f77bcf86cd799439011",
      "name": "홍길동"
    },
    "members": [...],
    "status": "active",
    "createdAt": "2025-01-15T10:30:00.000Z"
  },
  "message": "프로젝트가 생성되었습니다"
}
```

---

### 프로젝트 상세 조회
```http
GET /api/projects/:id
🔒 Requires Authentication
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "웹 애플리케이션 개발",
    "description": "React + Node.js 프로젝트",
    "owner": {...},
    "members": [...],
    "status": "active",
    "tasks": [...],
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Error** `404 Not Found`
```json
{
  "success": false,
  "error": {
    "code": "PROJECT_NOT_FOUND",
    "message": "프로젝트를 찾을 수 없습니다"
  }
}
```

---

### 프로젝트 수정
```http
PATCH /api/projects/:id
🔒 Requires Authentication (Owner only)
```

**Request Body**
```json
{
  "title": "수정된 제목",
  "description": "수정된 설명"
}
```

**Response** `200 OK`

---

### 프로젝트 삭제
```http
DELETE /api/projects/:id
🔒 Requires Authentication (Owner only)
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "프로젝트가 삭제되었습니다"
}
```

**Error** `403 Forbidden`
```json
{
  "success": false,
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "권한이 없습니다"
  }
}
```

---

### 프로젝트 멤버 추가
```http
POST /api/projects/:id/members
🔒 Requires Authentication (Owner only)
```

**Request Body**
```json
{
  "userId": "507f1f77bcf86cd799439015"
}
```

**Response** `200 OK`

---

### 프로젝트 멤버 제거
```http
DELETE /api/projects/:id/members/:userId
🔒 Requires Authentication (Owner only)
```

**Response** `200 OK`

---

## 4️⃣ 태스크 (Tasks)

### 태스크 목록 조회
```http
GET /api/tasks?projectId=xxx&status=todo&assignee=xxx
🔒 Requires Authentication
```

**Query Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| projectId | string | Yes | 프로젝트 ID |
| status | string | No | todo, in_progress, done |
| assignee | string | No | 담당자 ID |
| priority | string | No | low, medium, high |
| page | number | No | 페이지 번호 (default: 1) |
| limit | number | No | 페이지당 항목 (default: 50) |

**Response** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439020",
      "title": "로그인 API 구현",
      "description": "JWT 기반 인증 API 개발",
      "project": {
        "id": "507f1f77bcf86cd799439011",
        "title": "웹 애플리케이션 개발"
      },
      "assignee": {
        "id": "507f1f77bcf86cd799439012",
        "name": "홍길동",
        "avatar": "https://..."
      },
      "status": "in_progress",
      "priority": "high",
      "dueDate": "2025-01-20T00:00:00.000Z",
      "createdBy": {
        "id": "507f1f77bcf86cd799439011",
        "name": "관리자"
      },
      "createdAt": "2025-01-10T00:00:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 12,
    "totalPages": 1
  }
}
```

---

### 태스크 생성
```http
POST /api/tasks
🔒 Requires Authentication
```

**Request Body**
```json
{
  "title": "새로운 태스크",
  "description": "태스크 상세 설명",
  "projectId": "507f1f77bcf86cd799439011",
  "assigneeId": "507f1f77bcf86cd799439012",
  "priority": "high",
  "dueDate": "2025-01-25T00:00:00.000Z"
}
```

**Response** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439021",
    "title": "새로운 태스크",
    "status": "todo",
    "priority": "high",
    ...
  },
  "message": "태스크가 생성되었습니다"
}
```

---

### 태스크 상세 조회
```http
GET /api/tasks/:id
🔒 Requires Authentication
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439020",
    "title": "로그인 API 구현",
    "description": "JWT 기반 인증 API 개발",
    "project": {...},
    "assignee": {...},
    "status": "in_progress",
    "priority": "high",
    "comments": [
      {
        "id": "507f1f77bcf86cd799439030",
        "content": "진행 중입니다",
        "author": {
          "id": "507f1f77bcf86cd799439012",
          "name": "홍길동"
        },
        "createdAt": "2025-01-15T09:00:00.000Z"
      }
    ],
    "createdAt": "2025-01-10T00:00:00.000Z"
  }
}
```

---

### 태스크 수정
```http
PATCH /api/tasks/:id
🔒 Requires Authentication
```

**Request Body**
```json
{
  "title": "수정된 제목",
  "status": "done",
  "priority": "medium"
}
```

**Response** `200 OK`

---

### 태스크 삭제
```http
DELETE /api/tasks/:id
🔒 Requires Authentication
```

**Response** `200 OK`

---

### 태스크 상태 변경
```http
PATCH /api/tasks/:id/status
🔒 Requires Authentication
```

**Request Body**
```json
{
  "status": "done"
}
```

**Response** `200 OK`

---

## 5️⃣ 댓글 (Comments)

### 댓글 생성
```http
POST /api/tasks/:taskId/comments
🔒 Requires Authentication
```

**Request Body**
```json
{
  "content": "댓글 내용입니다"
}
```

**Response** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439031",
    "content": "댓글 내용입니다",
    "author": {
      "id": "507f1f77bcf86cd799439012",
      "name": "홍길동",
      "avatar": "https://..."
    },
    "task": "507f1f77bcf86cd799439020",
    "createdAt": "2025-01-15T10:30:00.000Z"
  },
  "message": "댓글이 작성되었습니다"
}
```

---

### 댓글 수정
```http
PATCH /api/comments/:id
🔒 Requires Authentication (Author only)
```

**Request Body**
```json
{
  "content": "수정된 댓글 내용"
}
```

**Response** `200 OK`

---

### 댓글 삭제
```http
DELETE /api/comments/:id
🔒 Requires Authentication (Author only)
```

**Response** `200 OK`

---

## 6️⃣ 통계 (Analytics)

### 프로젝트 통계
```http
GET /api/analytics/projects/:id
🔒 Requires Authentication
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "projectId": "507f1f77bcf86cd799439011",
    "taskStats": {
      "total": 45,
      "todo": 10,
      "inProgress": 15,
      "done": 20
    },
    "priorityStats": {
      "high": 12,
      "medium": 20,
      "low": 13
    },
    "memberActivity": [
      {
        "userId": "507f1f77bcf86cd799439012",
        "name": "홍길동",
        "tasksCompleted": 15,
        "tasksInProgress": 5
      }
    ],
    "recentActivity": [
      {
        "type": "task_created",
        "taskId": "507f1f77bcf86cd799439020",
        "userId": "507f1f77bcf86cd799439012",
        "timestamp": "2025-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

---

## 🔌 WebSocket 이벤트

### 연결
```javascript
// Client
import io from 'socket.io-client';

const socket = io('wss://api.example.com', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### 이벤트 목록

#### 클라이언트 → 서버

**프로젝트 참가**
```javascript
socket.emit('project:join', { projectId: 'xxx' });
```

**태스크 생성**
```javascript
socket.emit('task:create', {
  title: '새 태스크',
  projectId: 'xxx',
  ...
});
```

**채팅 메시지**
```javascript
socket.emit('chat:message', {
  projectId: 'xxx',
  message: '안녕하세요'
});
```

**타이핑 상태**
```javascript
socket.emit('user:typing', {
  projectId: 'xxx',
  isTyping: true
});
```

---

#### 서버 → 클라이언트

**태스크 생성됨**
```javascript
socket.on('task:created', (data) => {
  console.log('새 태스크:', data);
  // data: { task: {...}, createdBy: {...} }
});
```

**태스크 업데이트됨**
```javascript
socket.on('task:updated', (data) => {
  console.log('태스크 업데이트:', data);
  // data: { taskId: 'xxx', updates: {...} }
});
```

**새 채팅 메시지**
```javascript
socket.on('chat:newMessage', (data) => {
  console.log('새 메시지:', data);
  // data: { message: '...', author: {...}, timestamp: '...' }
});
```

**사용자 온라인 상태**
```javascript
socket.on('user:online', (data) => {
  console.log('사용자 접속:', data);
  // data: { userId: 'xxx', name: '홍길동' }
});

socket.on('user:offline', (data) => {
  console.log('사용자 종료:', data);
});
```

---

## 🚨 에러 코드

| HTTP Status | Error Code | 설명 |
|-------------|------------|------|
| 400 | VALIDATION_ERROR | 입력값 검증 실패 |
| 401 | UNAUTHORIZED | 인증 필요 |
| 401 | INVALID_CREDENTIALS | 잘못된 로그인 정보 |
| 401 | TOKEN_EXPIRED | 토큰 만료 |
| 403 | PERMISSION_DENIED | 권한 없음 |
| 404 | NOT_FOUND | 리소스를 찾을 수 없음 |
| 404 | PROJECT_NOT_FOUND | 프로젝트를 찾을 수 없음 |
| 404 | TASK_NOT_FOUND | 태스크를 찾을 수 없음 |
| 409 | ALREADY_EXISTS | 이미 존재하는 리소스 |
| 429 | RATE_LIMIT_EXCEEDED | 요청 횟수 초과 |
| 500 | INTERNAL_SERVER_ERROR | 서버 오류 |

---

## 📝 사용 예시 (JavaScript/TypeScript)

### Axios 설정
```typescript
// api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.example.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor (토큰 자동 추가)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor (에러 처리)
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그인 페이지로 리다이렉트
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;
```

### API 함수 예시
```typescript
// api/tasks.ts
import apiClient from './client';

export const taskAPI = {
  // 태스크 목록 조회
  getTasks: (params: {
    projectId: string;
    status?: string;
    page?: number;
  }) => {
    return apiClient.get('/tasks', { params });
  },

  // 태스크 생성
  createTask: (data: {
    title: string;
    projectId: string;
    assigneeId?: string;
  }) => {
    return apiClient.post('/tasks', data);
  },

  // 태스크 수정
  updateTask: (id: string, data: Partial<Task>) => {
    return apiClient.patch(`/tasks/${id}`, data);
  },

  // 태스크 삭제
  deleteTask: (id: string) => {
    return apiClient.delete(`/tasks/${id}`);
  }
};
```

### React Query 사용 예시
```typescript
// hooks/useTasks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskAPI } from '@/api/tasks';

export const useTasks = (projectId: string) => {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => taskAPI.getTasks({ projectId })
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: taskAPI.createTask,
    onSuccess: (data) => {
      // 태스크 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
};
```

---

**문서 버전**: 1.0.0  
**최종 수정일**: 2025-11-22  
**작성자**: API 팀
