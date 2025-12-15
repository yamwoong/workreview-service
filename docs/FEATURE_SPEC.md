# WorkReview Feature Specification

> Detailed specification for core differentiation features

**Project**: WorkReview - Workplace Review Platform
**Version**: 2.0.0
**Last Updated**: 2024-12-14
**Target Market**: United Kingdom

---

## 📋 Table of Contents

1. [Feature Overview](#feature-overview)
2. [Salary Transparency System](#salary-transparency-system)
3. [Quick Review Mode](#quick-review-mode)
4. [Payslip Verification](#payslip-verification)
5. [Integrated Search](#integrated-search)
6. [QR Code System](#qr-code-system)
7. [Gamification System](#gamification-system)
8. [Regional Insights](#regional-insights)
9. [Trust Score System](#trust-score-system)
10. [Anonymous Reviews](#anonymous-reviews)

---

## Feature Overview

### Core Differentiation Features

WorkReview stands out from competitors with these unique features:

| Feature | Description | Priority | Status |
|---------|-------------|----------|--------|
| **Salary Transparency** | Real hourly wages with min/max/average | ⭐⭐⭐⭐⭐ | Planned |
| **Payslip Verification** | Upload payslip to verify wage claims | ⭐⭐⭐⭐⭐ | Planned |
| **Quick Reviews** | 30-second reviews for fast feedback | ⭐⭐⭐⭐⭐ | Planned |
| **QR Code Scanning** | Scan workplace QR for instant access | ⭐⭐⭐⭐ | Planned |
| **Integrated Search** | Combines Google Places + our database | ⭐⭐⭐⭐⭐ | Planned |
| **Regional Insights** | Compare wages across geographic areas | ⭐⭐⭐⭐ | Planned |
| **Gamification** | Points, badges, trust score, leaderboard | ⭐⭐⭐ | Planned |
| **Anonymous Reviews** | Protect reviewer identity while maintaining trust | ⭐⭐⭐⭐ | Planned |

---

## Salary Transparency System

### 1.1 Overview

The salary transparency system is WorkReview's primary differentiator. It allows users to share and view real hourly wages, helping workers make informed decisions.

### 1.2 Key Components

#### Wage Display
- **Average Hourly Wage**: £11.85
- **Wage Range**: £10.50 - £13.25
- **Verification Rate**: 8/12 (66%)
- **Breakdown by Position**:
  - Barista: £12.10 (5 reviews)
  - Team Member: £11.20 (3 reviews)
  - Shift Supervisor: £13.25 (2 reviews)

#### Data Collection
- **Optional Field**: Users can choose to share their wage
- **Currency**: GBP (£)
- **Validation**: 0-100 range (£0-100/hour)
- **Privacy**: No personal identification with wage data

### 1.3 Database Schema

```typescript
// In Review model
hourlyWage: {
  type: Number,
  default: null,
  min: [0, 'Hourly wage must be positive'],
  max: [100, 'Hourly wage cannot exceed £100'],
  index: true  // For aggregation queries
}

// In Store model
averageWage: {
  min: { type: Number, default: 0, min: 0 },
  max: { type: Number, default: 0, min: 0 },
  average: { type: Number, default: 0, min: 0 },
  count: { type: Number, default: 0, min: 0 }
}
```

### 1.4 Aggregation Logic

**When Review is Created/Updated**:
1. Extract all `hourlyWage` values for the workplace (non-null)
2. Calculate:
   - `min`: Lowest wage
   - `max`: Highest wage
   - `average`: Mean wage
   - `count`: Number of wage entries
3. Update Store's `averageWage` field

**Aggregation Pipeline**:
```typescript
const wageStats = await Review.aggregate([
  { $match: { store: storeId, hourlyWage: { $ne: null } } },
  {
    $group: {
      _id: null,
      min: { $min: '$hourlyWage' },
      max: { $max: '$hourlyWage' },
      average: { $avg: '$hourlyWage' },
      count: { $sum: 1 }
    }
  }
]);
```

### 1.5 UI Components

**Workplace Detail Page - Salary Insights Section**:
```tsx
<SalaryInsights>
  <Heading>💰 Salary Insights</Heading>
  <StatCard>
    <Label>Average Hourly Wage</Label>
    <Value>£11.85</Value>
  </StatCard>
  <StatCard>
    <Label>Wage Range</Label>
    <Value>£10.50 - £13.25</Value>
  </StatCard>
  <StatCard>
    <Label>Verified</Label>
    <Value>8/12 (66%)</Value>
  </StatCard>
  <PositionBreakdown>
    <Title>By Position</Title>
    <PositionRow>
      <Name>Barista</Name>
      <Wage>£12.10</Wage>
      <Count>(5 reviews)</Count>
    </PositionRow>
  </PositionBreakdown>
</SalaryInsights>
```

### 1.6 API Endpoints

```http
GET /api/insights/salary/:storeId
```

**Response**:
```json
{
  "success": true,
  "data": {
    "storeId": "507f1f77bcf86cd799439012",
    "storeName": "Starbucks",
    "wageStats": {
      "min": 10.50,
      "max": 13.25,
      "average": 11.85,
      "median": 11.75,
      "count": 8,
      "verifiedCount": 6
    },
    "byPosition": [
      {
        "position": "Barista",
        "average": 12.10,
        "count": 5,
        "min": 11.00,
        "max": 13.25
      }
    ]
  }
}
```

---

## Quick Review Mode

### 2.1 Overview

Quick Review Mode allows users to leave feedback in 30 seconds or less, reducing friction and increasing review volume.

### 2.2 Key Features

**Simplified Form**:
- 4 rating sliders (1-5): Salary, Rest Time, Work Env, Management
- Short content (10-500 characters)
- Optional hourly wage
- Position input
- Anonymous option

**Incentives**:
- Earn 20 points (vs 50 for detailed)
- Can upgrade later for +30 points (total 50)
- Faster submission process

### 2.3 Comparison with Detailed Review

| Aspect | Quick Review | Detailed Review |
|--------|--------------|-----------------|
| **Time to Complete** | 30 seconds | 3-5 minutes |
| **Ratings** | 4 categories (sliders) | 4 categories (stars) |
| **Content Length** | 10-500 chars | 10-2000 chars |
| **Work Period** | Not required | Required |
| **Pros/Cons** | Not included | Optional |
| **Points Earned** | 20 | 50 |
| **Can Upgrade** | Yes (+30 pts) | N/A |

### 2.4 Database Schema

```typescript
reviewMode: {
  type: String,
  enum: ['quick', 'detailed'],
  default: 'detailed',
  required: true,
  index: true
}

// Conditional validation based on reviewMode
content: {
  type: String,
  required: true,
  validate: {
    validator: function(v: string) {
      if (this.reviewMode === 'quick') {
        return v.length >= 10 && v.length <= 500;
      }
      return v.length >= 10 && v.length <= 2000;
    }
  }
}

workPeriod: {
  start: { type: Date, required: false },  // Required only for detailed
  end: { type: Date, default: null }
}
```

### 2.5 Upgrade Mechanism

**Upgrade Quick to Detailed**:
1. User clicks "Upgrade to Detailed" on their quick review
2. Modal/page appears with additional fields:
   - Work period (start/end dates)
   - Expanded content (up to 2000 chars)
   - Pros (optional, 500 chars)
   - Cons (optional, 500 chars)
3. On submit:
   - Update `reviewMode` to 'detailed'
   - Award +30 bonus points
   - Total points = 50 (same as detailed from start)

**API Endpoint**:
```http
PATCH /api/reviews/:id/upgrade
```

**Request Body**:
```json
{
  "workPeriod": {
    "start": "2024-06-01",
    "end": "2024-11-30"
  },
  "pros": "Accurate pay, friendly management",
  "cons": "Very busy during peak times",
  "content": "Expanded detailed content..."
}
```

### 2.6 UI Flow

**Quick Review Page** (`/reviews/quick?placeId={googlePlaceId}`):

1. Auto-load workplace info from Google Places API
2. Display simplified form
3. User fills ratings, short content, position
4. Optional: Add hourly wage
5. Optional: Check "Post anonymously"
6. Submit → Earn 20 points
7. Show success message: "Review posted! Earn 30 more by upgrading to detailed."

---

## Payslip Verification

### 3.1 Overview

Payslip verification builds trust by allowing users to prove their wage claims with photo evidence. Images are auto-blurred for privacy.

### 3.2 Key Features

- **Upload**: JPG, PNG (max 5MB)
- **Auto-Blur**: Sensitive info (name, address, NI number) automatically blurred
- **Privacy First**: Original image never stored, only blurred version
- **Rewards**: 30 bonus points + increased trust score
- **Badge**: "✅ Verified" shown on review

### 3.3 Technical Implementation

#### File Upload
- **Library**: `multer` (Express middleware)
- **Storage**: AWS S3 or Cloudinary
- **File Types**: image/jpeg, image/png
- **Max Size**: 5MB
- **Validation**: Check file type, size, image dimensions

#### Image Processing
- **Library**: `sharp` (Node.js image processing)
- **Blur Algorithm**: Gaussian blur on detected regions
- **Detection**: OCR to find sensitive patterns (name, address, NI)
- **Output**: Blurred image stored as new file

**Processing Pipeline**:
```typescript
import sharp from 'sharp';
import { detectSensitiveRegions } from './ocr-service';

async function processPayslip(inputPath: string): Promise<string> {
  // 1. Load image
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  // 2. Detect sensitive regions (using OCR)
  const regions = await detectSensitiveRegions(inputPath);

  // 3. Apply blur to regions
  for (const region of regions) {
    await image.blur(20).extract({
      left: region.x,
      top: region.y,
      width: region.width,
      height: region.height
    });
  }

  // 4. Save blurred image
  const outputPath = `payslips/blurred_${Date.now()}.jpg`;
  await image.toFile(outputPath);

  return outputPath;
}
```

#### Simplified Approach (MVP)
For MVP, apply uniform blur to entire image except center area showing wage amount:

```typescript
async function processPayslip(inputPath: string): Promise<string> {
  const image = sharp(inputPath);

  // Apply blur to entire image
  const blurred = await image.blur(15).toBuffer();

  // Save blurred image
  const outputPath = `payslips/blurred_${Date.now()}.jpg`;
  await sharp(blurred).toFile(outputPath);

  return outputPath;
}
```

### 3.4 Database Schema

```typescript
// In Review model
payslipUrl: {
  type: String,
  default: null,
  index: true
},

isPayslipVerified: {
  type: Boolean,
  default: false,
  index: true  // For filtering verified reviews
}
```

### 3.5 API Endpoints

```http
POST /api/reviews/:id/payslip
```

**Request** (multipart/form-data):
```
payslip: [File] (image/jpeg, image/png, max 5MB)
```

**Response**:
```json
{
  "success": true,
  "data": {
    "payslipUrl": "https://storage.example.com/payslips/blurred_abc123.jpg",
    "isPayslipVerified": true,
    "rewardPoints": 30
  },
  "message": "Payslip uploaded and verified successfully. You earned 30 bonus points!"
}
```

### 3.6 Side Effects

**When Payslip is Uploaded**:
1. Process and blur image
2. Upload to cloud storage
3. Update Review: `payslipUrl`, `isPayslipVerified: true`
4. Recalculate Store's `verifiedCount`
5. Award user 30 points
6. Increase user's `trustScore` (+2 points)

### 3.7 UI Components

**Payslip Upload Modal**:
```tsx
<Modal>
  <Heading>Verify Your Wage</Heading>
  <Description>
    Upload your payslip to verify your wage and earn 30 bonus points!
  </Description>
  <PrivacyNotice>
    🔒 Privacy: We automatically blur sensitive information
    (name, address, NI number)
  </PrivacyNotice>
  <FileUpload
    accept="image/jpeg,image/png"
    maxSize={5 * 1024 * 1024}
    onUpload={handleUpload}
  />
  <ImagePreview src={preview} />
  <Actions>
    <Button variant="secondary" onClick={onCancel}>Cancel</Button>
    <Button variant="primary" onClick={onSubmit}>Upload & Verify</Button>
  </Actions>
</Modal>
```

---

## Integrated Search

### 4.1 Overview

Integrated Search combines results from Google Places API and our own database, providing a seamless search experience.

### 4.2 Key Features

- **Dual Source**: Search both Google Places and our database
- **Indicators**: Show which results have reviews in our DB
- **Smart Routing**:
  - Click workplace with reviews → Workplace detail page
  - Click Google Places result without reviews → Quick review page

### 4.3 Search Flow

**User Types Query**:
1. Frontend calls both APIs in parallel:
   - `GET /api/places/search?q={query}` - Google Places
   - `GET /api/stores?search={query}` - Our database
2. Merge results:
   - Deduplicate by Google Place ID
   - Prioritize our DB results (have reviews)
   - Add indicator badges
3. Display combined results with indicators:
   - ✅ "Has Reviews" - in our database
   - 📍 "Add Review" - Google Places only

**Example**:
```
Search: "Starbucks Oxford"

Results:
[✅ Has Reviews] Starbucks - High Street, Oxford
   ⭐ 4.2 · £11.85/hr · 12 reviews

[📍 Add Review] Starbucks Coffee - Cornmarket St, Oxford
   New workplace - Be the first to review!
```

### 4.4 API Endpoints

**Search Google Places**:
```http
GET /api/places/search?q=Starbucks&lat=51.752&lng=-1.258
```

**Search Our Database**:
```http
GET /api/stores?search=Starbucks
```

**Check if Workplace Exists**:
```http
GET /api/places/check/:placeId
```

### 4.5 Frontend Implementation

```typescript
// Integrated search hook
async function useIntegratedSearch(query: string, location?: LatLng) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.length < 2) return;

    const searchBoth = async () => {
      // Parallel API calls
      const [placesRes, storesRes] = await Promise.all([
        placesAPI.search(query, location?.lat, location?.lng),
        storeAPI.search(query)
      ]);

      // Merge and deduplicate
      const merged = mergePlacesAndStores(
        placesRes.data.predictions,
        storesRes.data.stores
      );

      setResults(merged);
    };

    searchBoth();
  }, [query, location]);

  return results;
}

function mergePlacesAndStores(places, stores) {
  const storesByPlaceId = new Map();
  stores.forEach(s => storesByPlaceId.set(s.googlePlaceId, s));

  return places.map(place => ({
    ...place,
    hasReviews: storesByPlaceId.has(place.placeId),
    storeData: storesByPlaceId.get(place.placeId) || null
  }));
}
```

### 4.6 UI Components

```tsx
<SearchResults>
  {results.map(result => (
    <SearchResultCard
      key={result.placeId}
      onClick={() => handleResultClick(result)}
    >
      {result.hasReviews ? (
        <Badge variant="success">✅ Has Reviews</Badge>
      ) : (
        <Badge variant="info">📍 Add Review</Badge>
      )}
      <Name>{result.name}</Name>
      <Address>{result.address}</Address>
      {result.storeData && (
        <Stats>
          ⭐ {result.storeData.averageRating.overall} ·
          £{result.storeData.averageWage.average}/hr ·
          {result.storeData.reviewCount} reviews
        </Stats>
      )}
    </SearchResultCard>
  ))}
</SearchResults>
```

---

## QR Code System

### 5.1 Overview

QR Code system provides instant access to workplace pages by scanning physical QR codes placed at workplaces.

### 5.2 Key Features

- **Generate QR**: Each workplace has unique QR code
- **Scan to Access**: Mobile camera scan → workplace page or quick review
- **Smart Routing**:
  - If workplace in DB → Detail page
  - If not in DB → Quick review page
- **Download QR**: Workplace owners can download and print

### 5.3 QR Code Content

**QR encodes URL**:
```
https://workreview.com/scan?placeId={googlePlaceId}
```

**Why Google Place ID?**
- Unique identifier across all workplaces
- No need to pre-register workplace
- Enables quick review for new workplaces

### 5.4 Technical Implementation

#### QR Generation
**Library**: `qrcode` (Node.js) or `qrcode.react` (React)

**Backend Endpoint** (Optional):
```http
GET /api/stores/:id/qr
```

**Response**: PNG image (QR code)

**Frontend Component**:
```tsx
import QRCode from 'qrcode.react';

function WorkplaceQRCode({ googlePlaceId }: { googlePlaceId: string }) {
  const url = `https://workreview.com/scan?placeId=${googlePlaceId}`;

  return (
    <QRCode
      value={url}
      size={256}
      level="H"  // High error correction
      includeMargin={true}
    />
  );
}
```

#### QR Scanning
**Library**: `html5-qrcode` or `react-qr-scanner`

**Frontend Page**: `/scan`

```tsx
import { Html5QrcodeScanner } from 'html5-qrcode';

function QRScanPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: 250 }
    );

    scanner.render(onScanSuccess, onScanError);

    return () => scanner.clear();
  }, []);

  async function onScanSuccess(decodedText: string) {
    // Extract placeId from URL
    const url = new URL(decodedText);
    const placeId = url.searchParams.get('placeId');

    // Check if workplace exists
    const { data } = await placesAPI.check(placeId);

    if (data.exists) {
      navigate(`/stores/${data.workplace._id}`);
    } else {
      navigate(`/reviews/quick?placeId=${placeId}`);
    }
  }

  return (
    <Container>
      <Heading>Scan Workplace QR Code</Heading>
      <div id="qr-reader" />
    </Container>
  );
}
```

### 5.5 User Flow

**Scenario 1: Workplace Already Reviewed**
1. User scans QR at Starbucks
2. QR encodes: `https://workreview.com/scan?placeId=ChIJ_WXS9XQHZ0g...`
3. Frontend calls: `GET /api/places/check/ChIJ_WXS9XQHZ0g...`
4. Response: `{ exists: true, workplace: { _id: '507f...' } }`
5. Redirect to: `/stores/507f...`

**Scenario 2: New Workplace**
1. User scans QR at new local cafe
2. QR encodes: `https://workreview.com/scan?placeId=ChIJ_ABC123...`
3. Frontend calls: `GET /api/places/check/ChIJ_ABC123...`
4. Response: `{ exists: false, workplace: null }`
5. Redirect to: `/reviews/quick?placeId=ChIJ_ABC123...`
6. Auto-load workplace info from Google Places
7. User writes quick review → Auto-create workplace

### 5.6 QR Code Download

**Workplace Detail Page**:
```tsx
<QRCodeSection>
  <QRCode value={qrUrl} size={200} />
  <DownloadButton onClick={downloadQR}>
    Download QR Code
  </DownloadButton>
</QRCodeSection>

function downloadQR() {
  const canvas = document.querySelector('canvas');
  const url = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `workreview-qr-${storeName}.png`;
  link.href = url;
  link.click();
}
```

---

## Gamification System

### 6.1 Overview

Gamification encourages user engagement through points, badges, trust scores, and leaderboards.

### 6.2 Points System

**Earning Points**:
| Action | Points |
|--------|--------|
| Quick review | 20 |
| Detailed review | 50 |
| Upgrade quick to detailed | +30 |
| Upload payslip | +30 |
| Review marked helpful | +2 (per vote) |
| Login streak (7 days) | +10 |
| First review | +20 (bonus) |

**Spending Points** (Future):
- Unlock insights: 100 points
- Highlight review: 50 points
- Premium badge: 500 points

### 6.3 Trust Score

Trust score (0-100) represents user reliability and contribution quality.

**Calculation**:
```typescript
trustScore = 50 (base)
  + (verifiedReviewCount * 5)  // +5 per verified review
  + (helpfulVoteCount * 0.5)   // +0.5 per helpful vote
  - (reportedCount * 10)       // -10 per report
  + (accountAge in months)     // +1 per month (max 10)
```

**Examples**:
- New user: 50 (base)
- User with 5 verified reviews, 20 helpful votes: 50 + 25 + 10 = 85
- User with 10 verified reviews, 50 helpful votes, 6 months old: 50 + 50 + 25 + 6 = 131 → capped at 100

### 6.4 Badges

**Badge Types**:
| Badge | Requirement | Icon |
|-------|-------------|------|
| **Verified Reviewer** | 5+ payslip-verified reviews | ✅ |
| **Helpful Contributor** | 50+ helpful votes received | 👍 |
| **Prolific Reviewer** | 25+ reviews written | 📝 |
| **Early Adopter** | First 100 users | 🌟 |
| **Trusted Voice** | Trust score ≥ 90 | 🏆 |

**Database Schema**:
```typescript
// In User model
badges: [
  {
    type: {
      type: String,
      enum: ['verified_reviewer', 'helpful_contributor', 'prolific_reviewer', 'early_adopter', 'trusted_voice']
    },
    name: String,
    earnedAt: { type: Date, default: Date.now }
  }
]
```

### 6.5 Leaderboard

**Types**:
- **Points Leaderboard**: Top users by total points
- **Trust Score Leaderboard**: Top users by trust score
- **Review Count Leaderboard**: Top users by review count

**API Endpoint**:
```http
GET /api/users/leaderboard?type=points&limit=100
```

**Response**:
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "user": {
          "_id": "507f...",
          "name": "Sarah Johnson",
          "avatar": "https://...",
          "trustScore": 95
        },
        "points": 1250,
        "reviewCount": 25,
        "verifiedCount": 18
      }
    ]
  }
}
```

---

## Regional Insights

### 7.1 Overview

Regional Insights allow users to compare wages across geographic areas, helping them understand local market rates.

### 7.2 Key Features

- **Location-Based**: Search by city, postcode, or coordinates
- **Radius Selection**: 5km, 10km, 25km, 50km
- **Category Filter**: Compare within specific industry
- **Interactive Map**: Visualize wage levels with colored markers
- **Benchmark Data**: Compare to UK national minimum wage

### 7.3 API Endpoint

```http
GET /api/insights/salary/regional?lat=51.5074&lng=-0.1278&radius=10000&category=cafe
```

**Response**:
```json
{
  "success": true,
  "data": {
    "region": {
      "center": { "lat": 51.5074, "lng": -0.1278 },
      "radius": 10000,
      "category": "cafe"
    },
    "overall": {
      "averageWage": 11.95,
      "minWage": 10.42,
      "maxWage": 14.50,
      "workplaceCount": 23,
      "reviewCount": 156,
      "verifiedCount": 98
    },
    "byWorkplace": [
      {
        "storeId": "507f...",
        "name": "Starbucks",
        "distance": 1250,
        "averageWage": 11.85,
        "reviewCount": 12,
        "verifiedCount": 8
      }
    ],
    "insights": {
      "topPaying": {
        "name": "Pret A Manger",
        "averageWage": 14.50
      },
      "mostReviewed": {
        "name": "Costa Coffee",
        "reviewCount": 15
      }
    }
  }
}
```

### 7.4 MongoDB Aggregation

```typescript
const regionalData = await Store.aggregate([
  // Geospatial filter
  {
    $geoNear: {
      near: { type: 'Point', coordinates: [lng, lat] },
      distanceField: 'distance',
      maxDistance: radius,
      spherical: true
    }
  },
  // Category filter
  {
    $match: category ? { category } : {}
  },
  // Join with reviews
  {
    $lookup: {
      from: 'reviews',
      localField: '_id',
      foreignField: 'store',
      as: 'reviews'
    }
  },
  // Calculate stats
  {
    $group: {
      _id: null,
      avgWage: { $avg: '$averageWage.average' },
      minWage: { $min: '$averageWage.min' },
      maxWage: { $max: '$averageWage.max' },
      workplaceCount: { $sum: 1 },
      reviewCount: { $sum: '$reviewCount' },
      verifiedCount: { $sum: '$verifiedCount' }
    }
  }
]);
```

---

## Trust Score System

### 8.1 Overview

Trust Score helps users identify reliable reviewers and high-quality reviews.

### 8.2 Calculation

**Base Formula**:
```
trustScore = 50 (starting)
  + (verifiedReviewCount × 5)     // Payslip-verified reviews
  + (helpfulVoteCount × 0.5)      // Reviews marked helpful
  + (accountAgeMonths × 1)        // Account longevity (max +10)
  - (reportedCount × 10)          // Content violations
  - (deletedReviewCount × 2)      // Deleted reviews
