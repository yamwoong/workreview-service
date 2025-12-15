# 🚀 WorkReview Template - 완벽 설정 가이드

> 이 문서만 따라하면 **처음부터 끝까지 모든 설정과 실행**이 가능합니다!

---

## 📋 목차

1. [시작하기 전에](#1-시작하기-전에)
2. [MongoDB 설치 및 실행](#2-mongodb-설치-및-실행)
3. [프로젝트 생성](#3-프로젝트-생성)
4. [백엔드 설정](#4-백엔드-설정)
5. [프론트엔드 설정](#5-프론트엔드-설정)
6. [Gmail 이메일 설정](#6-gmail-이메일-설정)
7. [실행하기](#7-실행하기)
8. [테스트하기](#8-테스트하기)
9. [문제 해결](#9-문제-해결)

---

## 1. 시작하기 전에

### ✅ 필수 프로그램 설치 확인

#### Node.js 설치 확인
```bash
node --version
# v18.0.0 이상이어야 함
```

**설치 안 되어있다면:**
- [Node.js 다운로드](https://nodejs.org/) (LTS 버전)
- 설치 후 터미널 재시작

#### MongoDB 설치 확인
```bash
mongod --version
# 버전 정보가 나오면 설치됨
```

**설치 안 되어있다면:** 아래 [MongoDB 설치](#2-mongodb-설치-및-실행) 섹션 참고

#### Git 설치 확인
```bash
git --version
```

---

## 2. MongoDB 설치 및 실행

### Windows

#### 2.1 MongoDB 다운로드
1. [MongoDB 다운로드](https://www.mongodb.com/try/download/community)
2. **MongoDB Community Server** 선택
3. Windows 버전 다운로드
4. 설치 파일 실행
5. **"Complete" 설치** 선택
6. **"Install MongoDB as a Service"** 체크 ✅
7. 설치 완료

#### 2.2 MongoDB 실행 확인
```bash
# 서비스 시작
net start MongoDB

# 또는 MongoDB Compass 설치되었다면 자동 실행
```

#### 2.3 연결 테스트
```bash
# MongoDB Shell 실행
mongosh

# 연결되면 이런 화면:
# Current Mongosh Log ID: ...
# Connecting to: mongodb://127.0.0.1:27017/
# Using MongoDB: 7.0.0
```

성공하면 `exit` 입력해서 나오기

### macOS
```bash
# Homebrew로 설치
brew tap mongodb/brew
brew install mongodb-community

# 서비스 시작
brew services start mongodb-community

# 확인
mongosh
```

### Ubuntu/Linux
```bash
# 설치
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# 서비스 시작
sudo systemctl start mongod
sudo systemctl enable mongod

# 확인
mongosh
```

---

## 3. 프로젝트 생성

### 방법 1: GitHub Template 사용 (추천)

#### 3.1 Template으로 새 레포지토리 생성
1. https://github.com/yourusername/workreview-service 이동
2. **"Use this template"** 버튼 클릭 (초록색)
3. **Repository name** 입력:
   ```
   my-awesome-app
   ```
4. **Description** (선택):
   ```
   My awesome application based on workreview template
   ```
5. **Public** 또는 **Private** 선택
6. **"Create repository"** 클릭

#### 3.2 클론
```bash
# 새 레포지토리 클론
git clone https://github.com/yourusername/my-awesome-app.git
cd my-awesome-app
```

### 방법 2: 직접 복사

```bash
# 템플릿 레포지토리 클론
git clone https://github.com/yourusername/workreview-service.git my-awesome-app
cd my-awesome-app

# Git 히스토리 제거
rm -rf .git

# 새로 초기화
git init
git add .
git commit -m "Initial commit from workreview template"

# 새 GitHub 레포지토리에 연결 (먼저 GitHub에서 생성)
git remote add origin https://github.com/yourusername/my-awesome-app.git
git branch -M main
git push -u origin main
```

---

## 4. 백엔드 설정

### 4.1 백엔드 폴더로 이동
```bash
cd backend
```

### 4.2 의존성 설치
```bash
npm install
```

**예상 시간**: 1-2분

### 4.3 환경 변수 파일 생성

#### `.env` 파일 생성
```bash
# Windows (PowerShell)
New-Item -Path .env -ItemType File

# Windows (CMD)
type nul > .env

# macOS/Linux
touch .env
```

#### `.env` 파일 내용 복사

텍스트 에디터로 `backend/.env` 파일을 열고 아래 내용을 **복사해서 붙여넣기**:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (프로젝트 이름 변경하세요!)
DATABASE_URL=mongodb://localhost:27017/my-awesome-app

# JWT Secrets (아래 명령어로 새로운 시크릿 생성!)
JWT_SECRET=CHANGE_THIS_TO_RANDOM_STRING_32_CHARS
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=CHANGE_THIS_TO_DIFFERENT_RANDOM_STRING
JWT_REFRESH_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Email Configuration (6단계에서 설정)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=My Awesome App <noreply@myapp.com>
```

### 4.4 보안 키 생성하기

#### JWT Secret 생성
```bash
# 터미널에서 실행
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**출력 예시:**
```
a3f5d8e9c2b4a1e7f9d3c5b8e2a4f6d9c1e3b5a7f9d2c4e6b8a1f3d5e7c9b4a2
```

이 값을 복사해서:
1. `.env` 파일 열기
2. `JWT_SECRET=` 뒤에 붙여넣기
3. 다시 명령어 실행해서 다른 값 생성
4. `JWT_REFRESH_SECRET=` 뒤에 붙여넣기

**최종 예시:**
```env
JWT_SECRET=a3f5d8e9c2b4a1e7f9d3c5b8e2a4f6d9c1e3b5a7f9d2c4e6b8a1f3d5e7c9b4a2
JWT_REFRESH_SECRET=f2c8b4e6a9d1c3e5b7f9a2d4c6e8b1a3f5d7c9e2b4a6d8c1e3f5b7a9c2e4d6
```

### 4.5 데이터베이스 이름 변경

`.env` 파일에서 데이터베이스 이름을 프로젝트에 맞게 변경:

```env
# 변경 전
DATABASE_URL=mongodb://localhost:27017/my-awesome-app

# 변경 후 (원하는 이름으로)
DATABASE_URL=mongodb://localhost:27017/blog-app
```

### 4.6 Package.json 수정 (선택)

`backend/package.json` 파일 열기:

```json
{
  "name": "my-awesome-app-backend",  // 변경
  "version": "1.0.0",
  "description": "My awesome app backend",  // 변경
  // ...
}
```

---

## 5. 프론트엔드 설정

### 5.1 프론트엔드 폴더로 이동
```bash
# 백엔드 폴더에서
cd ../frontend
```

### 5.2 의존성 설치
```bash
npm install
```

**예상 시간**: 2-3분

### 5.3 환경 변수 파일 생성

#### `.env` 파일 생성
```bash
# Windows (PowerShell)
New-Item -Path .env -ItemType File

# Windows (CMD)
type nul > .env

# macOS/Linux
touch .env
```

#### `.env` 파일 내용

텍스트 에디터로 `frontend/.env` 파일을 열고:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Environment
VITE_ENV=development
```

### 5.4 Package.json 수정 (선택)

`frontend/package.json` 파일 열기:

```json
{
  "name": "my-awesome-app-frontend",  // 변경
  "version": "1.0.0",
  "description": "My awesome app frontend",  // 변경
  // ...
}
```

---

## 6. Gmail 이메일 설정

이메일 기능 (비밀번호 찾기)을 사용하려면 Gmail 앱 비밀번호가 필요합니다.

### 6.1 Gmail 앱 비밀번호 생성

#### Step 1: Google 계정 설정
1. https://myaccount.google.com/ 접속
2. 로그인

#### Step 2: 2단계 인증 활성화 (이미 되어있다면 Skip)
1. **보안** 메뉴 클릭
2. **Google에 로그인** 섹션
3. **2단계 인증** 클릭
4. 안내에 따라 활성화

#### Step 3: 앱 비밀번호 생성
1. 2단계 인증 페이지 하단 **앱 비밀번호** 클릭
2. 앱 선택: **메일**
3. 기기 선택: **Windows 컴퓨터** (또는 해당 기기)
4. **생성** 클릭
5. **16자리 비밀번호 복사** (예: `abcd efgh ijkl mnop`)

### 6.2 환경 변수에 설정

`backend/.env` 파일 열기:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com          # 본인 Gmail 주소
EMAIL_PASSWORD=abcdefghijklmnop           # 앱 비밀번호 (공백 제거)
EMAIL_FROM=My Awesome App <noreply@myapp.com>  # 발신자 이름
```

**주의**: 앱 비밀번호에서 **공백을 제거**하세요!
```
abcd efgh ijkl mnop  ❌
abcdefghijklmnop     ✅
```

### 6.3 이메일 설정 건너뛰기 (선택)

테스트만 하고 싶다면:
- 이메일 설정 건너뛰기 가능
- 비밀번호 찾기 기능만 작동 안 함
- 나머지 기능(회원가입, 로그인 등)은 정상 작동

---

## 7. 실행하기

### 7.1 터미널 2개 준비

#### Windows
- **터미널 1**: PowerShell 또는 CMD
- **터미널 2**: PowerShell 또는 CMD (새로 열기)

#### macOS/Linux
- **터미널 1**: Terminal 앱
- **터미널 2**: Terminal 앱 (새 탭 또는 창)

### 7.2 백엔드 실행

**터미널 1**에서:
```bash
# 프로젝트 루트로 이동
cd C:\Users\Woong\Code\my-awesome-app

# 백엔드 폴더로 이동
cd backend

# 실행!
npm run dev
```

**성공하면 이렇게 보임:**
```
서버가 포트 5000에서 실행 중입니다
MongoDB 연결 성공
```

**에러 나면?** → [문제 해결](#9-문제-해결) 섹션 참고

### 7.3 프론트엔드 실행

**터미널 2**에서:
```bash
# 프로젝트 루트로 이동
cd C:\Users\Woong\Code\my-awesome-app

# 프론트엔드 폴더로 이동
cd frontend

# 실행!
npm run dev
```

**성공하면 이렇게 보임:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 7.4 브라우저에서 열기

브라우저 주소창에 입력:
```
http://localhost:5173
```

**화면이 보이면 성공!** 🎉

---

## 8. 테스트하기

### 8.1 회원가입 테스트

1. 브라우저에서 **"Sign up"** 클릭
2. 정보 입력:
   - Email: `test@example.com`
   - Password: `Test1234!`
   - Confirm Password: `Test1234!`
   - Display name: `Test User`
3. **"Create account"** 클릭
4. 자동으로 로그인되어 프로필 페이지로 이동 ✅

### 8.2 프로필 수정 테스트

프로필 페이지에서:
1. Department: `Engineering` 입력
2. Position: `Developer` 입력
3. **"Save changes"** 클릭
4. 성공 메시지 확인 ✅

### 8.3 비밀번호 변경 테스트

1. **Change Password** 섹션으로 스크롤
2. Current password: `Test1234!`
3. New password: `NewTest1234!`
4. Confirm password: `NewTest1234!`
5. **"Change password"** 클릭
6. 성공 메시지 확인 ✅

### 8.4 로그아웃 및 재로그인

1. 페이지 하단 **"Sign out"** 클릭
2. 로그인 페이지로 이동
3. 새 비밀번호로 로그인:
   - Email: `test@example.com`
   - Password: `NewTest1234!` (변경한 비밀번호)
4. 로그인 성공 ✅

### 8.5 비밀번호 찾기 테스트 (이메일 설정했다면)

1. 로그아웃 상태에서 **"Forgot password?"** 클릭
2. Email 입력: `test@example.com`
3. **"Send reset link"** 클릭
4. Gmail 받은편지함 확인
5. 이메일에서 링크 클릭
6. 새 비밀번호 설정
7. 로그인 ✅

---

## 9. 문제 해결

### 문제 1: MongoDB 연결 실패

**에러 메시지:**
```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

**해결 방법:**
```bash
# MongoDB가 실행 중인지 확인
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# 실행 확인
mongosh
```

### 문제 2: Port 이미 사용 중

**에러 메시지:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**해결 방법 1: 다른 프로세스 종료**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID [PID번호] /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

**해결 방법 2: 포트 변경**
`backend/.env` 파일:
```env
PORT=5001  # 다른 포트로 변경
```

`frontend/.env` 파일도 수정:
```env
VITE_API_URL=http://localhost:5001/api  # 포트 일치
```

### 문제 3: npm install 실패

**에러 메시지:**
```
npm ERR! code EACCES
```

**해결 방법:**
```bash
# 관리자 권한으로 실행
# Windows: PowerShell을 관리자 권한으로 실행
# macOS/Linux: sudo 사용
sudo npm install
```

### 문제 4: 이메일 전송 실패

**에러 메시지:**
```
Error: Invalid login
```

**해결 방법:**
1. Gmail 앱 비밀번호 다시 확인
2. 공백 제거 확인
3. 2단계 인증 활성화 확인
4. `.env` 파일 저장 확인
5. 백엔드 서버 재시작

### 문제 5: CORS 에러

**에러 메시지 (브라우저 콘솔):**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**해결 방법:**
`backend/.env` 확인:
```env
FRONTEND_URL=http://localhost:5173  # 프론트엔드 URL과 일치
```

백엔드 재시작

### 문제 6: Vite 빌드 에러

**에러 메시지:**
```
Failed to resolve import
```

**해결 방법:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 10. 개발 시작하기

### 프로젝트 커스터마이징

#### 10.1 앱 이름 변경

**변경할 파일들:**
1. `frontend/src/pages/HomePage.tsx` - "WorkReview" → "My App"
2. `frontend/src/pages/auth/LoginPage.tsx` - 로그인 페이지 제목
3. `backend/src/utils/email.util.ts` - 이메일 템플릿

**검색 및 변경:**
```bash
# 프로젝트 루트에서
grep -r "WorkReview" frontend/src/pages/
# 찾은 파일들 수정
```

#### 10.2 새 기능 추가

**예시: 블로그 포스트 기능 추가**

1. **백엔드 모델 생성** (`backend/src/models/Post.model.ts`)
```typescript
import { Schema, model, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  author: Schema.Types.ObjectId;
  createdAt: Date;
}

const postSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const PostModel = model<IPost>('Post', postSchema);
```

2. **백엔드 라우트 생성** (`backend/src/routes/post.routes.ts`)
3. **프론트엔드 페이지 생성** (`frontend/src/pages/PostsPage.tsx`)
4. **API 클라이언트 추가** (`frontend/src/api/post.api.ts`)

---

## 11. 배포 준비

### Production 체크리스트

배포 전 확인사항:

```bash
# 1. 환경 변수 확인
backend/.env (프로덕션용)
  - NODE_ENV=production
  - 새로운 JWT 시크릿
  - MongoDB Atlas 연결 문자열
  - 프로덕션 프론트엔드 URL

# 2. 빌드
cd backend && npm run build
cd frontend && npm run build

# 3. 보안 검사
npm audit
npm audit fix

# 4. 테스트
npm test
```

---

## 12. 유용한 명령어

### 개발 중 자주 쓰는 명령어

```bash
# 백엔드 재시작
cd backend && npm run dev

# 프론트엔드 재시작
cd frontend && npm run dev

# MongoDB 초기화 (데이터 모두 삭제)
mongosh
use my-awesome-app
db.dropDatabase()

# 의존성 업데이트
npm update

# 캐시 정리
npm cache clean --force
```

---

## 13. 다음 단계

프로젝트가 정상 실행되었다면:

1. ✅ **Git에 커밋**
   ```bash
   git add .
   git commit -m "Initial setup complete"
   git push
   ```

2. ✅ **새 기능 개발 시작**
   - 비즈니스 로직 추가
   - 새로운 모델 생성
   - API 엔드포인트 추가
   - 프론트엔드 페이지 생성

3. ✅ **배포 준비**
   - Vercel (프론트엔드)
   - Railway/Render (백엔드)
   - MongoDB Atlas (데이터베이스)

---

## 14. 추가 리소스

### 공식 문서
- [React 문서](https://react.dev/)
- [Express 문서](https://expressjs.com/)
- [MongoDB 문서](https://www.mongodb.com/docs/)
- [TypeScript 문서](https://www.typescriptlang.org/)

### 참고 자료
- [JWT 가이드](https://jwt.io/introduction)
- [Mongoose 가이드](https://mongoosejs.com/docs/guide.html)
- [TailwindCSS 문서](https://tailwindcss.com/docs)

---

## 💡 팁

### 개발 효율 높이기

1. **Hot Reload 활용**
   - 코드 수정하면 자동으로 새로고침
   - 터미널 2개 항상 켜두기

2. **MongoDB Compass 사용**
   - GUI로 데이터베이스 관리
   - 데이터 직접 확인 및 수정

3. **VS Code Extensions**
   - ESLint
   - Prettier
   - Thunder Client (API 테스트)
   - MongoDB for VS Code

---

## 🎉 완료!

이제 모든 설정이 끝났습니다!

**문제가 있다면:**
- [문제 해결](#9-문제-해결) 섹션 확인
- GitHub Issues에 질문 남기기

**성공했다면:**
- ⭐ 템플릿 레포지토리에 Star 주기
- 💪 멋진 프로젝트 만들기 시작!

---

<div align="center">
  <strong>Happy Coding! 🚀</strong>
</div>
