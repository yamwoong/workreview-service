# 📋 WorkReview - Product Requirements Document (PRD)

> **Created**: 2024-12-10
> **Updated**: 2024-12-14
> **Project**: WorkReview - Part-time Work Review Platform
> **Target Market**: United Kingdom 🇬🇧
> **Version**: 2.0.0

---

## 🎯 Project Overview

### Project Purpose
**WorkReview** is a map-based review platform centered around part-time workers' experiences, targeting the UK market.

- **What we're building**: A service where part-time workers register workplaces and share their experiences
- **Why we're building it**: To help job seekers make informed decisions by accessing genuine workplace reviews
- **Primary Users**:
  - Part-time job seekers (prospective workers)
  - Part-time workers (review contributors)
  - Students and young professionals seeking flexible work

### Target Market
- **Primary**: United Kingdom (London, Manchester, Birmingham, etc.)
- **Language**: English
- **Demographics**:
  - Age: 16-35
  - Students, young professionals
  - Service industry workers (cafe, restaurant, retail)

### Core Value Proposition
1. **💰 Salary Transparency** - Real hourly wages with verification system
2. **🗺️ Map-Based Discovery** - Find workplaces visually using Google Maps
3. **⭐ Multi-Dimensional Ratings** - Salary, breaks, work environment, management
4. **✅ Verified Reviews** - Payslip upload for wage verification
5. **📊 Data Insights** - Regional comparisons and salary trends
6. **🎯 Seamless UX** - Integrated search, QR scan, quick review mode

### Differentiation vs Existing Services

| Feature | Indeed/Glassdoor | WorkReview |
|---------|------------------|------------|
| Information Source | Employers (job ads) | Workers (real experiences) |
| Target Audience | Full-time jobs | Part-time/hourly work |
| Salary Data | Estimated ranges | Actual hourly wage + verification |
| Discovery | Search-based | Map-based exploration |
| Review Speed | Lengthy forms | Quick 30-second mode available |
| Location | Google Places integration | Google Places + verification |
| Trust System | Basic stars | Payslip verification + badges |

---

## 👥 User Stories

### User Roles
- **Job Seeker**: Explores nearby workplaces and reviews
- **Worker**: Registers workplaces and writes reviews
- **Member**: All registered users

### Feature-Based User Stories

#### 1. Authentication ✅ (Implemented)
- [x] Users can register with email/password
- [x] Users can login/logout
- [x] Users can reset password via email
- [x] Users can update profile (name, password)
- [ ] Users can login with Google OAuth

#### 2. Workplace Discovery 🗺️
**Map Exploration**
- [ ] Users can explore workplaces on Google Maps
- [ ] Users can see markers with review ratings
- [ ] Users can click markers to see workplace previews
- [ ] Users can filter by category (cafe, restaurant, retail, etc.)
- [ ] Users can view current location on map

**Integrated Search**
- [ ] Users can search using Google Places Autocomplete
- [ ] Users can see both registered and unregistered workplaces
- [ ] Users can see hourly wage ranges in search results
- [ ] Users can toggle between map and list view
- [ ] Users can see "already registered" badges

**Quick Actions**
- [ ] Users can scan QR codes to quickly find workplaces
- [ ] Users can access recently viewed workplaces
- [ ] Users can receive location-based notifications
- [ ] Users can see popular workplaces nearby

#### 3. Workplace Management 🏪
**Registration**
- [ ] Logged-in users can register new workplaces
- [ ] Workplaces are auto-registered when writing first review
- [ ] Google Place ID prevents duplicate registrations
- [ ] Users select from Google Places search results

**Information**
- [ ] Users can view workplace details
- [ ] Users can see average ratings (4 categories)
- [ ] Users can see hourly wage statistics
- [ ] Users can see rating trends (last 3 months)
- [ ] Users can see regional comparisons

