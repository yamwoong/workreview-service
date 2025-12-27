# 🗄️ WorkReview - Database Schema Design

> **Project**: WorkReview - Part-time Work Review Platform
> **Target Market**: United Kingdom 🇬🇧
> **Database**: MongoDB 7.x
> **ODM**: Mongoose
> **Created**: 2024-12-10
> **Updated**: 2024-12-14
> **Version**: 2.0.0

---

## 📊 ERD (Entity Relationship Diagram)

```
┌─────────────────────┐
│        User         │
│─────────────────────│
│ _id (PK)           │◄────────┐
│ email              │         │
│ password           │         │
│ name               │         │ createdBy (1:N)
│ role               │         │
│ avatar             │         │
│ resetToken         │         │
│ resetExpires       │         │
│ points             │ 🆕     │
│ trustScore         │ 🆕     │
└─────────────────────┘         │
        │                       │
        │ createdBy             │
        │ (1:N)                │
        │                       │
        ▼                       │
┌─────────────────────┐         │
│       Store         │─────────┘
│─────────────────────│
│ _id (PK)           │
│ googlePlaceId      │ 🆕 (unique, Google Place ID)
│ name               │
│ address            │
│ location           │ (GeoJSON Point)
│ category           │
│ phone              │
│ createdBy (FK)     │──────┐
│ averageRating      │      │
│ averageWage        │ 🆕  │ store (1:N)
│ reviewCount        │      │
└─────────────────────┘      │
                             │
                             ▼
                     ┌─────────────────────┐
                     │       Review        │
                     │─────────────────────│
                     │ _id (PK)           │
                     │ store (FK)         │
                     │ user (FK)          │
                     │ ratings            │
                     │  - salary          │
                     │  - restTime        │
                     │  - workEnv         │
                     │  - management      │
                     │ averageRating      │
                     │ content            │
                     │ workPeriod         │
                     │ position           │
                     │ pros               │
                     │ cons               │
                     │ wageType           │ 🆕
                     │ hourlyWage         │ 🆕
                     │ reviewMode         │ 🆕
                     │ isAnonymous        │ 🆕
                     │ helpfulCount       │ 🆕
                     └─────────────────────┘
```

---

## 📋 Collection Details

### 1. Users Collection ✅ (Implemented)

Stores user account information.

```typescript
import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;  // bcrypt hashed
  name: string;
  role: 'admin' | 'manager' | 'employee';
  avatar?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  points: number;  // 🆕 Reward points
  trustScore: number;  // 🆕 Trust score (0-100)
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false  // Exclude from queries by default
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'manager', 'employee'],
      message: '{VALUE} is not a valid role'
    },
    default: 'employee'
  },
  avatar: {
    type: String,
    default: null
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  },
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  trustScore: {
    type: Number,
    default: 50,  // Start at 50/100
    min: 0,
    max: 100
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.resetPasswordToken;
      return ret;
    }
  }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ role: 1 });
userSchema.index({ points: -1 });
userSchema.index({ trustScore: -1 });

export const UserModel = model<IUser>('User', userSchema);
```

**Sample Data:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5gy0P6x7zK8Ru",
  "name": "John Smith",
  "role": "employee",
  "avatar": null,
  "points": 50,
  "trustScore": 65,
  "createdAt": "2024-12-01T00:00:00.000Z",
  "updatedAt": "2024-12-01T00:00:00.000Z"
}
```

---

### 2. Stores Collection 🆕

Stores workplace information (part-time job locations).

```typescript
interface IAddress {
  country: string;      // ISO 3166-1 alpha-2 (GB, US, KR, etc.)
  countryName: string;  // Country name (for display)
  formatted: string;    // Full address (for display)
  street?: string;      // Street address
  city?: string;        // City
  state?: string;       // State/Province
  postalCode?: string;  // Postal code
}

interface ILocation {
  type: 'Point';
  coordinates: [number, number];  // [longitude, latitude]
}

interface IAverageWage {
  min: number;      // Minimum hourly wage (£)
  max: number;      // Maximum hourly wage (£)
  average: number;  // Average hourly wage (£)
  count: number;    // Number of wage data points
}

