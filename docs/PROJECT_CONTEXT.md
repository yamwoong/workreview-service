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

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS (no CSS modules)
- **State**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Routing**: React Router v6

### External APIs
- **Google Places API**: For workplace data auto-population

## 📁 Project Structure

```
workreview-service/
├── backend/
│   ├── src/
│   │   ├── models/          # Mongoose models (User, Store, Review)
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
│   │   │   └── ui/         # Base UI components (Card, Button, etc.)
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

✅ **Store Backend** (COMPLETE)
- Files:
  - `backend/src/models/Store.model.ts`
  - `backend/src/services/store.service.ts`
  - `backend/src/controllers/store.controller.ts`
  - `backend/src/routes/store.routes.ts`
  - `backend/src/validators/store.validator.ts`
  - `backend/src/utils/countryConfig.util.ts`
  - `backend/src/utils/googlePlaces.util.ts`
- Features:
  - Multi-country support (8 countries)
  - Structured address (IAddress)
  - Google Places API integration
  - Country/city/category filtering
  - Geospatial search ($near)
  - Currency auto-detection
- API Endpoints:
  - GET /api/stores (list with filters)
  - GET /api/stores/:id (detail)
  - POST /api/stores (manual create)
  - POST /api/stores/from-place (Google Places create)
  - PATCH /api/stores/:id (update)
  - DELETE /api/stores/:id (delete)

### In Progress
⏳ **Store Frontend** ← Next task
⏳ **Review System** (backend + frontend)

### Not Started
❌ **OAuth / Social Login** (Passport.js)
- Google OAuth 2.0 (passport-google-oauth20)
- Strategy: Find or create user by email
- Merge with existing JWT system
❌ Payslip verification
❌ QR code system
❌ Gamification features
❌ Regional insights

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

**Last Updated**: 2024-12-16
**Project Version**: 2.0.0
**Current Focus**: Store Frontend Implementation