#### 4. Review System ⭐
**Quick Review Mode (30 seconds)**
- [ ] Users can write quick reviews in 30 seconds
- [ ] Users can rate with thumbs up/down
- [ ] Users can give overall star rating
- [ ] Users can optionally add hourly wage
- [ ] Users can upgrade to detailed review later

**Detailed Review Mode**
- [ ] Users can rate 4 categories (1-5 stars):
  - Salary/Pay
  - Break time
  - Work environment
  - Management
- [ ] Users can input detailed text review
- [ ] Users can specify work period (start/end dates)
- [ ] Users can add job position
- [ ] Users can add pros/cons separately
- [ ] Users can upload payslip for verification
- [ ] Users can write anonymously (hide name)

**Salary Verification**
- [ ] Users can upload payslip image
- [ ] System auto-blurs personal information
- [ ] Verified reviews get "✅ Verified" badge
- [ ] Verified reviews show in salary statistics

**Review Management**
- [ ] Users can edit their own reviews
- [ ] Users can delete their own reviews
- [ ] Users can see all their reviews in profile
- [ ] Users can see workplace response to review (future)

#### 5. Data Insights 📊
- [ ] Users can see hourly wage vs regional average
- [ ] Users can see workplace ranking in area
- [ ] Users can see rating trends over time
- [ ] Users can see category-specific statistics

#### 6. Rewards & Gamification 🎁
- [ ] Users earn points for writing reviews
- [ ] Users unlock badges (e.g., "5 Reviews", "Verified Reviewer")
- [ ] Users gain trust score based on review quality
- [ ] Users see their contribution impact

#### 7. My Profile 👤
- [x] Users can update profile information
- [ ] Users can view all their reviews
- [ ] Users can see earned badges and points
- [ ] Users can manage notification settings
- [ ] Users can see saved workplaces

---

## 🎨 Screen Structure

### Main Pages
1. **Landing Page** (`/`) ✅
2. **Login Page** (`/login`) ✅
3. **Register Page** (`/register`) ✅
4. **Forgot Password** (`/forgot-password`) ✅
5. **Reset Password** (`/reset-password/:token`) ✅
6. **Profile Page** (`/profile`) ✅
7. **Map Page** (`/map`) 🆕 - Main discovery page
8. **Store Detail Page** (`/stores/:id`) 🆕
9. **Review Write Page** (`/stores/:id/reviews/new`) 🆕
10. **Quick Review Modal** 🆕
11. **My Reviews Page** (`/profile/reviews`) 🆕
12. **QR Scan Page** (`/scan`) 🆕
13. **Error Pages** (404/500) ✅

### Key Screen Elements

#### Map Page (Main)
```
- Google Map (full screen)
  - Workplace markers (color-coded by rating)
  - Current location marker
  - Popup on marker click with quick info

- Unified Search Bar (top)
  - Google Places Autocomplete
  - Shows registered + unregistered workplaces
  - Displays hourly wage in results

- Quick Actions (floating buttons)
  - [📍 Current Location]
  - [⏱️ Recent]
  - [📸 QR Scan]
  - [🎯 Popular]

- Category Filters (bottom)
  - Cafe, Restaurant, Retail, Service, etc.

- Tab Toggle
  - [🗺️ Map] [📋 List]
```

#### Workplace Detail Page
```
- Basic Info
  - Name, Address, Phone, Category
  - Google Maps mini view

- Hourly Wage Statistics
  - Range slider showing this workplace vs area average
  - "💚 8% above average" indicator

- Average Ratings (4 categories)
  - Visual rating bars
  - Overall score

- Rating Trend Chart (6 months)
  - Line graph showing trend

- Reviews List
  - Latest reviews with pagination
  - Filter: All / Verified / Recent
  - Sort: Latest / Highest rated

- [Write Review] button (prominent)
```