interface IStore extends Document {
  googlePlaceId?: string;  // 🆕 Google Place ID (unique identifier, optional)
  isFromGooglePlaces: boolean;  // 🆕 Whether store data is from Google Places (read-only if true)
  name: string;
  address: IAddress;  // 🆕 Structured address
  location: ILocation;
  category: string;
  phone?: string;
  currency: string;  // 🆕 ISO 4217 currency code (GBP, USD, KRW, etc.)
  createdBy: Schema.Types.ObjectId;  // User reference
  averageRating: {
    salary: number;      // Average salary rating
    restTime: number;    // Average break time rating
    workEnv: number;     // Average work environment rating
    management: number;  // Average management rating
    overall: number;     // Overall average
  };
  averageWage: IAverageWage;  // 🆕 Hourly wage statistics
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const storeSchema = new Schema<IStore>({
  googlePlaceId: {
    type: String,
    unique: true,
    sparse: true,  // Allow null while maintaining uniqueness
    trim: true,
    index: true
  },
  isFromGooglePlaces: {
    type: Boolean,
    default: false,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Store name is required'],
    trim: true,
    minlength: [2, 'Store name must be at least 2 characters'],
    maxlength: [100, 'Store name cannot exceed 100 characters']
  },
  address: {
    country: {
      type: String,
      required: [true, 'Country code is required'],
      uppercase: true,
      minlength: [2, 'Country code must be 2 characters'],
      maxlength: [2, 'Country code must be 2 characters'],
      index: true
    },
    countryName: {
      type: String,
      required: [true, 'Country name is required'],
      trim: true
    },
    formatted: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    street: {
      type: String,
      trim: true,
      default: null
    },
    city: {
      type: String,
      trim: true,
      index: true,
      default: null
    },
    state: {
      type: String,
      trim: true,
      default: null
    },
    postalCode: {
      type: String,
      trim: true,
      default: null
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: [true, 'Coordinates are required'],
      validate: {
        validator: function(v: number[]) {
          return v.length === 2 &&
                 v[0] >= -180 && v[0] <= 180 &&  // Longitude
                 v[1] >= -90 && v[1] <= 90;       // Latitude
        },
        message: 'Invalid coordinates'
      }
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: [
        'cafe',           // Coffee shops
        'restaurant',     // Restaurants
        'convenience',    // Convenience stores
        'retail',         // Retail stores
        'service',        // Service businesses
        'education',      // Educational institutions
        'entertainment',  // Entertainment venues
        'other'          // Other
      ],
      message: '{VALUE} is not a valid category'
    }
  },
  phone: {
    type: String,
    default: null,
    trim: true
  },
  currency: {
    type: String,
    required: [true, 'Currency code is required'],
    uppercase: true,
    enum: {
      values: ['GBP', 'USD', 'KRW', 'EUR', 'JPY', 'CNY', 'AUD', 'CAD'],
      message: '{VALUE} is not a supported currency'
    },
    default: 'GBP'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required'],
    index: true
  },
  averageRating: {
    salary: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    restTime: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    workEnv: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    management: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    overall: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  averageWage: {
    min: {
      type: Number,
      default: 0,
      min: 0
    },
    max: {
      type: Number,
      default: 0,
      min: 0
    },
    average: {
      type: Number,
      default: 0,
      min: 0
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
storeSchema.index({ location: '2dsphere' });  // Geospatial index
storeSchema.index({ name: 'text', 'address.formatted': 'text' });  // Text search
storeSchema.index({ googlePlaceId: 1 });
storeSchema.index({ category: 1 });
storeSchema.index({ 'address.country': 1, 'address.city': 1 });  // Country/city search
storeSchema.index({ 'address.country': 1, category: 1 });  // Country/category search
storeSchema.index({ 'averageRating.overall': -1 });
storeSchema.index({ 'averageWage.average': -1 });
storeSchema.index({ reviewCount: -1 });
storeSchema.index({ createdAt: -1 });
storeSchema.index({ createdBy: 1 });

// Virtual: reviews list
storeSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'store'
});

export const StoreModel = model<IStore>('Store', storeSchema);
```

**Sample Data:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "googlePlaceId": "ChIJN1t_tDeuEmsRUsoyG83frY4",
  "isFromGooglePlaces": true,
  "name": "Starbucks",
  "address": {
    "country": "GB",
    "countryName": "United Kingdom",
    "formatted": "25 Oxford St, London W1D 2DW, United Kingdom",
    "street": "25 Oxford St",
    "city": "London",
    "state": null,
    "postalCode": "W1D 2DW"
  },
  "location": {
    "type": "Point",
    "coordinates": [-0.1319, 51.5155]
  },
  "category": "cafe",
  "phone": "+44 20 1234 5678",
  "currency": "GBP",
  "createdBy": "507f1f77bcf86cd799439011",
  "averageRating": {
    "salary": 4.5,
    "restTime": 4.0,
    "workEnv": 4.2,
    "management": 4.3,
    "overall": 4.25
  },
  "averageWage": {
    "min": 10.50,
    "max": 13.00,
    "average": 11.75,
    "count": 8
  },
  "reviewCount": 12,
  "createdAt": "2024-12-05T00:00:00.000Z",
  "updatedAt": "2024-12-14T00:00:00.000Z"
}
```

**Category Descriptions:**
| Value | Description | Examples |
|-------|-------------|----------|
| `cafe` | Coffee shops | Starbucks, Costa, Pret A Manger |
| `restaurant` | Restaurants | McDonald's, Nando's, Pizza Express |
| `convenience` | Convenience stores | Tesco Express, Co-op, Sainsbury's Local |
| `retail` | Retail stores | H&M, Primark, Waterstones |
| `service` | Service businesses | Barber shops, dry cleaners, gyms |
| `education` | Educational | Tutoring centers, language schools |
| `entertainment` | Entertainment | Cinemas, bowling alleys, arcades |
| `other` | Other | Anything not fitting above categories |

---

### 3. Reviews Collection 🆕

Stores worker reviews for workplaces.

```typescript
interface IRatings {
  salary: number;      // Salary/pay rating (1-5)
  restTime: number;    // Break time rating (1-5)
  workEnv: number;     // Work environment rating (1-5)
  management: number;  // Management rating (1-5)
}

interface IWorkPeriod {
  start: Date;  // Employment start date
  end?: Date;   // Employment end date (null if currently employed)
}

interface IReview extends Document {
  store: Schema.Types.ObjectId;  // Store reference
  user: Schema.Types.ObjectId;   // User reference
  ratings: IRatings;
  averageRating: number;  // Average of 4 ratings (auto-calculated)
  content: string;        // Review text
  workPeriod: IWorkPeriod;
  position: string;       // Job position
  pros?: string;          // Pros
  cons?: string;          // Cons
  wageType?: 'custom' | 'minimum_wage' | 'average' | 'above_average';  // 🆕 Wage input type
  hourlyWage?: number;    // 🆕 Hourly wage in £ (when wageType is 'custom')
  reviewMode: 'quick' | 'detailed';  // 🆕 Review mode
  isAnonymous: boolean;   // 🆕 Anonymous review
  helpfulCount: number;   // 🆕 Helpful votes count
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>({
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: [true, 'Store is required'],
    index: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true
  },
  ratings: {
    salary: {
      type: Number,
      required: [true, 'Salary rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    restTime: {
      type: Number,
      required: [true, 'Break time rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    workEnv: {
      type: Number,
      required: [true, 'Work environment rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    management: {
      type: Number,
      required: [true, 'Management rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    }
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 1,
    max: 5
  },
  content: {
    type: String,
    required: [true, 'Review content is required'],
    trim: true,
    minlength: [10, 'Review must be at least 10 characters'],
    maxlength: [2000, 'Review cannot exceed 2000 characters']
  },
  workPeriod: {
    start: {
      type: Date,
      required: [true, 'Employment start date is required']
    },
    end: {
      type: Date,
      default: null,  // null = currently employed
      validate: {
        validator: function(v: Date) {
          return !v || v >= this.workPeriod.start;
        },
        message: 'End date must be after start date'
      }
    }
  },
  position: {
    type: String,
    required: [true, 'Job position is required'],
    trim: true,
    maxlength: [50, 'Position cannot exceed 50 characters']
  },
  pros: {
    type: String,
    default: null,
    trim: true,
    maxlength: [500, 'Pros cannot exceed 500 characters']
  },
  cons: {
    type: String,
    default: null,
    trim: true,
    maxlength: [500, 'Cons cannot exceed 500 characters']
  },
  wageType: {
    type: String,
    enum: {
      values: ['custom', 'minimum_wage', 'average', 'above_average'],
      message: '{VALUE} is not a valid wage type'
    },
    default: null
  },
  hourlyWage: {
    type: Number,
    default: null,
    min: [0, 'Hourly wage must be positive'],
    max: [100, 'Hourly wage cannot exceed £100']
  },
  reviewMode: {
    type: String,
    enum: ['quick', 'detailed'],
    default: 'detailed'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  helpfulCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      // Hide user info if anonymous
      if (ret.isAnonymous && ret.user) {
        ret.user = {
          _id: ret.user._id,
          name: 'Anonymous',
          avatar: null
        };
      }
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Indexes
reviewSchema.index({ store: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ averageRating: -1 });
reviewSchema.index({ wageType: 1 });
reviewSchema.index({ hourlyWage: -1 });
reviewSchema.index({ helpfulCount: -1 });
reviewSchema.index({ store: 1, user: 1 }, { unique: true });  // One review per user per store

// Pre-save: Calculate average rating
reviewSchema.pre('save', function(next) {
  const { salary, restTime, workEnv, management } = this.ratings;
  this.averageRating = (salary + restTime + workEnv + management) / 4;
  next();
});

// Static: Update store ratings and wages
reviewSchema.statics.updateStoreStats = async function(storeId: string) {
  const stats = await this.aggregate([
    { $match: { store: new mongoose.Types.ObjectId(storeId) } },
    {
      $group: {
        _id: null,
        avgSalary: { $avg: '$ratings.salary' },
        avgRestTime: { $avg: '$ratings.restTime' },
        avgWorkEnv: { $avg: '$ratings.workEnv' },
        avgManagement: { $avg: '$ratings.management' },
        avgOverall: { $avg: '$averageRating' },
        count: { $sum: 1 },
        // Wage statistics (only include if wage is provided)
        wages: {
          $push: {
            $cond: [
              { $ne: ['$hourlyWage', null] },
              '$hourlyWage',
              '$$REMOVE'
            ]
          }
        }
      }
    }
  ]);

  if (stats.length > 0) {
    const wageStats = stats[0].wages.length > 0 ? {
      min: Math.min(...stats[0].wages),
      max: Math.max(...stats[0].wages),
      average: stats[0].wages.reduce((a, b) => a + b, 0) / stats[0].wages.length,
      count: stats[0].wages.length
    } : {
      min: 0,
      max: 0,
      average: 0,
      count: 0
    };

    await mongoose.model('Store').findByIdAndUpdate(storeId, {
      'averageRating.salary': stats[0].avgSalary,
      'averageRating.restTime': stats[0].avgRestTime,
      'averageRating.workEnv': stats[0].avgWorkEnv,
      'averageRating.management': stats[0].avgManagement,
      'averageRating.overall': stats[0].avgOverall,
      'averageWage': wageStats,
      reviewCount: stats[0].count
    });
  } else {
    // No reviews - reset to defaults
    await mongoose.model('Store').findByIdAndUpdate(storeId, {
      'averageRating.salary': 0,
      'averageRating.restTime': 0,
      'averageRating.workEnv': 0,
      'averageRating.management': 0,
      'averageRating.overall': 0,
      'averageWage.min': 0,
      'averageWage.max': 0,
      'averageWage.average': 0,
      'averageWage.count': 0,
      reviewCount: 0
    });
  }
};

// Post-save: Update store statistics
reviewSchema.post('save', async function() {
  await (this.constructor as any).updateStoreStats(this.store);
});

// Post-remove: Update store statistics
reviewSchema.post('remove', async function() {
  await (this.constructor as any).updateStoreStats(this.store);
});

export const ReviewModel = model<IReview>('Review', reviewSchema);
```

**Sample Data (Detailed Review):**
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "store": "507f1f77bcf86cd799439012",
  "user": "507f1f77bcf86cd799439011",
  "ratings": {
    "salary": 5,
    "restTime": 4,
    "workEnv": 4,
    "management": 5
  },
  "averageRating": 4.5,
  "content": "Great place to work! The manager is very supportive and the pay is fair. Can get busy during rush hours but overall a positive experience.",
  "workPeriod": {
    "start": "2024-06-01T00:00:00.000Z",
    "end": "2024-11-30T00:00:00.000Z"
  },
  "position": "Barista",
  "pros": "Fair pay, supportive management, good team",
  "cons": "Busy during rush hours",
  "wageType": "custom",
  "hourlyWage": 12.00,
  "reviewMode": "detailed",
  "isAnonymous": false,
  "helpfulCount": 15,
  "createdAt": "2024-12-08T00:00:00.000Z",
  "updatedAt": "2024-12-08T00:00:00.000Z"
}
```

**Sample Data (Quick Review):**
```json
{
  "_id": "507f1f77bcf86cd799439016",
  "store": "507f1f77bcf86cd799439012",
  "user": "507f1f77bcf86cd799439013",
  "ratings": {
    "salary": 4,
    "restTime": 4,
    "workEnv": 4,
    "management": 4
  },
  "averageRating": 4.0,
  "content": "Good workplace, would recommend.",
  "workPeriod": {
    "start": "2024-08-01T00:00:00.000Z",
    "end": null
  },
  "position": "Server",
  "wageType": "above_average",
  "reviewMode": "quick",
  "isAnonymous": false,
  "helpfulCount": 3,
  "createdAt": "2024-12-10T00:00:00.000Z",
  "updatedAt": "2024-12-10T00:00:00.000Z"
}
```

---

## 📈 Index Strategy

### Single Field Indexes
```javascript
// User
{ email: 1 }           // Login, uniqueness (unique)
{ role: 1 }            // Role filtering
{ points: -1 }         // Points leaderboard
{ trustScore: -1 }     // Trust ranking
{ createdAt: -1 }      // Recent users

// Store
{ googlePlaceId: 1 }   // Duplicate prevention (unique)
{ category: 1 }        // Category filtering
{ reviewCount: -1 }    // Sort by review count
{ 'averageRating.overall': -1 }  // Rating sort
{ 'averageWage.average': -1 }    // Wage sort
{ createdBy: 1 }       // User's stores
{ createdAt: -1 }      // Recent stores

// Review
{ wageType: 1 }        // Wage type filtering
{ hourlyWage: -1 }     // Wage sorting
{ helpfulCount: -1 }   // Sort by helpful
{ averageRating: -1 }  // Rating sort
```

### Compound Indexes
```javascript
// Store
{ 'averageRating.overall': -1, reviewCount: -1 }  // Rating + count sort

// Review
{ store: 1, createdAt: -1 }      // Store's recent reviews
{ user: 1, createdAt: -1 }       // User's recent reviews
{ store: 1, user: 1 }            // Unique constraint (one review per user per store)
```

### Geospatial Index
```javascript
// Store
{ location: '2dsphere' }  // Map-based search
```

**Usage Example:**
```typescript
// Find stores within 5km radius
const stores = await StoreModel.find({
  location: {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [-0.1319, 51.5155]  // [lng, lat] - London Oxford Street
      },
      $maxDistance: 5000  // 5km in meters
    }
  }
});
```

### Text Search Index
```javascript
// Store
{ name: 'text', address: 'text' }
```

**Usage Example:**
```typescript
// Search by store name/address
const stores = await StoreModel.find({
  $text: { $search: 'Starbucks Oxford' }
});
```

---

## 🔗 Relationships (Populate)

### Usage Examples

```typescript
// 1. Store + creator info
const store = await StoreModel
  .findById(storeId)
  .populate('createdBy', 'name email avatar');

// 2. Store + reviews (with user info)
const store = await StoreModel
  .findById(storeId)
  .populate({
    path: 'reviews',
    select: 'ratings averageRating content workPeriod position wageType hourlyWage isAnonymous createdAt',
    populate: {
      path: 'user',
      select: 'name avatar trustScore'
    },
    options: {
      sort: { createdAt: -1 },
      limit: 10
    }
  });

// 3. Review + store + user
const review = await ReviewModel
  .findById(reviewId)
  .populate('store', 'name address category averageRating averageWage')
  .populate('user', 'name avatar trustScore');

// 4. User's reviews
const myReviews = await ReviewModel
  .find({ user: userId })
  .populate('store', 'name address category googlePlaceId averageRating')
  .sort({ createdAt: -1 });

// 5. Reviews with wage information for a store
const reviewsWithWage = await ReviewModel
  .find({
    store: storeId,
    wageType: { $exists: true }
  })
  .populate('user', 'name avatar')
  .sort({ createdAt: -1 });
```

---

## 🚀 Query Optimization Tips

### 1. Map-Based Store Search (Optimized)
```typescript
// Find stores near current location
const stores = await StoreModel
  .find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $maxDistance: 5000
      }
    }
  })
  .select('googlePlaceId name address location category averageRating averageWage reviewCount')
  .limit(50)
  .lean();
