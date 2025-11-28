# 🚀 Cursor + Claude 활용 개발 가이드

> **프로젝트 시작 전 필독!**  
> Cursor와 Claude를 효과적으로 활용하여 TypeScript 풀스택 프로젝트를 구현하기 위한 완벽 가이드

---

## 📚 문서 목록

프로젝트 구현 전에 다음 문서들을 작성/검토하세요:

### 1️⃣ 필수 문서 (구현 전 작성)

| 문서 | 용도 | 우선순위 |
|------|------|----------|
| **PRD.md** | 프로젝트 요구사항 명세서 | ⭐⭐⭐ |
| **ARCHITECTURE.md** | 기술 스택 & 아키텍처 설계 | ⭐⭐⭐ |
| **API_SPEC.md** | API 명세서 | ⭐⭐⭐ |
| **CODING_CONVENTIONS.md** | 코딩 규칙 & 스타일 가이드 | ⭐⭐⭐ |
| **DIRECTORY_STRUCTURE.md** | 디렉토리 구조 | ⭐⭐⭐ |

### 2️⃣ 추가 권장 문서

| 문서 | 용도 | 우선순위 |
|------|------|----------|
| **DATABASE_SCHEMA.md** | 데이터베이스 스키마 설계 | ⭐⭐ |
| **DEPLOYMENT.md** | 배포 가이드 | ⭐⭐ |
| **TESTING.md** | 테스트 전략 | ⭐⭐ |
| **TROUBLESHOOTING.md** | 문제 해결 가이드 | ⭐ |

---

## 🎯 Cursor + Claude 활용 전략

### 1. 프로젝트 컨텍스트 설정

Cursor에서 `.cursorrules` 파일을 만들어 프로젝트 규칙을 정의하세요:

```markdown
# .cursorrules

## 프로젝트 정보
- 이름: [프로젝트명]
- 기술 스택: TypeScript, React, Express, MongoDB
- 버전: Node.js 20.x, React 18.x

## 코딩 규칙
- TypeScript strict mode 사용
- 함수형 컴포넌트 + Hooks 사용
- 네이밍: camelCase (변수/함수), PascalCase (컴포넌트/클래스)
- import 순서: Node 내장 → 외부 라이브러리 → 내부 모듈
- 에러 처리: try-catch + 커스텀 에러 클래스

## 파일 구조
- 컴포넌트: src/components/features/[기능]/
- API: src/api/[리소스].api.ts
- 타입: src/types/[리소스].types.ts

## 금지 사항
- any 타입 사용 금지
- console.log 남기기 금지
- 하드코딩 금지 (환경 변수 사용)
```

### 2. Cursor Composer 활용법

**👉 프로젝트 문서를 Composer에 첨부하세요!**

#### 예시 1: 컴포넌트 생성
```
[PRD.md, CODING_CONVENTIONS.md, DIRECTORY_STRUCTURE.md 첨부]

"로그인 페이지를 만들어줘. 요구사항 문서에 있는 사용자 스토리를 
참고하고, 코딩 컨벤션을 준수해서 작성해줘. 
react-hook-form과 zod를 사용해서 폼 검증도 구현해줘."
```

#### 예시 2: API 엔드포인트 생성
```
[API_SPEC.md, ARCHITECTURE.md, CODING_CONVENTIONS.md 첨부]

"API 명세서에 정의된 대로 태스크 CRUD API를 구현해줘. 
아키텍처 문서의 컨트롤러-서비스 패턴을 따르고, 
zod로 요청 검증도 추가해줘."
```

#### 예시 3: 전체 기능 구현
```
[모든 문서 첨부]

"프로젝트 관리 기능을 처음부터 끝까지 구현해줘:
1. 백엔드: 라우트, 컨트롤러, 서비스, 모델
2. 프론트엔드: API 클라이언트, React Query, 페이지 컴포넌트
3. 타입: 공유 타입 정의

모든 문서의 규칙을 따라서 작성해줘."
```

### 3. Claude Chat 활용법

Cursor Composer가 부족할 때 Claude에게 직접 물어보세요:

#### 설계 검토
```
[ARCHITECTURE.md 첨부]

"이 아키텍처 설계를 검토해줘. 
실시간 기능을 추가하려면 어떤 부분을 수정해야 할까?"
```

#### 버그 분석
```
[에러 로그, 관련 파일 코드 첨부]

"이 에러가 왜 발생하는지 분석하고 해결 방법을 알려줘.
프로젝트의 코딩 컨벤션을 따라서 수정 코드를 작성해줘."
```