#### Review Write Page
```
- Workplace Selection (if not pre-selected)
  - Search: Google Places
  - Map: Click on map

- Review Mode Toggle
  - [⚡ Quick (30s)] [📝 Detailed]

- Quick Mode:
  - 👍/👎 Recommend?
  - ⭐ Overall rating
  - 💰 Hourly wage (optional)
  - 📝 One-line review (optional)

- Detailed Mode:
  - ⭐ 4-category ratings
  - 💰 Hourly wage
  - 📸 Payslip upload (verification)
  - 📅 Work period
  - 💼 Job position
  - 📝 Detailed review text
  - 👍/👎 Pros & cons
  - [ ] Anonymous option
```

#### QR Scan Page
```
- Camera view for QR scanning
- Auto-detects workplace
- Jumps directly to review write page
- Manual entry option
```

---

## 🔧 Feature Requirements

### MVP (Phase 1) - Core Features
**Authentication & Profile** ✅
- [x] Email/password registration & login
- [x] Password reset via email
- [x] Profile management

**Workplace System** (Backend done, Frontend pending)
- [x] Store CRUD API with Google Place ID
- [x] Geospatial search (MongoDB 2dsphere)
- [ ] Google Maps integration
- [ ] Integrated search (Google Places + DB)
- [ ] Map-based discovery
- [ ] Workplace detail page

**Review System** (Not started)
- [ ] Review CRUD API
- [ ] 4-category rating system
- [ ] Quick review mode
- [ ] Detailed review mode
- [ ] Auto workplace creation on first review
- [ ] Average rating calculation

**Basic UI**
- [ ] Responsive design
- [ ] Map/List view toggle
- [ ] Category filters

### Phase 2 - Differentiation Features
**Salary Transparency**
- [ ] Hourly wage input & display
- [ ] Payslip upload & verification
- [ ] Regional wage comparison
- [ ] Verified wage badge

**Enhanced Discovery**
- [ ] QR code scanning
- [ ] Location-based notifications
- [ ] Recent workplaces history
- [ ] Popular workplaces

**Data Insights**
- [ ] Rating trend charts (6 months)
- [ ] Regional ranking
- [ ] Category statistics
- [ ] "Above/below average" indicators

### Phase 3 - Advanced Features
**Rewards System**
- [ ] Points for reviews
- [ ] Badge achievements
- [ ] Trust score
- [ ] Contribution leaderboard

**Social Features**
- [ ] Review helpful votes
- [ ] Share review on social media
- [ ] Comments on reviews (future)

**Enhanced UX**
- [ ] Photo uploads (workplace/payslip)
- [ ] Bookmark workplaces
- [ ] Push notifications
- [ ] PWA (Progressive Web App)

**Admin Features**
- [ ] Report review
- [ ] Review moderation
- [ ] Workplace claim by employers (future)

---

## 🚫 Non-Functional Requirements

### Performance
- **API Response**: < 200ms average
- **Map Loading**: < 2s initial load
- **Search Autocomplete**: < 100ms response
- **Image Optimization**: WebP format, lazy loading
- **Concurrent Users**: Support 500+ simultaneous

### Security
- HTTPS required
- JWT authentication (Access 15min + Refresh 7 days)
- bcrypt password hashing (salt rounds: 12)
- XSS, CSRF protection
- Rate limiting on APIs
- Input validation (Zod)
- Payslip image: auto-blur personal data

### Availability
- 99% uptime target
- Error logging & monitoring
- Weekly backups

### Accessibility
- Mobile-responsive design
- Keyboard navigation
- Semantic HTML
- WCAG 2.1 AA compliance

### Localization
- UK English
- £ currency display
- Date format: DD/MM/YYYY
- Imperial/Metric units

---

## 📊 Data Model Overview

### Primary Entities
1. **User** - Account information
2. **Store** - Workplace information
3. **Review** - Worker reviews
4. **Badge** - Achievement system (future)
5. **Reward** - Points system (future)

### Relationships
```
User 1:N Store (user can register multiple workplaces)
User 1:N Review (user can write multiple reviews)
Store 1:N Review (workplace has multiple reviews)
Review 1:1 User (one author per review)
Review 1:1 Store (review for one workplace)
```