```

### 2. Store Detail + Paginated Reviews
```typescript
const page = 1;
const limit = 10;

// Store info
const store = await StoreModel
  .findById(storeId)
  .populate('createdBy', 'name')
  .lean();

// Reviews (paginated)
const reviews = await ReviewModel
  .find({ store: storeId })
  .populate('user', 'name avatar trustScore')
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();

const totalReviews = await ReviewModel.countDocuments({ store: storeId });
```

### 3. Regional Wage Statistics
```typescript
// Calculate average wage by category in London area
const londonCenter = [-0.1278, 51.5074];  // [lng, lat]

const wageStats = await StoreModel.aggregate([
  {
    $geoNear: {
      near: { type: 'Point', coordinates: londonCenter },
      distanceField: 'distance',
      maxDistance: 10000,  // 10km
      spherical: true
    }
  },
  {
    $group: {
      _id: '$category',
      avgWage: { $avg: '$averageWage.average' },
      storeCount: { $sum: 1 },
      totalReviews: { $sum: '$reviewCount' }
    }
  },
  { $sort: { avgWage: -1 } }
]);

// Result:
// [
//   { _id: 'cafe', avgWage: 11.75, storeCount: 45, totalReviews: 230 },
//   { _id: 'restaurant', avgWage: 10.50, storeCount: 32, totalReviews: 158 }
// ]
```

### 4. Rating Trends (Last 6 Months)
```typescript
// Get review count by month for trend chart
const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

