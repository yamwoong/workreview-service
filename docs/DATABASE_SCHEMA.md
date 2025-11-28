# 🗄️ 데이터베이스 스키마 설계

> **데이터베이스**: MongoDB 7.x  
> **ODM**: Mongoose  
> **작성일**: 2025-11-22

---

## 📊 ERD (Entity Relationship Diagram)

```
┌─────────────────┐
│      User       │
│─────────────────│
│ _id (PK)       │
│ email          │◄────────┐
│ password       │         │
│ name           │         │ owner (1:N)
│ role           │         │
│ avatar         │         │
└─────────────────┘         │
        │                   │
        │ members           │
        │ (M:N)            │
        │                   │
        ▼                   │
┌─────────────────┐         │
│    Project      │─────────┘
│─────────────────│
│ _id (PK)       │
│ title          │
│ description    │         
│ owner (FK)     │──────┐
│ members (FK[]) │      │
│ status         │      │ project (1:N)
└─────────────────┘      │
                         │
                         ▼
                 ┌─────────────────┐
                 │      Task       │
                 │─────────────────│
                 │ _id (PK)       │
                 │ title          │
                 │ description    │
                 │ project (FK)   │
                 │ assignee (FK)  │
                 │ status         │
                 │ priority       │
                 │ dueDate        │
                 │ createdBy (FK) │
                 └─────────────────┘
                         │
                         │
                         │ task (1:N)
                         │
                         ▼
                 ┌─────────────────┐
                 │    Comment      │
                 │─────────────────│
                 │ _id (PK)       │
                 │ content        │
                 │ task (FK)      │
                 │ author (FK)    │
                 └─────────────────┘
```

---

## 📋 컬렉션 상세 스키마

### 1. Users 컬렉션

```typescript
import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;  // bcrypt 해시
  name: string;
  role: 'admin' | 'member' | 'guest';
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, '이메일은 필수입니다'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, '유효한 이메일을 입력하세요']
  },
  password: {
    type: String,
    required: [true, '비밀번호는 필수입니다'],
    minlength: [8, '비밀번호는 최소 8자 이상이어야 합니다'],
    select: false  // 기본 조회 시 제외
  },
  name: {
    type: String,
    required: [true, '이름은 필수입니다'],
    trim: true,
    minlength: [2, '이름은 최소 2자 이상이어야 합니다'],
    maxlength: [50, '이름은 최대 50자까지 가능합니다']
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'member', 'guest'],
      message: '{VALUE}는 유효하지 않은 역할입니다'
    },
    default: 'member'
  },
  avatar: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,  // createdAt, updatedAt 자동 생성
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.password;  // JSON 변환 시 비밀번호 제거
      return ret;
    }
  }
});

// 인덱스
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ role: 1 });

// 비밀번호 해싱 미들웨어
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const bcrypt = require('bcrypt');
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// 메서드: 비밀번호 검증
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  const bcrypt = require('bcrypt');
  return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = model<IUser>('User', userSchema);
```

**샘플 데이터:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5gy0P6x7zK8Ru",
  "name": "홍길동",
  "role": "member",
  "avatar": "https://example.com/avatars/user1.jpg",
  "isActive": true,
  "lastLogin": "2025-01-15T10:30:00.000Z",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

---

### 2. Projects 컬렉션

```typescript
interface IProject extends Document {
  title: string;
  description: string;
  owner: Schema.Types.ObjectId;  // User 참조
  members: Schema.Types.ObjectId[];  // User 참조 배열
  status: 'active' | 'archived' | 'completed';
  settings: {
    isPublic: boolean;
    allowGuests: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>({
  title: {
    type: String,
    required: [true, '프로젝트 제목은 필수입니다'],
    trim: true,
    minlength: [3, '제목은 최소 3자 이상이어야 합니다'],
    maxlength: [100, '제목은 최대 100자까지 가능합니다']
  },
  description: {
    type: String,
    default: '',
    maxlength: [500, '설명은 최대 500자까지 가능합니다']
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '프로젝트 소유자는 필수입니다'],
    index: true
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['active', 'archived', 'completed'],
    default: 'active',
    index: true
  },
  settings: {
    isPublic: {
      type: Boolean,
      default: false
    },
    allowGuests: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 인덱스
projectSchema.index({ owner: 1, status: 1 });
projectSchema.index({ members: 1 });
projectSchema.index({ createdAt: -1 });
projectSchema.index({ title: 'text', description: 'text' });  // 텍스트 검색

// Virtual: 태스크 수
projectSchema.virtual('taskCount', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
  count: true
});

// Virtual: 활성 멤버 수
projectSchema.virtual('memberCount').get(function() {
  return this.members.length + 1;  // owner 포함
});

export const ProjectModel = model<IProject>('Project', projectSchema);
```