**Note**: Each user can only write ONE review per workplace (unique constraint)

See `DATABASE_SCHEMA.md` for detailed schema

---

## 🗺️ Technology Stack

### Map & Location Services
- **Google Maps JavaScript API**
  - Map display
  - Marker placement
  - InfoWindow popups
  - Free tier: $200/month credit

- **Google Places API**
  - Autocomplete search
  - Place Details
  - Place ID for unique identification
  - Free tier: $200/month credit

- **Google Geocoding API**
  - Address to coordinates conversion
  - Free tier included

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express + TypeScript
- **Database**: MongoDB 7.x (Mongoose ODM)
  - Geospatial indexing (2dsphere)
  - Text search indexing
- **Authentication**: JWT (Access + Refresh tokens)
- **Email**: Nodemailer
- **Validation**: Zod
- **Image Processing**: Sharp (for payslip blur)

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS 4
- **State Management**:
  - Zustand (client state)
  - TanStack React Query (server state)
- **Routing**: React Router v7
- **Forms**: React Hook Form + Zod
- **Maps**: @react-google-maps/api
- **QR**: html5-qrcode or react-qr-reader

### DevOps
- **Version Control**: Git + GitHub
- **Deployment**:
  - Backend: Railway / Render
  - Frontend: Vercel / Netlify
  - Database: MongoDB Atlas
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry (error tracking)

---

## 🎯 Development Priorities

### Sprint 1 (Week 1-2) - Google Maps Integration
**Backend**
- [x] Store model with googlePlaceId
- [x] Store CRUD API
- [ ] Google Places search proxy API
- [ ] Place Details API integration

**Frontend**
- [ ] Google Maps setup & API key
- [ ] Map page with markers
- [ ] Integrated search component
- [ ] Workplace detail page skeleton

### Sprint 2 (Week 3-4) - Review System Core
**Backend**
- [ ] Review model with 4-category ratings
- [ ] Review CRUD API
- [ ] Auto workplace creation logic
- [ ] Average rating calculation
- [ ] Review count updates

**Frontend**
- [ ] Review write page (detailed mode)
- [ ] Quick review modal
- [ ] Rating input components
- [ ] Review cards/list

### Sprint 3 (Week 5-6) - Salary Features
**Backend**
- [ ] Hourly wage fields in Review model
- [ ] Wage statistics API
- [ ] Regional average calculation
- [ ] Payslip upload & storage

**Frontend**
- [ ] Wage input in review form
- [ ] Payslip upload UI
- [ ] Wage comparison charts
- [ ] Regional statistics display

### Sprint 4 (Week 7-8) - Enhanced Discovery
**Frontend**
- [ ] QR code scanning page
- [ ] Quick action buttons
- [ ] Location-based notifications
- [ ] Map/List view toggle
- [ ] Category filters
- [ ] Search history

### Sprint 5 (Week 9-10) - Data Insights
**Backend**
- [ ] Trend calculation API
- [ ] Regional ranking API
- [ ] Statistics aggregation

**Frontend**
- [ ] Rating trend charts
- [ ] Regional comparison UI
- [ ] Insights dashboard
- [ ] "Above average" indicators

### Sprint 6 (Week 11-12) - Polish & Launch
- [ ] Rewards system (points, badges)
- [ ] Performance optimization
- [ ] Mobile responsiveness
- [ ] Testing & bug fixes
- [ ] SEO optimization
- [ ] Analytics integration
- [ ] Production deployment

---

## 📅 Timeline (Estimated)

