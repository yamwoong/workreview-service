# WorkReview - Project Context

> 🎯 새 세션 시작 시 이 파일을 먼저 읽어주세요

## 📋 Project Overview

- **Name**: WorkReview
- **Type**: Multi-country Workplace Review Platform
- **Target Markets**: UK, US, Korea, Europe, Japan, China, Australia, Canada
- **Purpose**: Help part-time workers share and find workplace reviews with salary transparency

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js + TypeScript
- **Database**: MongoDB + Mongoose
- **Validation**: Zod
- **Auth**: JWT (access + refresh tokens)
- **API Style**: RESTful
- **Internationalization**: i18next + i18next-fs-backend + i18next-http-middleware

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS (no CSS modules)
- **State**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Internationalization**: i18next + react-i18next + i18next-browser-languagedetector

### External APIs
- **Google Places API**: For workplace data auto-population

## 📁 Project Structure

```
workreview-service/
├── backend/
│   ├── src/
│   │   ├── models/          # Mongoose models (User, Store, Review, Question, Answer, Comment)
│   │   ├── services/        # Business logic layer
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── routes/          # Express route definitions
│   │   ├── validators/      # Zod validation schemas
│   │   ├── middlewares/     # Express middlewares (auth, validation, error)
│   │   ├── utils/           # Utilities (JWT, errors, country config, etc.)
│   │   ├── config/          # Config (database, logger, CORS)
│   │   └── server.ts        # App entry point
│   └── tests/
│       └── integration/     # Integration tests
├── frontend/
│   ├── src/
│   │   ├── api/            # API client functions
│   │   ├── components/     # Reusable React components
│   │   │   ├── ui/         # Base UI components (Card, Button, etc.)
│   │   │   ├── store/      # Store components
│   │   │   ├── review/     # Review components
│   │   │   └── question/   # Q&A components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── stores/         # Zustand stores
│   │   ├── types/          # TypeScript type definitions
│   │   ├── lib/            # Libraries config (queryClient, etc.)
│   │   └── App.tsx
│   └── public/
└── docs/
    ├── DATABASE_SCHEMA.md      # Database models documentation
    ├── API_SPEC.md             # API endpoints specification
    ├── FEATURE_SPEC.md         # Feature requirements
    └── PROJECT_CONTEXT.md      # This file
```

## 🎨 Coding Conventions

### General
- **Language**: TypeScript (strict mode)
- **Async**: Use async/await (no callbacks)
- **Error Handling**: Use try-catch with custom error classes
- **Naming**: camelCase for variables/functions, PascalCase for classes/components

### Backend
- **Models**: Mongoose schemas with TypeScript interfaces
- **Validation**: Zod schemas in `validators/` folder
- **Services**: Static class methods for business logic
- **Controllers**: Express request handlers with asyncHandler wrapper
- **Routes**: Grouped by resource (auth, stores, reviews)
- **Errors**: Use custom error classes (NotFoundError, BadRequestError, etc.)
- **TypeScript Best Practices**:
  - ❌ **NEVER use `any` type** - Always use proper types or interfaces
  - ✅ Use `FilterQuery<T>` for MongoDB filter objects
  - ✅ Use `Record<string, 1 | -1>` for MongoDB sort options
  - ✅ Use interface definitions for complex objects (e.g., `IBadge[]` instead of `any[]`)
  - ✅ Use `unknown` instead of `any` for truly dynamic data (very rare cases)
  - ✅ Import and use model interfaces (`IUser`, `IStore`, `IReview`, etc.)
  - ✅ Define proper return types for all functions (avoid `Promise<any>`)

### Frontend
- **Components**: Functional components with TypeScript
- **Styling**: TailwindCSS utility classes (no inline styles)
- **State**: Zustand for global state, React Query for server state
- **API Calls**: Separate API client files, React Query hooks
- **Types**: Shared types in `types/` folder

## ✅ Implementation Status

### Completed Features

✅ **User Authentication** (backend + frontend)
- Register, Login, Logout, Profile
- JWT access + refresh tokens
- Password hashing (bcrypt)
- Gamification fields (points, trustScore)