**샘플 데이터:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "웹 애플리케이션 개발",
  "description": "React + Node.js 기반 풀스택 프로젝트",
  "owner": "507f1f77bcf86cd799439011",
  "members": [
    "507f1f77bcf86cd799439013",
    "507f1f77bcf86cd799439014"
  ],
  "status": "active",
  "settings": {
    "isPublic": false,
    "allowGuests": true
  },
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-10T00:00:00.000Z"
}
```

---

### 3. Tasks 컬렉션

```typescript
interface ITask extends Document {
  title: string;
  description: string;
  project: Schema.Types.ObjectId;  // Project 참조
  assignee?: Schema.Types.ObjectId;  // User 참조
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  tags: string[];
  attachments: Array<{
    filename: string;
    url: string;
    uploadedAt: Date;
  }>;
  createdBy: Schema.Types.ObjectId;  // User 참조
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: [true, '태스크 제목은 필수입니다'],
    trim: true,
    minlength: [3, '제목은 최소 3자 이상이어야 합니다'],
    maxlength: [200, '제목은 최대 200자까지 가능합니다']
  },
  description: {
    type: String,
    default: '',
    maxlength: [2000, '설명은 최대 2000자까지 가능합니다']
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, '프로젝트는 필수입니다'],
    index: true
  },
  assignee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  status: {
    type: String,
    enum: {
      values: ['todo', 'in_progress', 'done'],
      message: '{VALUE}는 유효하지 않은 상태입니다'
    },
    default: 'todo',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
    index: true
  },
  dueDate: {
    type: Date,
    default: null,
    validate: {
      validator: function(v: Date) {
        return !v || v > new Date();
      },
      message: '마감일은 현재 시간 이후여야 합니다'
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  attachments: [{
    filename: { type: String, required: true },
    url: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// 복합 인덱스
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignee: 1, status: 1 });
taskSchema.index({ project: 1, priority: -1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ createdAt: -1 });

// 텍스트 검색 인덱스
taskSchema.index({ title: 'text', description: 'text' });

// Virtual: 댓글 수
taskSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'task',
  count: true
});

// Virtual: 지연 여부
taskSchema.virtual('isOverdue').get(function() {
  return this.dueDate && this.dueDate < new Date() && this.status !== 'done';
});

export const TaskModel = model<ITask>('Task', taskSchema);
```

**샘플 데이터:**
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "title": "로그인 API 구현",
  "description": "JWT 기반 인증 API 개발",
  "project": "507f1f77bcf86cd799439012",
  "assignee": "507f1f77bcf86cd799439011",
  "status": "in_progress",
  "priority": "high",
  "dueDate": "2025-01-20T00:00:00.000Z",
  "tags": ["backend", "authentication", "api"],
  "attachments": [
    {
      "filename": "api-design.pdf",
      "url": "https://example.com/files/api-design.pdf",
      "uploadedAt": "2025-01-10T10:00:00.000Z"
    }
  ],
  "createdBy": "507f1f77bcf86cd799439013",
  "createdAt": "2025-01-10T00:00:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

---

### 4. Comments 컬렉션

```typescript
interface IComment extends Document {
  content: string;
  task: Schema.Types.ObjectId;  // Task 참조
  author: Schema.Types.ObjectId;  // User 참조
  parent?: Schema.Types.ObjectId;  // Comment 참조 (대댓글용)
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>({
  content: {
    type: String,
    required: [true, '댓글 내용은 필수입니다'],
    trim: true,
    minlength: [1, '댓글은 최소 1자 이상이어야 합니다'],
    maxlength: [1000, '댓글은 최대 1000자까지 가능합니다']
  },
  task: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: [true, '태스크는 필수입니다'],
    index: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '작성자는 필수입니다'],
    index: true
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null  // null이면 최상위 댓글
  },
  isEdited: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// 인덱스
commentSchema.index({ task: 1, createdAt: -1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parent: 1 });

// 수정 시 isEdited 플래그 설정
commentSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.isNew) {
    this.isEdited = true;
  }
  next();
});

