# WorkReview Page Structure

> Workplace Review Platform - Core Features First, Supporting Pages Before Deployment

## 📋 Table of Contents
1. [Current Status](#current-status)
2. [Immediate Implementation Required](#immediate-implementation-required)
3. [Core Business Features](#core-business-features)
4. [Pre-Deployment Implementation](#pre-deployment-implementation)
5. [Implementation Priority](#implementation-priority)
6. [Page Details](#page-details)

---

## Current Status

### ✅ Completed Pages (Authentication - 5 pages)
- [x] `/login` - Login page
- [x] `/register` - Registration page
- [x] `/forgot-password` - Password recovery page
- [x] `/reset-password/:token` - Password reset page
- [x] `/profile` - Profile/settings page

### ✅ Error Pages (3 pages)
- [x] `*` - 404 Not Found page
- [x] `/500` - Server error page
- [x] `/403` - Access forbidden page

---

## Immediate Implementation Required

> **Core pages needed immediately**

### 🔴 Phase 1: Basic Pages (Highest Priority)

#### 1. Home/Landing Page (`/`)
- **Purpose**: Service entry point
- **Priority**: ⭐⭐⭐⭐⭐
- **Status**: ✅ Implemented (needs UI enhancement)

**Before Login**:
- Service introduction (workplace review platform)
- Key features showcase
  - Map-based workplace discovery
  - Real salary transparency
  - Payslip verification system
  - Quick 30-second reviews
- Login/Register buttons

**After Login**:
- Redirect to map page

---

## Core Business Features

> **Pages that deliver WorkReview's core value**

### 🔴 Phase 2: Map & Workplace Discovery (Top Priority)

#### 2. Map Page (`/map`)
- **Purpose**: Map-based workplace discovery
- **Priority**: ⭐⭐⭐⭐⭐
- **Estimated Time**: 6-8 hours

**Features**:
- Google Maps integration
- Current location-based workplace markers
- Click marker to show info window (name, rating, average wage)
- Info window "View Details" → workplace detail page
- Integrated search bar
  - Searches both Google Places AND our database
  - Shows combined results with indicators:
    - ✅ "Has Reviews" for workplaces in our DB
    - 📍 "Add Review" for Google Places without reviews
- Radius filtering (1km, 3km, 5km, 10km)
- Category filtering (cafe, restaurant, convenience, retail, service, education, entertainment)
- Split screen: Map (70%) + List (30%)
- Responsive: Tab switching on mobile

**Required APIs**:
- `GET /api/places/search?q=query` - Google Places autocomplete
- `GET /api/stores?lat={lat}&lng={lng}&radius={radius}` - Nearby workplaces
- `GET /api/places/check/:placeId` - Check if workplace exists in our DB

**Required Libraries**:
- `@react-google-maps/api`

---

#### 3. Workplace Detail Page (`/stores/:id`)
- **Purpose**: View workplace information and reviews
- **Priority**: ⭐⭐⭐⭐⭐
- **Estimated Time**: 4-5 hours

**Features**:
- Workplace basic info (name, address, category)
- QR code for sharing
- Average ratings (salary, rest time, work environment, management, overall)
- **Salary insights** 🆕
  - Average hourly wage: £11.85
  - Wage range: £10.50 - £13.25
  - Verified reviews: 8/12 (66%)
  - Breakdown by position (Barista: £12.10, Team Member: £11.20)
- Review count
- Review list (pagination)
- Review filters:
  - All / Quick / Detailed
  - All / Verified only
  - Sort by: Latest, Rating, Helpful
- Write review button (requires login)
- Location map
- Share options (QR code, link)

**Required APIs**:
- `GET /api/stores/:id` - Workplace details
- `GET /api/stores/:storeId/reviews?verified=true&sort=latest` - Workplace reviews
- `GET /api/insights/salary/:storeId` - Salary insights

---

#### 4. QR Scan Page (`/scan/:googlePlaceId` or `/scan?qr=encoded`)
- **Purpose**: Quick access via QR code scanning
- **Priority**: ⭐⭐⭐⭐ 🆕
- **Estimated Time**: 2-3 hours

**User Flow**:
1. User scans QR code at workplace
2. If workplace exists in DB → Redirect to workplace detail page
3. If workplace doesn't exist → Redirect to quick review page with pre-filled Google Place ID

**Features**:
- QR code scanner (mobile camera)
- Loading state with workplace lookup
- Auto-redirect based on existence

**Required Libraries**:
- `react-qr-scanner` or `html5-qrcode`

**Required APIs**:
- `GET /api/places/check/:placeId` - Check workplace existence

---

### 🟠 Phase 3: Review Writing and Management

#### 5. Quick Review Page (`/reviews/quick?placeId={googlePlaceId}`)
- **Purpose**: Write 30-second quick review
- **Priority**: ⭐⭐⭐⭐⭐ 🆕
- **Estimated Time**: 3-4 hours

**Features**:
- Simplified form (30 seconds to complete)
- Auto-load workplace info from Google Places
- 4 rating sliders (1-5):
  - Salary
  - Rest Time
  - Work Environment
  - Management
- Short content textarea (10-500 characters)
- Optional hourly wage input (£)
- Position input
- Anonymous option checkbox
- Submit → Earn 20 points

**Required APIs**:
- `GET /api/places/details/:placeId` - Get workplace info from Google
- `POST /api/reviews/quick` - Submit quick review

**Rewards**:
- 20 points for quick review
- +30 points if upgrade to detailed later
- +30 points if upload payslip

---

#### 6. Detailed Review Page (`/stores/:storeId/reviews/new`)
- **Purpose**: Write comprehensive work experience review
- **Priority**: ⭐⭐⭐⭐⭐
- **Estimated Time**: 3-4 hours

**Features**:
- Workplace info display
- 4 rating inputs (star rating 1-5):
  - Salary
  - Rest Time
  - Work Environment
  - Management
- Review content textarea (10-2000 characters)
- Work period input (start date, end date)
- Position input
- Pros textarea (optional, max 500 chars)
- Cons textarea (optional, max 500 chars)
- Optional hourly wage input (£)
- Anonymous option checkbox
- Submit → Redirect to workplace detail page
- Submit → Earn 50 points

**Required APIs**:
- `POST /api/reviews` - Submit detailed review
- `GET /api/places/details/:placeId` - Get workplace info (if not in DB)

**Validation**:
- 1 review per user per workplace
- All ratings required
- Minimum 10 characters for content

---

#### 7. Payslip Upload Modal (`/reviews/:id/payslip`)
- **Purpose**: Verify hourly wage with payslip
- **Priority**: ⭐⭐⭐⭐ 🆕
- **Estimated Time**: 3-4 hours

**Features**:
- Modal overlay or dedicated page
- Image upload (JPG, PNG, max 5MB)
- Privacy notice: "We will auto-blur sensitive information"
- Preview uploaded image
- Submit → Earn 30 bonus points
- Submit → Increase trust score
- Submit → Show "✅ Verified" badge on review

**Required APIs**:
- `POST /api/reviews/:id/payslip` - Upload payslip (multipart/form-data)

**Processing**:
1. User uploads image
2. Backend processes with Sharp library (auto-blur)
3. Store blurred image URL
4. Set `isPayslipVerified: true`
5. Update workplace wage statistics
6. Award 30 points + increase trust score

---

#### 8. Review Edit Page (`/reviews/:id/edit`)
- **Purpose**: Edit existing review
- **Priority**: ⭐⭐⭐⭐
- **Estimated Time**: 2-3 hours

**Features**:
- Same form as review write page
- Load existing data
- On save → Redirect to workplace detail or my reviews page
- Note: If hourly wage is changed and payslip was verified, reset verification

**Required APIs**:
- `GET /api/reviews/:id` - Get review details
- `PATCH /api/reviews/:id` - Update review

---

#### 9. Upgrade Quick Review Modal
- **Purpose**: Convert quick review to detailed review
- **Priority**: ⭐⭐⭐ 🆕
- **Estimated Time**: 2 hours

**Features**:
- Modal or inline expansion
- Add work period (start/end dates)
- Add pros/cons
- Expand content (extend to 2000 chars)
- Submit → Earn 30 bonus points (total 50)

**Required APIs**:
- `PATCH /api/reviews/:id/upgrade` - Upgrade to detailed

---

#### 10. My Reviews Page (`/my-reviews`)
- **Purpose**: Manage my reviews
- **Priority**: ⭐⭐⭐⭐
- **Estimated Time**: 2-3 hours

**Features**:
- List of my reviews
- Show workplace name, date, rating
- Badges: "Quick" or "Detailed", "✅ Verified"
- Edit/Delete buttons
- Pagination
- Empty state: "No reviews yet" + "Explore workplaces" button
- Points earned display per review

**Required APIs**:
- `GET /api/reviews/my` - My review list
- `DELETE /api/reviews/:id` - Delete review

---

### 🟡 Phase 4: Additional Features

#### 11. Review Detail Page (`/reviews/:id`)
- **Purpose**: View individual review in detail
- **Priority**: ⭐⭐⭐
- **Estimated Time**: 2 hours

**Features**:
- Full review content
- Author info (anonymous or name + trust score)
- Created date
- Detailed ratings (4 categories)
- Work period
- Hourly wage (if provided)
- "✅ Verified" badge (if payslip uploaded)
- Helpful button (if not author)
- Helpful count display
- Link to workplace

**Required APIs**:
- `GET /api/reviews/:id` - Review details
- `POST /api/reviews/:id/helpful` - Mark as helpful

---

#### 12. Workplace Registration Page (`/stores/new`)
- **Purpose**: Register new workplace
- **Priority**: ⭐⭐⭐
- **Estimated Time**: 3-4 hours

**Features**:
- Search with Google Places autocomplete
- Select workplace from suggestions
- Auto-fill: name, address, location, phone
- Category selection dropdown
- Location preview on map
- On submit → Create workplace in DB
- On submit → Redirect to workplace detail page

**Required APIs**:
- `GET /api/places/search?q=query` - Search Google Places
- `GET /api/places/details/:placeId` - Get place details
- `POST /api/stores` - Create workplace

**Validation**:
- Check duplicate by Google Place ID
- Auto-calculate lat/lng from Google Places

---

#### 13. Insights Dashboard (`/insights`)
- **Purpose**: Salary data and trends
- **Priority**: ⭐⭐⭐ 🆕
- **Estimated Time**: 4-5 hours

**Features**:
- Overall statistics
  - Total workplaces reviewed
  - Total verified wages
  - Average hourly wage
- Category benchmarks
  - Cafes: avg £11.45
  - Restaurants: avg £10.85
  - Retail: avg £10.95
- UK National Minimum Wage reference
  - Age 21+: £11.44
  - Age 18-20: £8.60
  - Age 16-17: £6.40
- Top paying workplaces
- Most reviewed workplaces
- Regional wage map (heatmap)

**Required APIs**:
- `GET /api/insights/benchmarks` - Category benchmarks
- `GET /api/insights/salary/regional?lat=&lng=&radius=` - Regional data

---

#### 14. Regional Wage Comparison (`/insights/regional`)
- **Purpose**: Compare wages in specific area
- **Priority**: ⭐⭐⭐ 🆕
- **Estimated Time**: 3-4 hours

**Features**:
- Location search (city/postcode)
- Radius selector (5km, 10km, 25km, 50km)
- Category filter
- Results:
  - Average wage in area
  - Workplaces sorted by wage (highest to lowest)
  - Distance from center
  - Verified review count
- Interactive map with markers colored by wage level
  - Green: Above average
  - Yellow: Average
  - Red: Below average

**Required APIs**:
- `GET /api/insights/salary/regional?lat=&lng=&radius=&category=`

---

#### 15. Leaderboard Page (`/leaderboard`)
- **Purpose**: Gamification - show top contributors
- **Priority**: ⭐⭐ 🆕
- **Estimated Time**: 2-3 hours

**Features**:
- Tabs:
  - Top Points (total points earned)
  - Top Trust Score (most verified reviews)
  - Most Reviews (review count)
- Top 100 users
- Show:
  - Rank
  - User name
  - Avatar
  - Points / Trust Score / Review count
  - Badges earned
- Current user's rank highlighted

**Required APIs**:
- `GET /api/users/leaderboard?type=points&limit=100`

---

#### 16. User Profile Page (Public) (`/users/:id`)
- **Purpose**: View other users' profiles
- **Priority**: ⭐⭐
- **Estimated Time**: 2 hours

**Features**:
- User info (name, avatar, joined date)
- Points and trust score
- Badges earned
- Review count
- Verified review count
- Public reviews (if not anonymous)

**Required APIs**:
- `GET /api/users/:id` - User profile

---

## Pre-Deployment Implementation

> **Pages needed before actual deployment**

### 🟡 Phase 5: Legal Documents (Before Deployment)

#### 17. Terms of Service (`/terms`)
- **Purpose**: Legal protection
- **Priority**: ⭐⭐⭐⭐ (mandatory before deployment)
- **Estimated Time**: 30 minutes (use template)

---

#### 18. Privacy Policy (`/privacy`)
- **Purpose**: GDPR compliance
- **Priority**: ⭐⭐⭐⭐ (mandatory before deployment)
- **Estimated Time**: 30 minutes (use template)

---

### 🟢 Phase 6: Post-Launch Features

#### 19. Search Page (`/search`)
- **Estimated Time**: 3-4 hours
- **Features**:
  - Integrated search (Google Places + our DB)
  - Search by workplace name
  - Search by address
  - Category filter
  - Wage range filter
  - Rating filter
  - Sort options

---

#### 20. Notifications Page (`/notifications`)
- **Estimated Time**: 3-4 hours
- **Deferred Reason**: Notification system is post-launch

---

#### 21. Contact/Support Page (`/contact`)
- **Estimated Time**: 1 hour
- **Deferred Reason**: Can handle via email initially

---

#### 22. About Page (`/about`)
- **Estimated Time**: 30 minutes
- **Deferred Reason**: Can include on homepage

---

#### 23. Comments Feature
- **Location**: Inside review detail page
- **Estimated Time**: 4-5 hours
- **Deferred Reason**: Reviews alone are sufficient initially

---

## Implementation Priority

### 🎯 Phase 1: Basic Pages (Completed ✅)
```
1. Home/Landing page ✅
2. Login/Register ✅
3. Profile page ✅
4. Password recovery/reset ✅
5. Error pages (404, 500, 403) ✅
```

---

### 🎯 Phase 2: Map & Workplace Discovery (Next)
```
6. Map page with integrated search (6-8 hours)
7. Workplace detail page with salary insights (4-5 hours)
8. QR scan page (2-3 hours)
────────────────────────
Total estimated time: 12-16 hours
```

**Implementation Order**:
1. Backend API first (Store, Places proxy, Insights)
2. Map page UI
3. Google Maps API integration
4. Workplace detail page
5. QR scanner

---

### 🎯 Phase 3: Review Writing and Management
```
9. Quick review page (3-4 hours) 🆕
10. Detailed review page (3-4 hours)
11. Payslip upload (3-4 hours) 🆕
12. Review edit page (2-3 hours)
13. Upgrade quick review (2 hours) 🆕
14. My reviews page (2-3 hours)
────────────────────────
Total estimated time: 15-20 hours
```

---

### 🎯 Phase 4: Additional Features
```
15. Review detail page (2 hours)
16. Workplace registration page (3-4 hours)
17. Insights dashboard (4-5 hours) 🆕
18. Regional wage comparison (3-4 hours) 🆕
19. Leaderboard (2-3 hours) 🆕
20. User profile (public) (2 hours) 🆕
────────────────────────
Total estimated time: 16-20 hours
```

---

### 📦 Phase 5: Pre-Deployment
```
21. Terms of Service (30 minutes)
22. Privacy Policy (30 minutes)
────────────────────────
Total estimated time: 1 hour
```

---

### 🚀 Phase 6: Post-Launch
```
- Search page
- Notifications page
- Contact page
- About page
- Comments feature
```

---

## Page Details

### 1. Home/Landing Page

**File Path**: `frontend/src/pages/HomePage.tsx`

**Layout (Before Login)**:
```
┌─────────────────────────────────────────┐
│  [Logo] WorkReview      [Login] [Sign Up]│
├─────────────────────────────────────────┤
│                                         │
│    Know Your Worth. Share Real Wages.   │
│     Transparent Workplace Reviews       │
│                                         │
│        [Explore Map →] [Quick Review]   │
│                                         │
├─────────────────────────────────────────┤
│  Key Features                            │
│  ───────────                             │
│  💰 Real Salary Data - £10-15/hr verified│
│  🗺️  Map-Based Discovery - Google Maps  │
│  ⚡ Quick 30-Second Reviews              │
│  ✅ Payslip Verification System          │
│  📊 Regional Wage Insights               │
└─────────────────────────────────────────┘
```

**Required Features**:
- Login state check (`useAuth` hook)
- Redirect to `/map` if logged in
- Apply UI_DESIGN_GUIDE styling

---

### 2. Map Page

**File Path**: `frontend/src/pages/MapPage.tsx`

**Layout**:
```
┌─────────────────────────────────────────┐
│  [Logo] WorkReview          [Profile]   │
│  [🔍 Search workplaces...]    [QR Scan] │
├──────────────────┬──────────────────────┤
│                  │  Workplace List       │
│                  │  ──────────           │
│                  │  [Radius: 5km ▼]     │
│      Google      │  [Category: All ▼]   │
│       Map        │                      │
│                  │  📍 Starbucks        │
│                  │     ⭐ 4.2 · £11.85/hr│
│                  │     ✅ 8 verified     │
│                  │                      │
│                  │  📍 Costa Coffee     │
│                  │     ⭐ 3.8 · £10.50/hr│
│                  │     ✅ 5 verified     │
│                  │                      │
│                  │  [Load more...]      │
└──────────────────┴──────────────────────┘
```

**Integrated Search Features**:
- Search bar at top
- As user types, show combined results:
  - Workplaces from our database (with reviews, wage data)
  - Google Places results (with "Add Review" option)
- Indicators:
  - ✅ "Has Reviews" - in our database
  - 📍 "Add Review" - from Google Places
- Clicking result:
  - Our DB → Go to workplace detail
  - Google Places → Quick review page with pre-filled placeId

**Required Libraries**:
- `@react-google-maps/api`

---

### 3. Workplace Detail Page

**File Path**: `frontend/src/pages/StoreDetailPage.tsx`

**Layout**:
```
┌─────────────────────────────────────────┐
│  [← Back]  [QR Code]         [Write Review]│
├─────────────────────────────────────────┤
│  Starbucks                               │
│  📍 91-92 High St, Oxford OX1 4BJ, UK   │
│  🏷️  Cafe                                │
│                                         │
│  ─────────────────────────────────────  │
│  💰 Salary Insights                     │
│  Average Hourly Wage: £11.85            │
│  Range: £10.50 - £13.25                 │
│  Verified: 8/12 (66%)                   │
│                                         │
│  By Position:                            │
│  • Barista: £12.10 (5 reviews)          │
│  • Team Member: £11.20 (3 reviews)      │
│  ─────────────────────────────────────  │
│                                         │
│  Overall Rating: ⭐ 4.2 (12 reviews)    │
│                                         │
│  Salary       ⭐⭐⭐⭐⭐ 4.5              │
│  Rest Time    ⭐⭐⭐⭐☆ 4.0              │
│  Work Env     ⭐⭐⭐⭐☆ 4.3              │
│  Management   ⭐⭐⭐⭐☆ 4.0              │
│  ─────────────────────────────────────  │
│                                         │
│  Reviews (12)  [All ▼] [Latest ▼]       │
│  ──────                                 │
│  [Review Card 1 - ✅ Verified]          │
│  [Review Card 2 - Quick Review]         │
│  [Review Card 3 - ✅ Verified]          │
│  [Load more...]                          │
│                                         │
│  [View on Map]                           │
└─────────────────────────────────────────┘
```

**QR Code Feature**:
- Click "QR Code" button → Modal with QR code
- QR encodes: `https://workreview.com/scan?placeId={googlePlaceId}`
- Users can scan to quickly access this workplace
- Download QR code option

---

### 4. QR Scan Page

**File Path**: `frontend/src/pages/QRScanPage.tsx`

**Layout**:
```
┌─────────────────────────────────────────┐
│  [← Back]                                │
├─────────────────────────────────────────┤
│                                         │
│         Scan Workplace QR Code          │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │      [Camera View]              │   │
│  │                                 │   │
│  │      Align QR code in frame     │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Or enter Place ID manually:             │
│  [________________] [Go]                 │
│                                         │
└─────────────────────────────────────────┘
```

**Flow**:
1. User scans QR code
2. Extract `placeId` from encoded URL
3. Call `GET /api/places/check/:placeId`
4. If exists → Redirect to `/stores/:id`
5. If not exists → Redirect to `/reviews/quick?placeId={placeId}`

**Required Libraries**:
- `html5-qrcode` or `react-qr-scanner`

---

### 5. Quick Review Page

**File Path**: `frontend/src/pages/QuickReviewPage.tsx`

**Layout**:
```
┌─────────────────────────────────────────┐
│  Quick Review (30 seconds)    [× Cancel]│
├─────────────────────────────────────────┤
│  📍 Starbucks                            │
│  91-92 High St, Oxford OX1 4BJ, UK      │
│  ─────────────────────────────────────  │
│                                         │
│  Rate your experience (1-5)              │
│                                         │
│  Salary       [═══●═] 4                 │
│  Rest Time    [══●══] 3                 │
│  Work Env     [═══●═] 4                 │
│  Management   [═══●═] 4                 │
│                                         │
│  Hourly Wage (optional)                  │
│  £ [11.25]                               │
│                                         │
│  Your experience in brief                │
│  ┌─────────────────────────────────┐   │
│  │ Standard cafe work. Decent pay. │   │
│  │ (10-500 characters)             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Position: [Team Member      ]           │
│                                         │
│  ☐ Post anonymously                      │
│                                         │
│  [Submit Review - Earn 20 Points]        │
│                                         │
│  💡 Want to add more details later?     │
│  You can upgrade to earn 30 more points! │
└─────────────────────────────────────────┘
```

**Features**:
- Simple sliders for ratings
- Short content (10-500 chars)
- Optional wage input
- Anonymous option
- Auto-create workplace if doesn't exist
- Earn 20 points on submit

---

### 6. Detailed Review Page

**File Path**: `frontend/src/pages/ReviewWritePage.tsx`

**Layout**:
```
┌─────────────────────────────────────────┐
│  Write Review                 [× Cancel]│
├─────────────────────────────────────────┤
│  📍 Starbucks                            │
│  91-92 High St, Oxford OX1 4BJ, UK      │
│  ─────────────────────────────────────  │
│                                         │
│  Rate your experience                    │
│                                         │
│  Salary       ⭐⭐⭐⭐⭐                  │
│  Rest Time    ⭐⭐⭐⭐☆                  │
│  Work Env     ⭐⭐⭐⭐⭐                  │
│  Management   ⭐⭐⭐⭐☆                  │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  Hourly Wage (optional)                  │
│  £ [12.50]                               │
│                                         │
│  Your Review                             │
│  ┌─────────────────────────────────┐   │
│  │ Great place to work! Pay is     │   │
│  │ always on time and management   │   │
│  │ is very supportive...           │   │
│  │ (10-2000 characters)            │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Work Period                             │
│  From: [2024-06-01]  To: [2024-11-30]   │
│                                         │
│  Position: [Barista          ]           │
│                                         │
│  Pros (optional)                         │
│  ┌─────────────────────────────────┐   │
│  │ Accurate pay, friendly team     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Cons (optional)                         │
│  ┌─────────────────────────────────┐   │
│  │ Very busy during peak hours     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ☐ Post anonymously                      │
│                                         │
│  [Submit Review - Earn 50 Points]        │
│                                         │
│  💡 Verify with payslip for 30 bonus pts!│
└─────────────────────────────────────────┘
```

**Features**:
- React Hook Form + Zod validation
- Star rating inputs (1-5)
- Textarea (10-2000 chars)
- Date pickers (start required, end optional)
- Position input
- Pros/Cons optional
- Hourly wage optional
- Anonymous option
- Earn 50 points on submit

---

### 7. Payslip Upload Modal

**File Path**: `frontend/src/components/reviews/PayslipUploadModal.tsx`

**Layout**:
```
┌─────────────────────────────────────────┐
│  Verify Your Wage                  [× ]  │
├─────────────────────────────────────────┤
│                                         │
│  Upload your payslip to verify wage     │
│  and earn 30 bonus points!               │
│                                         │
│  🔒 Privacy: We auto-blur sensitive     │
│  information (name, address, etc.)       │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │   [📎 Choose File]               │   │
│  │   or drag and drop here          │   │
│  │   JPG, PNG (max 5MB)            │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Preview:                                │
│  ┌─────────────────────────────────┐   │
│  │  [Image preview]                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Cancel]  [Upload & Verify]             │
│                                         │
└─────────────────────────────────────────┘
```

**Features**:
- File upload (drag and drop or choose)
- Image preview
- Max 5MB, JPG/PNG only
- Privacy notice about auto-blur
- On upload success:
  - Show "✅ Verified" badge on review
  - Award 30 bonus points
  - Increase trust score

---

### 8. My Reviews Page

**File Path**: `frontend/src/pages/MyReviewsPage.tsx`

**Layout**:
```
┌─────────────────────────────────────────┐
│  My Reviews                  [Profile]  │
├─────────────────────────────────────────┤
│                                         │
│  Total: 5 reviews | 230 points earned   │
│  ─────────────────────────────────────  │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Starbucks                          │ │
│  │ ⭐ 4.5 · £12.50/hr · 2024-06-15   │ │
│  │ [Detailed] [✅ Verified] [50 pts] │ │
│  │ "Great place to work! Pay..."      │ │
│  │ [Edit] [Delete] [Upload Payslip]  │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Costa Coffee                       │ │
│  │ ⭐ 3.8 · £11.25/hr · 2024-05-20   │ │
│  │ [Quick] [20 pts]                   │ │
│  │ "Standard cafe work..."            │ │
│  │ [Upgrade] [Edit] [Delete]          │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [1] [2] [3]                            │
└─────────────────────────────────────────┘
```

**Features**:
- List my reviews
- Show review type (Quick/Detailed)
- Show verification status
- Show points earned
- Edit button → Review edit page
- Delete button → Confirmation modal
- Upload Payslip button (if not verified)
- Upgrade button (if quick review)
- Empty state with CTA

---

### 9. Insights Dashboard

**File Path**: `frontend/src/pages/InsightsPage.tsx`

**Layout**:
```
┌─────────────────────────────────────────┐
│  [← Back]  Salary Insights               │
├─────────────────────────────────────────┤
│                                         │
│  💰 Overall Statistics                   │
│  ─────────────────────────────────────  │
│  Total Workplaces: 234                   │
│  Total Verified Wages: 1,567             │
│  Average Hourly Wage: £11.28             │
│                                         │
│  ─────────────────────────────────────  │
│  📊 Category Benchmarks                  │
│  ─────────────────────────────────────  │
│                                         │
│  Cafe          £11.45  [████████░░] 234  │
│  Restaurant    £10.85  [███████░░░] 456  │
│  Retail        £10.95  [███████░░░] 378  │
│  Convenience   £10.60  [██████░░░░] 123  │
│                                         │
│  ─────────────────────────────────────  │
│  📍 UK National Minimum Wage (2024)      │
│  ─────────────────────────────────────  │
│  Age 21+:      £11.44                    │
│  Age 18-20:    £8.60                     │
│  Age 16-17:    £6.40                     │
│  Apprentice:   £6.40                     │
│                                         │
│  ─────────────────────────────────────  │
│  🏆 Top Paying Workplaces                │
│  ─────────────────────────────────────  │
│  1. Pret A Manger       £14.50 (verified)│
│  2. Starbucks           £12.85 (verified)│
│  3. Whole Foods Market  £12.60 (verified)│
│                                         │
│  [Explore Regional Data →]               │
└─────────────────────────────────────────┘
```

**Features**:
- Overall stats cards
- Category benchmarks with bar charts
- National minimum wage reference
- Top paying workplaces list
- Link to regional comparison

---

### 10. Regional Wage Comparison

**File Path**: `frontend/src/pages/RegionalInsightsPage.tsx`

**Layout**:
```
┌─────────────────────────────────────────┐
│  [← Back]  Regional Wage Comparison      │
├─────────────────────────────────────────┤
│                                         │
│  📍 Location: [London          ] [🔍]   │
│  📏 Radius: [10km ▼]                     │
│  🏷️  Category: [Cafe ▼]                 │
│                                         │
│  ─────────────────────────────────────  │
│  💰 Area Statistics                      │
│  ─────────────────────────────────────  │
│  Average Wage: £11.95                    │
│  Range: £10.42 - £14.50                  │
│  Workplaces: 23                          │
│  Verified Reviews: 98                    │
│                                         │
│  ─────────────────────────────────────  │
│  📊 Workplaces by Wage                   │
│  ─────────────────────────────────────  │
│                                         │
│  🟢 Pret A Manger     £14.50  (1.2km)   │
│  🟢 Starbucks         £12.85  (0.8km)   │
│  🟡 Costa Coffee      £12.10  (2.3km)   │
│  🟡 Cafe Nero         £11.50  (1.5km)   │
│  🔴 Local Cafe        £10.50  (0.5km)   │
│                                         │
│  ─────────────────────────────────────  │
│  🗺️  Interactive Map                    │
│  ┌─────────────────────────────────┐   │
│  │  [Google Map with colored       │   │
│  │   markers based on wage level]  │   │
│  │   🟢 Above avg  🟡 Avg  🔴 Below│   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Features**:
- Location search autocomplete
- Radius and category filters
- Area statistics
- List of workplaces sorted by wage
- Color coding (green/yellow/red)
- Interactive map with colored markers

---

### 11. Leaderboard

**File Path**: `frontend/src/pages/LeaderboardPage.tsx`

**Layout**:
```
┌─────────────────────────────────────────┐
│  Leaderboard                  [Profile]  │
├─────────────────────────────────────────┤
│                                         │
│  [Points] [Trust Score] [Most Reviews]   │
│  ───────                                │
│                                         │
│  Top Contributors - Points               │
│                                         │
│  🥇 #1  Sarah Johnson          1,250 pts │
│         👤 Trust: 95 · Reviews: 25       │
│         🏆 Verified Reviewer              │
│                                         │
│  🥈 #2  Michael Brown          980 pts  │
│         👤 Trust: 88 · Reviews: 20       │
│         🏆 Helpful Contributor            │
│                                         │
│  🥉 #3  Emma Davis             850 pts  │
│         👤 Trust: 82 · Reviews: 18       │
│                                         │
│  4️⃣  #4  John Smith             720 pts  │
│         👤 Trust: 75 · Reviews: 15       │
│                                         │
│  ... (you) #47  Jane Doe       320 pts  │
│         👤 Trust: 75 · Reviews: 8        │
│                                         │
│  [Load more...]                          │
│                                         │
└─────────────────────────────────────────┘
```

**Features**:
- Tabs for different leaderboard types
- Top 100 users
- Current user highlighted
- Show badges
- Link to user profiles

---

## Routing Structure

**File Path**: `frontend/src/App.tsx`

```tsx
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import GuestRoute from './components/auth/GuestRoute';

// Pages
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import QRScanPage from './pages/QRScanPage';
import StoreDetailPage from './pages/StoreDetailPage';
import StoreCreatePage from './pages/StoreCreatePage';
import QuickReviewPage from './pages/QuickReviewPage';
import ReviewWritePage from './pages/ReviewWritePage';
import ReviewEditPage from './pages/ReviewEditPage';
import ReviewDetailPage from './pages/ReviewDetailPage';
import MyReviewsPage from './pages/MyReviewsPage';
import InsightsPage from './pages/InsightsPage';
import RegionalInsightsPage from './pages/RegionalInsightsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import UserProfilePage from './pages/UserProfilePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/error/NotFoundPage';
import ServerErrorPage from './pages/error/ServerErrorPage';
import ForbiddenPage from './pages/error/ForbiddenPage';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/stores/:id" element={<StoreDetailPage />} />
      <Route path="/reviews/:id" element={<ReviewDetailPage />} />
      <Route path="/insights" element={<InsightsPage />} />
      <Route path="/insights/regional" element={<RegionalInsightsPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/users/:id" element={<UserProfilePage />} />

      {/* QR Scan Route */}
      <Route path="/scan" element={<QRScanPage />} />
      <Route path="/scan/:googlePlaceId" element={<QRScanPage />} />

      {/* Auth Routes (Guest Only) */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      {/* Protected Routes (Auth Required) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/stores/new" element={<StoreCreatePage />} />
        <Route path="/reviews/quick" element={<QuickReviewPage />} />
        <Route path="/stores/:storeId/reviews/new" element={<ReviewWritePage />} />
        <Route path="/reviews/:id/edit" element={<ReviewEditPage />} />
        <Route path="/my-reviews" element={<MyReviewsPage />} />
      </Route>

      {/* Error Pages */}
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="/500" element={<ServerErrorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
```

---

## Folder Structure

```
frontend/src/pages/
├── HomePage.tsx                 # Home/Landing ✅
├── MapPage.tsx                  # Map page 🆕
├── QRScanPage.tsx               # QR scanner 🆕
├── ProfilePage.tsx              # Profile/settings ✅
├── MyReviewsPage.tsx            # My reviews 🆕
├── InsightsPage.tsx             # Insights dashboard 🆕
├── RegionalInsightsPage.tsx     # Regional comparison 🆕
├── LeaderboardPage.tsx          # Leaderboard 🆕
├── UserProfilePage.tsx          # Public user profile 🆕
│
├── stores/
│   ├── StoreDetailPage.tsx     # Workplace detail 🆕
│   └── StoreCreatePage.tsx     # Workplace registration 🆕
│
├── reviews/
│   ├── QuickReviewPage.tsx     # Quick review (30s) 🆕
│   ├── ReviewWritePage.tsx     # Detailed review 🆕
│   ├── ReviewEditPage.tsx      # Review edit 🆕
│   └── ReviewDetailPage.tsx    # Review detail 🆕
│
├── auth/
│   ├── LoginPage.tsx           # Login ✅
│   ├── RegisterPage.tsx        # Register ✅
│   ├── ForgotPasswordPage.tsx  # Password recovery ✅
│   └── ResetPasswordPage.tsx   # Password reset ✅
│
└── error/
    ├── NotFoundPage.tsx        # 404 ✅
    ├── ServerErrorPage.tsx     # 500 ✅
    └── ForbiddenPage.tsx       # 403 ✅
```

---

## Backend API Requirements

### Workplaces (Stores)
- `GET /api/stores` - List workplaces (map)
- `GET /api/stores/:id` - Workplace details
- `POST /api/stores` - Create workplace
- `PATCH /api/stores/:id` - Update workplace (optional)
- `DELETE /api/stores/:id` - Delete workplace (optional)

### Google Places Proxy
- `GET /api/places/search?q={query}&lat={lat}&lng={lng}` - Search places 🆕
- `GET /api/places/details/:placeId` - Get place details 🆕
- `GET /api/places/check/:placeId` - Check if exists in DB 🆕

### Reviews
- `GET /api/stores/:storeId/reviews` - Workplace reviews
- `POST /api/reviews` - Create detailed review
- `POST /api/reviews/quick` - Create quick review 🆕
- `GET /api/reviews/my` - My reviews
- `GET /api/reviews/:id` - Review details
- `PATCH /api/reviews/:id` - Update review
- `PATCH /api/reviews/:id/upgrade` - Upgrade quick to detailed 🆕
- `POST /api/reviews/:id/payslip` - Upload payslip 🆕
- `POST /api/reviews/:id/helpful` - Mark as helpful 🆕
- `DELETE /api/reviews/:id` - Delete review

### Insights
- `GET /api/insights/salary/:storeId` - Workplace wage stats 🆕
- `GET /api/insights/salary/regional` - Regional wage comparison 🆕
- `GET /api/insights/benchmarks` - Category benchmarks 🆕

### Users
- `GET /api/users/:id` - User profile 🆕
- `GET /api/users/leaderboard?type={type}&limit={limit}` - Leaderboard 🆕

### Profile
- `GET /api/auth/me` - My info ✅
- `PATCH /api/auth/profile` - Update my info ✅
- `PATCH /api/auth/change-password` - Change password ✅

### Auth
- `POST /api/auth/register` - Register ✅
- `POST /api/auth/login` - Login ✅
- `POST /api/auth/logout` - Logout ✅
- `POST /api/auth/forgot-password` - Password recovery ✅
- `POST /api/auth/reset-password/:token` - Password reset ✅

---

## Implementation Checklist

### Phase 1: Basic Pages (Completed ✅)
- [x] Home/Landing page
- [x] Login/Register
- [x] Profile page
- [x] Password recovery/reset
- [x] Error pages (404, 500, 403)

### Phase 2: Map & Workplace Discovery (Next)
- [ ] Backend: Google Places proxy API
- [ ] Backend: Store API with Google Place ID
- [ ] Map page with integrated search
- [ ] Workplace detail page with salary insights
- [ ] QR scanner page

### Phase 3: Review Writing and Management
- [ ] Backend: Review API (quick + detailed)
- [ ] Backend: Payslip upload service
- [ ] Backend: Points & trust score system
- [ ] Quick review page
- [ ] Detailed review page
- [ ] Payslip upload modal
- [ ] Review edit page
- [ ] Upgrade quick review
- [ ] My reviews page

### Phase 4: Additional Features
- [ ] Backend: Insights aggregation API
- [ ] Backend: Leaderboard API
- [ ] Review detail page
- [ ] Workplace registration page
- [ ] Insights dashboard
- [ ] Regional wage comparison
- [ ] Leaderboard
- [ ] User profile (public)

### Phase 5: Pre-Deployment
- [ ] Terms of Service
- [ ] Privacy Policy

### Phase 6: Post-Launch
- [ ] Search page
- [ ] Notifications page
- [ ] Contact page
- [ ] About page
- [ ] Comments feature

---

## Next Steps

**Current Position**: Phase 1 Complete ✅

**Next Phase**: Phase 2 - Map & Workplace Discovery

**Step 1**: Backend Google Places Integration (6-8 hours)
- Install Google Maps API SDK
- Create Places proxy endpoints
- Add Google Place ID to Store model
- Implement workplace lookup by Place ID

**Step 2**: Map Page (6-8 hours)
- Install `@react-google-maps/api`
- Implement Google Maps component
- Add workplace markers
- Build integrated search
- Add filtering (radius, category)

**Step 3**: Workplace Detail Page (4-5 hours)
- Display workplace info
- Show salary insights
- List reviews with filters
- Add QR code generation

**Step 4**: QR Scanner (2-3 hours)
- Implement camera scanner
- Handle scanned Place IDs
- Auto-redirect logic

---

## Reference Documents

- [PRD.md](./PRD.md) - Product Requirements Document
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Database Schema
- [API_SPEC.md](./API_SPEC.md) - API Specification
- [UI_DESIGN_GUIDE.md](./UI_DESIGN_GUIDE.md) - UI Design Guide

---

**Document Created**: 2024-12-14
**Last Updated**: 2024-12-14
**Project**: WorkReview - Workplace Review Platform
**Version**: 2.0.0