✅ **Store System** (COMPLETE - backend + frontend)
- **Backend**:
  - Multi-country support (8 countries)
  - Structured address (IAddress)
  - Google Places API integration
  - Country/city/category filtering
  - Geospatial search ($near)
  - Currency auto-detection
  - questionCount tracking
  - wageStats tracking
- **Frontend**:
  - Store list page with filters
  - Store detail page
  - Store search page with Google Maps
  - StoreCard and StoreFilters components
  - React Query hooks (useStores, useStore)
  - **Google Map Features**:
    - Search box with autocomplete
    - Map click to select nearby places (50m radius)
    - Nearby search API integration
    - Visual markers (yellow for searching, blue for selected)
    - Toast notifications for place selection
- **API Endpoints**:
  - GET /api/stores (list with filters)
  - GET /api/stores/:id (detail)
  - POST /api/stores (manual create)
  - POST /api/stores/from-place (Google Places create)
  - PATCH /api/stores/:id (update)
  - DELETE /api/stores/:id (delete)

✅ **Review System** (COMPLETE - backend + frontend)
- **Backend**:
  - Review CRUD operations
  - Rating system (1-5 stars)
  - Wage type tracking (below_minimum, minimum_wage, above_minimum)
  - Anonymous reviews
  - Like/Dislike system
  - Comment system (with nested replies)
- **Frontend**:
  - Create review page
  - Review cards with edit/delete
  - Rating display
  - Anonymous toggle
  - EditReviewModal
- **API Endpoints**:
  - POST /api/reviews (create)
  - GET /api/reviews (list)
  - GET /api/reviews/:id (detail)
  - PATCH /api/reviews/:id (update)
  - DELETE /api/reviews/:id (delete)

✅ **Q&A System** (COMPLETE - backend + frontend)
- **Backend**:
  - Question CRUD operations
  - Answer CRUD operations
  - Answer like system
  - Best Answer feature
  - Question cascade delete (answers deleted with question)
  - answerCount tracking
- **Frontend**:
  - Question list with sorting (latest, most answered)
  - Question detail modal
  - Ask question modal
  - Edit question modal
  - Answer list with pagination
  - Answer like button
  - Best Answer badge display
  - Edit/Delete buttons for own questions/answers
- **API Endpoints**:
  - **Questions**:
    - POST /api/stores/:storeId/questions (create)
    - GET /api/stores/:storeId/questions (list)
    - GET /api/questions/:id (detail)
    - PATCH /api/questions/:id (update)
    - DELETE /api/questions/:id (delete)
  - **Answers**:
    - POST /api/questions/:questionId/answers (create)
    - GET /api/questions/:questionId/answers (list)
    - PATCH /api/questions/:questionId/answers/:id (update)
    - DELETE /api/questions/:questionId/answers/:id (delete)
    - POST /api/questions/:questionId/answers/:id/like (toggle like)
    - POST /api/questions/:questionId/answers/:id/best (set best answer)

✅ **Layout System** (COMPLETE - frontend)
- **Components**:
  - Navbar (auth-aware navigation with user dropdown)
  - Footer (branding, links, copyright)
  - MainLayout (consistent page wrapper)
  - PrivateRoute (authentication guard)
- **Features**:
  - Auth state display (login/logout, user info)
  - User dropdown menu (profile, logout)
  - Return URL preservation (redirect after login)
  - Protected routes (/profile, /stores/:id/review/new)
  - Responsive design with TailwindCSS

✅ **Code Quality**
- TypeScript strict mode enabled
- **All `any` types removed from codebase** (completed 2024-12-29)
  - Backend: 7 locations fixed (controllers, services, scripts)
  - Frontend: Clean (no `any` usage)
  - Proper type definitions using interfaces and generics

✅ **Internationalization (i18n)** (COMPLETE - backend + frontend)
- **Supported Languages**: English (en), Korean (ko)
- **Configuration**:
  - Frontend: i18next + react-i18next + i18next-browser-languagedetector
  - Backend: i18next + i18next-fs-backend + i18next-http-middleware
- **Language Detection**:
  - Frontend: localStorage → browser navigator (auto-detect)
  - Backend: Accept-Language header → query string parameter