export const CommentModel = model<IComment>('Comment', commentSchema);
```

**샘플 데이터:**
```json
{
  "_id": "507f1f77bcf86cd799439016",
  "content": "API 설계 문서를 참고해주세요",
  "task": "507f1f77bcf86cd799439015",
  "author": "507f1f77bcf86cd799439013",
  "parent": null,
  "isEdited": false,
  "createdAt": "2025-01-11T09:00:00.000Z",
  "updatedAt": "2025-01-11T09:00:00.000Z"
}
```

---

### 5. Notifications 컬렉션 (선택사항)

```typescript
interface INotification extends Document {
  recipient: Schema.Types.ObjectId;  // User 참조
  type: 'task_assigned' | 'comment_added' | 'task_updated' | 'mention';
  title: string;
  message: string;
  relatedTask?: Schema.Types.ObjectId;  // Task 참조
  relatedProject?: Schema.Types.ObjectId;  // Project 참조
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['task_assigned', 'comment_added', 'task_updated', 'mention'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedTask: {
    type: Schema.Types.ObjectId,
    ref: 'Task'
  },
  relatedProject: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: Date
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// 인덱스
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });

// 읽음 처리 시 readAt 설정
notificationSchema.pre('save', function(next) {
  if (this.isModified('isRead') && this.isRead) {
    this.readAt = new Date();
  }
  next();
});

export const NotificationModel = model<INotification>('Notification', notificationSchema);
```

---

## 📈 인덱스 전략

### 단일 필드 인덱스
```javascript
// User
{ email: 1 }           // 로그인, 중복 체크
{ role: 1 }            // 역할별 필터링
{ createdAt: -1 }      // 최신 사용자 조회

// Project
{ owner: 1 }           // 소유자별 프로젝트
{ status: 1 }          // 상태별 필터링
{ members: 1 }         // 멤버십 확인

// Task
{ project: 1 }         // 프로젝트별 태스크
{ assignee: 1 }        // 담당자별 태스크
{ status: 1 }          // 상태별 필터링
{ priority: 1 }        // 우선순위 정렬
{ dueDate: 1 }         // 마감일 정렬
```

### 복합 인덱스
```javascript
// Project
{ owner: 1, status: 1 }  // 소유자의 활성 프로젝트

// Task
{ project: 1, status: 1 }      // 프로젝트의 상태별 태스크
{ assignee: 1, status: 1 }     // 담당자의 진행 중 태스크
{ project: 1, priority: -1 }   // 프로젝트의 우선순위 정렬

// Comment
{ task: 1, createdAt: -1 }     // 태스크의 최신 댓글
```

### 텍스트 검색 인덱스
```javascript
// Project
{ title: 'text', description: 'text' }

// Task
{ title: 'text', description: 'text' }
```

**사용 예시:**
```typescript
// 텍스트 검색
const tasks = await TaskModel.find({
  $text: { $search: 'API 구현' }
});
```

---

## 🔗 관계 설정 (Populate)

### 사용 예시

```typescript
// 1. 단일 필드 populate
const project = await ProjectModel
  .findById(projectId)
  .populate('owner', 'name email avatar');  // 특정 필드만 선택

// 2. 배열 필드 populate
const project = await ProjectModel
  .findById(projectId)
  .populate('members', 'name email avatar role');

// 3. 중첩 populate
const task = await TaskModel
  .findById(taskId)
  .populate('project')
  .populate('assignee', 'name email avatar')
  .populate({
    path: 'project',
    populate: {
      path: 'owner',
      select: 'name email'
    }
  });

// 4. Virtual populate
const project = await ProjectModel
  .findById(projectId)
  .populate('taskCount');  // virtual 필드