const trends = await ReviewModel.aggregate([
  {
    $match: {
      store: new mongoose.Types.ObjectId(storeId),
      createdAt: { $gte: sixMonthsAgo }
    }
  },
  {
    $group: {
      _id: {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' }
      },
      avgRating: { $avg: '$averageRating' },
      count: { $sum: 1 }
    }
  },
  { $sort: { '_id.year': 1, '_id.month': 1 } }
]);
```

---

## 🛠️ Cursor Implementation Prompts

### Store Model
```
Based on docs/DATABASE_SCHEMA.md section "2. Stores Collection",
implement backend/src/models/Store.model.ts

Include:
- googlePlaceId field (unique)
- averageWage statistics
- All indexes
- Virtual fields
Follow the same pattern as User.model.ts
```

### Review Model
```
Based on docs/DATABASE_SCHEMA.md section "3. Reviews Collection",
implement backend/src/models/Review.model.ts

Include:
- hourlyWage, payslipUrl, isPayslipVerified fields
- reviewMode and isAnonymous fields
- Average rating auto-calculation
- Store statistics update logic (ratings + wages)
- Pre-save and post-save hooks
```

---

## 📊 Database Migration

### Initial Seed Script
```typescript
// scripts/seed-stores.ts
import { StoreModel, ReviewModel, UserModel } from '../models';