- **Translation Coverage**:
  - Frontend: 13 pages, 8 components (100% coverage)
  - Backend: 5 controllers with localized responses
  - Total: 400+ translation keys (325 frontend, 75 backend)
- **UI Features**:
  - Select-based language switcher in Navbar
  - Scalable design (easy to add more languages)
  - Locale-aware date formatting
  - Dynamic translation keys for categories
- **Translation Files**:
  - `frontend/src/locales/{en,ko}/translation.json`
  - `backend/src/locales/{en,ko}/translation.json`
- **Implementation**: 170+ `t()` and `req.t()` function calls across codebase

✅ **OAuth / Social Login** (COMPLETE - backend + frontend)
- **Provider**: Google OAuth 2.0
- **Backend**:
  - Passport.js integration (`passport` + `passport-google-oauth20`)
  - Google OAuth Strategy (`backend/src/strategies/google.strategy.ts`)
  - User model updated with `googleId` and `authProvider` fields
  - Password optional for OAuth users (validated conditionally)
  - JWT token generation for OAuth users (`AuthService.generateTokensForUser`)
  - OAuth routes: `GET /api/auth/google`, `GET /api/auth/google/callback`
  - Find-or-create logic: new users auto-created, existing users linked by email
- **Frontend**:
  - Google login button with official Google icon on LoginPage
  - OAuth callback page (`/oauth/callback`) for token handling
  - Token extraction from URL query params and storage in localStorage
  - Success/error handling with i18n toast notifications
  - Seamless redirect to homepage after successful login
- **User Experience**:
  - One-click login: "Continue with Google" → account selection → auto login
  - New users: Account created automatically with Google profile data
  - Existing users: Google account linked to existing account (matched by email)
  - Fully integrated with existing JWT authentication system
- **Documentation**: `docs/GOOGLE_OAUTH_SETUP.md` - Complete setup guide with Google Cloud Console instructions
- **API Endpoints**:
  - GET /api/auth/google (initiates OAuth flow)
  - GET /api/auth/google/callback (handles OAuth callback)

### Partially Implemented
⚠️ **Best Answer UI** (Backend complete, Frontend UI missing)
- Backend API ready
- Need to add "Mark as Best Answer" button in frontend
- Only question author should see this button

### Not Started
❌ **Review Helpful Feature**
- Add helpful vote system to reviews
- Backend: Add helpfulBy field to Review model
- Frontend: Add "Helpful" button
❌ **Question Like Feature**
- Add like system to questions (similar to answers)
❌ **Payslip verification**
❌ **QR code system**
❌ **Gamification features** (points, badges, leaderboard)
❌ **Regional insights** (wage statistics by region)

## 🔑 Key Features

### 1. Multi-Country Support
- 8 supported countries: GB, US, KR, EU, JP, CN, AU, CA
- Currency auto-detection (ISO 4217: GBP, USD, KRW, EUR, JPY, CNY, AUD, CAD)
- Country-specific minimum wage data
- Locale settings per country

### 2. Google Places Integration
- Auto-populate store data from Google Place ID
- Structured address parsing
- Category mapping (Google types → our categories)
- Read-only stores (`isFromGooglePlaces: true` cannot be edited)

### 3. Structured Address
```typescript
interface IAddress {
  country: string;      // ISO 3166-1 alpha-2 (GB, US, KR, etc.)
  countryName: string;  // Full country name
  formatted: string;    // Full formatted address
  street?: string;      // Street address
  city?: string;        // City
  state?: string;       // State/Province
  postalCode?: string;  // Postal code
}
```

### 4. Geospatial Search
- MongoDB 2dsphere index
- Search by lat/lng + radius (meters)
- Distance calculation in query results

## 📚 Important Documentation Files

When implementing a feature, read relevant sections from:

1. **Database Schema**: `docs/DATABASE_SCHEMA.md`
   - User, Store, Review collections
   - Field definitions, validations, indexes
   - Sample data

2. **API Specification**: `docs/API_SPEC.md`
   - All API endpoints with request/response formats
   - Query parameters and validation rules
   - Error codes and handling
   - Frontend integration examples

3. **Feature Spec**: `docs/FEATURE_SPEC.md`
   - Detailed feature requirements
   - UI/UX specifications
   - Business logic details