```

---

## 🔒 데이터 검증

### Mongoose 검증 + Zod

**Mongoose 스키마 레벨:**
```typescript
// 기본 검증은 Mongoose 스키마에서
{
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/
  }
}
```

**API 레벨 (Zod):**
```typescript
// 더 복잡한 검증은 Zod로
import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string()
    .min(3, '제목은 최소 3자 이상')
    .max(200, '제목은 최대 200자까지'),
  projectId: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, '유효하지 않은 프로젝트 ID'),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string()
    .datetime()
    .optional()
    .refine(
      (date) => !date || new Date(date) > new Date(),
      '마감일은 현재 시간 이후여야 합니다'
    )
});
```

---

## 🚀 쿼리 최적화 팁

### 1. Lean Queries (성능 최적화)
```typescript
// ❌ BAD: Mongoose 문서 객체 반환 (느림)
const tasks = await TaskModel.find({ project: projectId });

// ✅ GOOD: 순수 JavaScript 객체 반환 (빠름)
const tasks = await TaskModel.find({ project: projectId }).lean();
```

### 2. Select 최소화
```typescript
// ❌ BAD: 모든 필드 조회
const users = await UserModel.find();

// ✅ GOOD: 필요한 필드만 조회
const users = await UserModel.find().select('name email avatar');
```

### 3. 페이지네이션
```typescript
const page = 1;
const limit = 20;

const tasks = await TaskModel
  .find({ project: projectId })
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();

const total = await TaskModel.countDocuments({ project: projectId });
```

### 4. Aggregation Pipeline (복잡한 쿼리)
```typescript
// 프로젝트별 태스크 통계
const stats = await TaskModel.aggregate([
  { $match: { project: new ObjectId(projectId) } },
  {
    $group: {
      _id: '$status',
      count: { $sum: 1 },
      highPriority: {
        $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
      }
    }
  }
]);

// 결과:
// [
//   { _id: 'todo', count: 10, highPriority: 3 },
//   { _id: 'in_progress', count: 5, highPriority: 2 },
//   { _id: 'done', count: 20, highPriority: 5 }
// ]
```

---

## 🔄 마이그레이션 전략

### 스키마 변경 시 주의사항

```typescript
// 1. 필드 추가 (안전)
projectSchema.add({
  newField: { type: String, default: '' }
});

// 2. 필드 이름 변경 (마이그레이션 스크립트 필요)
// scripts/migrate-field-rename.ts
await ProjectModel.updateMany(
  {},
  { $rename: { oldFieldName: newFieldName } }
);

// 3. 필드 타입 변경 (조심)
// 기존 데이터를 백업하고 변환 스크립트 실행
```

---

## 📊 샘플 데이터 생성 스크립트

```typescript
// scripts/seed.ts
import { UserModel, ProjectModel, TaskModel } from '../models';

async function seedDatabase() {
  // 1. Users
  const users = await UserModel.create([
    {
      email: 'admin@example.com',
      password: 'password123',
      name: '관리자',
      role: 'admin'
    },
    {
      email: 'user1@example.com',
      password: 'password123',
      name: '홍길동',
      role: 'member'
    },
    {
      email: 'user2@example.com',
      password: 'password123',
      name: '김영희',
      role: 'member'
    }
  ]);

  // 2. Projects
  const project = await ProjectModel.create({
    title: '웹 애플리케이션 개발',
    description: 'React + Node.js 프로젝트',
    owner: users[0]._id,
    members: [users[1]._id, users[2]._id]
  });

  // 3. Tasks
  await TaskModel.create([
    {
      title: '로그인 API 구현',
      project: project._id,
      assignee: users[1]._id,
      status: 'in_progress',
      priority: 'high',
      createdBy: users[0]._id
    },
    {
      title: 'UI 디자인',
      project: project._id,
      assignee: users[2]._id,
      status: 'todo',
      priority: 'medium',
      createdBy: users[0]._id
    }
  ]);

  console.log('✅ Database seeded successfully');
}

seedDatabase();
```

---

**작성일**: 2025-11-22  
**검토자**: DB 팀  
**승인일**: [날짜]