async function seedDatabase() {
  // 1. Create test user
  const user = await UserModel.create({
    email: 'test@example.com',
    password: 'Test1234!',
    name: 'Test User',
    role: 'employee'
  });

  // 2. Create store
  const store = await StoreModel.create({
    googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    name: 'Starbucks',
    address: '25 Oxford St, London W1D 2DW, UK',
    location: {
      type: 'Point',
      coordinates: [-0.1319, 51.5155]
    },
    category: 'cafe',
    phone: '+44 20 1234 5678',
    createdBy: user._id
  });

  // 3. Create review
  await ReviewModel.create({
    store: store._id,
    user: user._id,
    ratings: {
      salary: 5,
      restTime: 4,
      workEnv: 4,
      management: 5
    },
    content: 'Great place to work!',
    workPeriod: {
      start: new Date('2024-06-01'),
      end: new Date('2024-11-30')
    },
    position: 'Barista',
    wageType: 'custom',
    hourlyWage: 12.00,
    reviewMode: 'detailed'
  });

  console.log('✅ Database seeded successfully');
}

seedDatabase();
```

---

**Document Management**
- **Created**: 2024-12-10
- **Updated**: 2024-12-14
- **Author**: Development Team
- **Version**: 2.0.0 (Major update - Google Maps + Salary features)
