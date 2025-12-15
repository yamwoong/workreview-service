# 🚀 빠른 시작 가이드

이 템플릿을 사용하여 5분 안에 프로젝트를 시작하세요.

## 📋 사전 요구사항

시작하기 전에 다음이 설치되어 있어야 합니다:
- Node.js 18 이상
- MongoDB (로컬 또는 Atlas)
- Gmail 계정 (비밀번호 재설정 기능용)

## 1️⃣ 프로젝트 생성

### GitHub 템플릿 사용 (권장)
1. 이 저장소 상단의 **"Use this template"** 버튼 클릭
2. 새 저장소 이름 입력 (예: `my-awesome-app`)
3. **"Create repository"** 클릭
4. 생성된 저장소 클론:
```bash
git clone https://github.com/yourusername/my-awesome-app.git
cd my-awesome-app
```

### 또는 직접 클론
```bash
git clone https://github.com/yourusername/workreview-service.git my-project
cd my-project
```

## 2️⃣ 백엔드 설정

```bash
cd backend
npm install
```

### `.env` 파일 생성
`backend/.env` 파일을 만들고 다음 내용을 붙여넣으세요:

```env
# 서버
PORT=5000
NODE_ENV=development

# 데이터베이스 (아래 중 하나 선택)
# 로컬 MongoDB:
DATABASE_URL=mongodb://localhost:27017/your-project-name

# 또는 MongoDB Atlas:
# DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/your-db-name

# JWT 시크릿 (아래 명령어로 생성하거나 임의의 긴 문자열)
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

# 프론트엔드 URL
FRONTEND_URL=http://localhost:5173

# Gmail SMTP (선택사항 - 비밀번호 재설정 기능용)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=Your App <noreply@yourapp.com>
```

#### 🔑 Gmail 앱 비밀번호 생성 (이메일 기능 사용 시)
1. [Google 계정 보안](https://myaccount.google.com/security) 접속
2. 2단계 인증 활성화
3. 앱 비밀번호 생성 → 생성된 16자리를 `EMAIL_PASSWORD`에 입력

## 3️⃣ 프론트엔드 설정

```bash
cd ../frontend
npm install
```

### `.env` 파일 생성
`frontend/.env` 파일을 만들고 다음 내용을 붙여넣으세요:

```env
VITE_API_URL=http://localhost:5000/api
VITE_ENV=development
```

## 4️⃣ 실행

### 터미널 1 - 백엔드
```bash
cd backend
npm run dev
```

✅ 성공 시: `Server running on port 5000`

### 터미널 2 - 프론트엔드
```bash
cd frontend
npm run dev
```

✅ 성공 시: `Local: http://localhost:5173/`

## 5️⃣ 접속

브라우저에서 http://localhost:5173 을 열면 완료! 🎉

## 📝 다음 단계

### 프로젝트 커스터마이징
1. **프로젝트 이름 변경**
   - `package.json` (backend, frontend) 파일의 `name` 수정
   - 앱 이름 검색 후 변경: `frontend/src/pages/` 폴더

2. **데이터베이스 이름 변경**
   - `.env` 파일의 `DATABASE_URL`에서 DB 이름 수정

3. **브랜딩 수정**
   - 로고, 색상, 이메일 템플릿 등을 원하는 대로 수정

### 기능 개발
이제 인증 시스템이 준비되었으니 비즈니스 로직을 추가하세요:
- 새로운 모델 생성 (`backend/src/models/`)
- API 라우트 추가 (`backend/src/routes/`)
- 프론트엔드 페이지 생성 (`frontend/src/pages/`)

## 🔧 주요 명령어

```bash
# 백엔드
npm run dev      # 개발 서버 (hot reload)
npm run build    # 프로덕션 빌드
npm start        # 프로덕션 실행

# 프론트엔드
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 미리보기
```

## 🐛 문제 해결

### MongoDB 연결 오류
```bash
# MongoDB 실행 확인
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### 포트 충돌 (이미 사용 중)
`.env` 파일에서 `PORT` 번호를 변경하세요.

### CORS 오류
백엔드 `.env`의 `FRONTEND_URL`이 `http://localhost:5173`인지 확인하세요.

## 📚 더 알아보기

- [API 문서](docs/API_SPEC.md) - API 엔드포인트 상세 정보
- [README.md](README.md) - 전체 프로젝트 정보
- [상세 설치 가이드](docs/상세_설치_가이드.md) - 문제 해결 및 고급 설정

---

**질문이나 문제가 있으시면 GitHub Issues를 열어주세요!**