#### 코드 리뷰
```
[CODING_CONVENTIONS.md, 작성한 코드 첨부]

"이 코드를 리뷰해줘. 코딩 컨벤션을 잘 지켰는지, 
개선할 부분이 있는지 알려줘."
```

---

## 🛠️ 개발 워크플로우

### Phase 0: 사전 준비 (1-2일)

```
✅ 1. 요구사항 정리
   → PRD.md 작성
   → 주요 기능 목록화
   → 사용자 스토리 작성

✅ 2. 기술 설계
   → ARCHITECTURE.md 작성
   → 기술 스택 확정
   → 디렉토리 구조 설계

✅ 3. API 설계
   → API_SPEC.md 작성
   → 엔드포인트 정의
   → 요청/응답 포맷 정의

✅ 4. 개발 규칙 수립
   → CODING_CONVENTIONS.md 작성
   → .cursorrules 설정
   → Git 커밋 규칙 정의
```

### Phase 1: 프로젝트 초기 설정 (1일)

```bash
# 1. 저장소 생성
mkdir my-project && cd my-project
git init

# 2. 모노레포 구조 생성
mkdir frontend backend shared docs

# 3. Frontend 초기화
cd frontend
npm create vite@latest . -- --template react-ts
npm install

# 필수 라이브러리 설치
npm install react-router-dom @tanstack/react-query zustand axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 4. Backend 초기화
cd ../backend
npm init -y
npm install express mongoose cors helmet dotenv jsonwebtoken bcrypt zod
npm install -D typescript @types/node @types/express ts-node-dev nodemon

# TypeScript 설정
npx tsc --init

# 5. 문서 복사
cp [다운로드한 문서들] ./docs/

# 6. Git 커밋
git add .
git commit -m "chore: initial project setup"
```

### Phase 2: MVP 개발 (3-4주)

#### Week 1: 인증 & 기본 구조
```
Day 1-2: 프로젝트 구조 생성
  → Cursor Composer: "DIRECTORY_STRUCTURE.md를 참고해서 
     frontend와 backend의 전체 디렉토리 구조를 생성해줘"

Day 3-4: 인증 시스템
  → "API_SPEC.md의 인증 API를 구현해줘 (회원가입, 로그인)"
  → "로그인/회원가입 페이지를 구현해줘"

Day 5: 테스트 & 통합
  → "인증 API에 대한 단위 테스트를 작성해줘"
```

#### Week 2: 핵심 기능 (프로젝트 관리)
```
Day 1-2: 백엔드 API
  → "프로젝트 CRUD API를 구현해줘"

Day 3-4: 프론트엔드 UI
  → "프로젝트 목록/생성/상세 페이지를 구현해줘"

Day 5: 통합 & 테스트
```

#### Week 3: 태스크 관리
```
Day 1-2: 백엔드 API
Day 3-4: 프론트엔드 UI (칸반 보드)
Day 5: 통합 & 테스트
```

#### Week 4: 마무리 & 배포
```
Day 1-2: 버그 수정 & 리팩토링
Day 3: Docker 설정
Day 4: CI/CD 파이프라인
Day 5: 프로덕션 배포
```

---

## 💡 효과적인 프롬프트 작성법

### ✅ GOOD 프롬프트

```
[여러 문서 첨부]

"다음 요구사항에 맞춰 LoginForm 컴포넌트를 작성해줘:

1. 기능 요구사항 (PRD.md 참고):
   - 이메일/비밀번호 입력
   - 유효성 검증
   - 로그인 API 호출
   - 에러 처리

2. 기술 요구사항 (ARCHITECTURE.md 참고):
   - react-hook-form 사용
   - zod 스키마 검증
   - React Query로 API 호출

3. 코딩 규칙 (CODING_CONVENTIONS.md 참고):
   - TypeScript strict mode
   - 명시적 타입 정의
   - 에러 바운더리 처리

4. 파일 위치 (DIRECTORY_STRUCTURE.md 참고):
   - src/components/features/auth/LoginForm.tsx
   - src/validators/auth.validator.ts (zod 스키마)
   - src/api/auth.api.ts (API 호출 함수)

전체 코드를 작성하고, 각 파일의 전체 경로도 함께 알려줘."
```

### ❌ BAD 프롬프트

```
"로그인 화면 만들어줘"
```

### 프롬프트 작성 팁

1. **명확한 요구사항**: 무엇을, 어떻게, 왜 만들어야 하는지
2. **문서 첨부**: 관련 문서를 항상 첨부
3. **구체적인 기술 스택**: 사용할 라이브러리 명시
4. **파일 경로 지정**: 어디에 생성할지 명시
5. **예외 처리 요청**: 에러 케이스도 함께 고려

---

## 🔍 자주 묻는 질문 (FAQ)