| Phase | Duration | Key Deliverables | Status |
|-------|----------|------------------|--------|
| **Design & Planning** | 3 days | PRD, DB schema, API spec | ✅ Done |
| **Auth System** | 1 week | Login, register, profile | ✅ Done |
| **Store Backend** | 3 days | Store API, Google Places | ✅ Done |
| **Map Integration** | 1-2 weeks | Google Maps, markers, search | ⬜ Next |
| **Review System** | 1-2 weeks | Review CRUD, ratings | ⬜ Pending |
| **Salary Features** | 1-2 weeks | Wage input, verification | ⬜ Pending |
| **Discovery UX** | 1-2 weeks | QR, notifications, filters | ⬜ Pending |
| **Data Insights** | 1-2 weeks | Trends, comparisons | ⬜ Pending |
| **Polish & Launch** | 1-2 weeks | Testing, deployment | ⬜ Pending |

**Total Estimated**: 10-14 weeks

---

## 🔗 Reference Materials

### Similar Services
- **Glassdoor**: Company reviews (we focus on hourly/part-time)
- **Indeed**: Job listings with reviews
- **Google Maps**: Location discovery (we add work reviews)
- **Yelp**: Business reviews (we're worker-centric)

**Our Differentiation**: Part-time focus + Salary transparency + Map-based discovery

### Design References
- **Airbnb**: Map-based discovery UX
- **Google Maps**: Clean map interface
- **GitHub**: Clean form design
- **Glassdoor**: Review structure

---

## 📝 Constraints & Considerations

### Constraints
- UK market only initially (can expand later)
- Web only (mobile app in future)
- English language only
- Photo uploads limited initially

### Key Considerations
**Data Quality**
- Prevent duplicate workplaces via Google Place ID
- Prevent malicious reviews (report system)
- Encourage payslip verification

**Privacy**
- Anonymous review option
- Auto-blur payslip personal data
- GDPR compliance

**Costs**
- Google Maps API: Monitor usage, stay in free tier
- MongoDB Atlas: Start with free tier
- Image storage: Optimize sizes

**Scalability**
- Design for UK, but structure for global expansion
- Support multiple languages in future
- Consider hourly wage vs monthly salary markets

---

## 🛠️ Development Guide

### Using This PRD

#### With Claude Code
```
Based on docs/PRD.md, update:
1. DATABASE_SCHEMA.md - Add googlePlaceId, wage fields
2. API_SPEC.md - Add Google Places proxy endpoints
3. PAGE_STRUCTURE.md - Add QR scan, quick review pages
```

#### With Cursor
```
@docs/PRD.md
@docs/DATABASE_SCHEMA.md

Implement the Google Places search proxy API
according to Sprint 1 requirements
```

**More guides**: `docs/DEVELOPMENT_GUIDE.md`
**Prompt templates**: `docs/CURSOR_PROMPTS.md`

---

## ✅ Checklist

### Design Phase
- [x] Requirements finalized
- [x] Tech stack confirmed
- [ ] DB schema updated (Google Place ID)
- [ ] API spec updated (Google Places)
- [x] Development environment setup
- [x] Git repository initialized

### Pre-Development
- [ ] Google Cloud Platform account
- [ ] Google Maps API key
- [ ] Google Places API enabled
- [ ] MongoDB Atlas configured
- [ ] Environment variables set

### MVP Launch Criteria
- [ ] User can register and login
- [ ] User can search workplaces (Google Places)
- [ ] User can view workplace on map
- [ ] User can write detailed review
- [ ] User can input hourly wage
- [ ] Average ratings calculated automatically
- [ ] Mobile responsive
- [ ] Deployed to production

---

## 🌟 Success Metrics (Post-Launch)

### User Metrics
- **Active Users**: 500+ MAU (Month 3)
- **Review Count**: 1,000+ reviews (Month 3)
- **Workplace Count**: 300+ workplaces (Month 3)

### Quality Metrics
- **Verified Reviews**: 30%+ with payslip verification
- **Average Review Length**: 100+ characters
- **User Retention**: 40%+ return rate

### Technical Metrics
- **API Response**: 95% under 200ms
- **Error Rate**: < 1%
- **Uptime**: > 99%

---

**Document Management**
- **Created**: 2024-12-10
- **Updated**: 2024-12-14
- **Author**: Development Team
- **Version**: 2.0.0 (Major update - UK market + Google Maps)