```

**Bounds**: 0-100

**Categories**:
- 0-30: Low trust
- 31-60: Medium trust
- 61-80: High trust
- 81-100: Very high trust

### 8.3 Database Schema

```typescript
// In User model
trustScore: {
  type: Number,
  default: 50,
  min: 0,
  max: 100,
  index: true  // For leaderboard queries
}
```

### 8.4 Recalculation Triggers

**Increase Trust Score**:
- Payslip verified: +5
- Review marked helpful: +0.5
- Account age milestone: +1 per month (max +10)

**Decrease Trust Score**:
- Review reported and removed: -10
- Review deleted by user: -2

---

## Anonymous Reviews

### 9.1 Overview

Anonymous reviews protect user identity while maintaining review integrity through trust scores.

### 9.2 Key Features

- **Identity Hidden**: User name shown as "Anonymous"
- **Trust Score Visible**: Trust score still displayed
- **Optional**: User choice per review
- **Integrity**: Cannot edit to add/remove anonymity later

### 9.3 Database Schema

```typescript
// In Review model
isAnonymous: {
  type: Boolean,
  default: false,
  immutable: true  // Cannot change after creation
}
```

### 9.4 Display Logic

**Review Card**:
```tsx
function ReviewCard({ review }: { review: IReview }) {
  return (
    <Card>
      <Author>
        {review.isAnonymous ? (
          <>
            <Name>Anonymous</Name>
            <TrustBadge score={review.user.trustScore}>
              Trust Score: {review.user.trustScore}
            </TrustBadge>
          </>
        ) : (
          <>
            <Name>{review.user.name}</Name>
            <Avatar src={review.user.avatar} />
            <TrustBadge score={review.user.trustScore}>
              {review.user.trustScore}
            </TrustBadge>
          </>
        )}
      </Author>
      <Content>{review.content}</Content>
    </Card>
  );
}
```

---

## Implementation Roadmap

### Phase 1: Core Features (MVP)
- ✅ Salary transparency (average wage display)
- ✅ Quick review mode
- ✅ Integrated search
- ✅ Anonymous reviews
- ✅ Points system (basic)

### Phase 2: Verification & Trust
- Payslip verification
- Trust score calculation
- Badge system
- Leaderboard

### Phase 3: Advanced Insights
- Regional wage comparison
- Interactive wage map
- Category benchmarks
- Trend analysis

### Phase 4: Gamification
- Points marketplace
- Premium badges
- Review highlighting
- User achievements

---

## Success Metrics

### User Engagement
- **Review Volume**: 1000+ reviews in first 3 months
- **Verification Rate**: 40%+ reviews with payslip
- **Quick Review Adoption**: 60%+ use quick mode
- **Upgrade Rate**: 25%+ quick reviews upgraded
- **QR Scans**: 200+ scans per month

### Data Quality
- **Average Trust Score**: 70+
- **Verified Wage Data**: 500+ entries
- **Review Length**: Avg 150 characters (quick), 400 (detailed)
- **Helpful Vote Rate**: 30%+ reviews marked helpful

### Platform Growth
- **Active Users**: 5000+ in first 6 months
- **Workplaces**: 500+ with reviews
- **Geographic Coverage**: 10+ UK cities
- **Retention**: 40%+ monthly active users

---

**Document Version**: 1.0.0
**Last Updated**: 2024-12-14
**Project**: WorkReview - Workplace Review Platform