## 🔄 Git Workflow

- **Main branch**: `main`
- **Feature branches**: `feature/[feature-name]`
- **Current branch**: `feature/store` (Store implementation)
- **Commit style**: Descriptive messages with context

## 🌐 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/workreview
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
GOOGLE_PLACES_API_KEY=your-google-api-key

# OAuth (Future - when implementing Google login)
# GOOGLE_CLIENT_ID=your-google-oauth-client-id
# GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
# GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

## 📝 Reference Patterns

When implementing new features, follow patterns from:

### Backend
- **Model**: `backend/src/models/Store.model.ts`
- **Service**: `backend/src/services/store.service.ts`
- **Controller**: `backend/src/controllers/store.controller.ts`
- **Routes**: `backend/src/routes/store.routes.ts`
- **Validator**: `backend/src/validators/store.validator.ts`

### Frontend
- **Page**: `frontend/src/pages/ProfilePage.tsx` (if exists)
- **Component**: `frontend/src/components/ui/Card.tsx`
- **API Client**: Follow axios patterns
- **Hooks**: React Query custom hooks pattern

## 🚀 Common Commands

```bash
# Backend
cd backend
npm install
npm run dev          # Start dev server
npm run build        # Build TypeScript
npm test             # Run tests

# Frontend
cd frontend
npm install
npm run dev          # Start dev server (Vite)
npm run build        # Build for production
npm run preview      # Preview production build
```

## 💡 Best Practices

1. **Always read this file first** when starting a new session
2. **Read relevant docs sections** (DATABASE_SCHEMA.md, API_SPEC.md)
3. **Check implementation status** above to see what's done
4. **Follow existing patterns** in the codebase
5. **Test incrementally** as you implement
6. **Use TypeScript strictly** - no `any` types
7. **Handle errors properly** - use custom error classes
8. **Update docs** if you change project structure

## 🔮 Future Implementation Notes

### OAuth / Google Login (Passport.js)

**Strategy**: Use Passport.js for OAuth authentication

**Required Packages**:
```bash
npm install passport passport-google-oauth20
npm install --save-dev @types/passport @types/passport-google-oauth20
```

**Implementation Plan**:
1. Create `backend/src/config/passport.ts` - Passport strategies configuration
2. Create `backend/src/strategies/google.strategy.ts` - Google OAuth 2.0 strategy
3. Add routes: `GET /api/auth/google` and `GET /api/auth/google/callback`
4. Update User model to support OAuth fields:
   - `googleId?: string` (Google user ID)
   - `authProvider: 'local' | 'google'` (authentication method)
5. Merge with existing JWT system - issue JWT after successful OAuth

**Key Points**:
- Find or create user by email (OAuth profile email)
- If user exists with same email but different provider, link accounts
- Still use JWT tokens for session management (stateless)
- No `any` types - use proper Passport strategy types

**Example Structure**:
```typescript
// google.strategy.ts
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import type { VerifyCallback } from 'passport-google-oauth20';

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
  },
  async (
    accessToken: string,
    refreshToken: string,
    profile: GoogleStrategy.Profile,
    done: VerifyCallback
  ) => {
    // Find or create user logic
  }
);
```

---

**Last Updated**: 2025-01-05
**Project Version**: 3.3.0
**Current Focus**: OAuth Integration & User Authentication

**Recent Additions** (2025-01-05):
- ✅ **Google OAuth Login** - Complete implementation (completed 2025-01-05)
  - Passport.js + Google OAuth 2.0 integration
  - Seamless user creation and account linking by email
  - Google login button with official branding on LoginPage
  - OAuth callback page with token handling
  - Complete documentation in GOOGLE_OAUTH_SETUP.md
- ✅ **Internationalization (i18n)** - Complete implementation (completed 2025-01-04)
  - English & Korean language support
  - 400+ translation keys across frontend and backend
  - Select-based language switcher with scalable design
  - Locale-aware date formatting and dynamic translations
- ✅ Layout system with Navbar, Footer, and auth integration
- ✅ Google Map click-to-select functionality (50m radius nearby search)
- ✅ Complete removal of TypeScript `any` types across codebase
- ✅ Protected routes with return URL support