### Q1: 문서를 모두 작성하는 게 오래 걸리지 않나요?
**A:** 초기 1-2일 투자하면 이후 개발이 훨씬 빨라집니다. Cursor와 Claude가 문서를 기반으로 일관성 있는 코드를 생성하기 때문입니다.

### Q2: 문서가 너무 상세한데, 다 필요한가요?
**A:** 프로젝트 규모에 따라 조절하세요:
- **소규모 (MVP)**: PRD + API_SPEC + CODING_CONVENTIONS
- **중규모**: 위 3개 + ARCHITECTURE + DIRECTORY_STRUCTURE
- **대규모**: 모든 문서 + 추가 문서

### Q3: 문서를 어떻게 업데이트하나요?
**A:** 기능 추가/변경 시 관련 문서를 함께 업데이트하세요. Git 커밋에 문서 변경도 포함하세요.

### Q4: Cursor와 Claude 중 어떤 걸 먼저 써야 하나요?
**A:** 
- **Cursor Composer**: 코드 생성, 파일 생성/수정
- **Claude Chat**: 설계 검토, 아키텍처 논의, 복잡한 문제 해결

### Q5: 생성된 코드를 어떻게 검증하나요?
**A:**
1. TypeScript 컴파일 에러 확인
2. ESLint/Prettier 실행
3. 테스트 실행
4. 코드 리뷰 (본인 또는 팀)

---

## 📊 체크리스트

### 🎯 프로젝트 시작 전
- [ ] PRD 작성 완료
- [ ] 기술 스택 확정
- [ ] API 명세서 작성
- [ ] 코딩 컨벤션 정의
- [ ] 디렉토리 구조 설계
- [ ] .cursorrules 설정
- [ ] Git 저장소 생성

### 🏗️ 개발 중
- [ ] 모든 파일이 디렉토리 구조를 따름
- [ ] 코딩 컨벤션 준수
- [ ] API 명세와 실제 구현 일치
- [ ] TypeScript 타입 정의
- [ ] 에러 처리 구현
- [ ] 주요 기능 테스트 작성

### 🚀 배포 전
- [ ] 모든 테스트 통과
- [ ] 환경 변수 설정
- [ ] Docker 이미지 빌드 성공
- [ ] CI/CD 파이프라인 구축
- [ ] 프로덕션 배포 문서 작성
- [ ] 모니터링 도구 연동

---

## 🎓 학습 자료

### TypeScript + React
- [TypeScript 공식 문서](https://www.typescriptlang.org/docs/)
- [React 공식 문서](https://react.dev/)
- [TanStack Query 문서](https://tanstack.com/query/latest)

### Express + MongoDB
- [Express 공식 문서](https://expressjs.com/)
- [Mongoose 문서](https://mongoosejs.com/)
- [Zod 문서](https://zod.dev/)

### DevOps
- [Docker 문서](https://docs.docker.com/)
- [GitHub Actions 문서](https://docs.github.com/en/actions)

---

## 🆘 문제 해결

### 문제 발생 시 순서

1. **에러 메시지 확인**
   ```
   [에러 로그, 관련 코드 첨부하여 Claude에게 질문]
   "이 에러가 왜 발생하는지 분석해줘"
   ```

2. **문서 확인**
   - API 명세서와 실제 구현이 일치하는지
   - 타입 정의가 올바른지

3. **Claude에게 코드 리뷰 요청**
   ```
   [CODING_CONVENTIONS.md, 문제 코드 첨부]
   "이 코드를 리뷰하고 문제점을 찾아줘"
   ```

4. **구글링 + 공식 문서**

---

## 🎉 시작하기

```bash
# 1. 이 가이드의 모든 문서를 프로젝트 docs/ 폴더에 복사

# 2. .cursorrules 파일 생성

# 3. Cursor에서 프로젝트 열기

# 4. Composer에 문서들을 첨부하고 시작!
"PRD.md와 ARCHITECTURE.md를 참고해서 
프로젝트 초기 구조를 생성해줘"
```

---

**작성일**: 2025-11-22  
**버전**: 1.0.0  
**행운을 빕니다! 🚀**

---

## 📎 관련 문서

- [PRD.md](./PRD.md) - 프로젝트 요구사항 명세서
- [ARCHITECTURE.md](./ARCHITECTURE.md) - 기술 스택 & 아키텍처
- [API_SPEC.md](./API_SPEC.md) - API 명세서
- [CODING_CONVENTIONS.md](./CODING_CONVENTIONS.md) - 코딩 규칙
- [DIRECTORY_STRUCTURE.md](./DIRECTORY_STRUCTURE.md) - 디렉토리 구조
