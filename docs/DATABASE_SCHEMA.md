# 🗄️ WorkReview - Database Schema Design

> **Project**: WorkReview - Part-time Work Review Platform
> **Target Market**: Multi-country (UK 🇬🇧, US 🇺🇸, Korea 🇰🇷, etc.)
> **Database**: MongoDB 7.x
> **ODM**: Mongoose
> **Created**: 2024-12-10
> **Updated**: 2024-12-27
> **Version**: 3.0.0

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
│ points             │         │
│ trustScore         │         │
└─────────────────────┘         │
        │                       │
        │ user (1:N)           │
        ├──────────────┐        │
        │              │        │
        ▼              ▼        │
┌─────────────┐  ┌─────────────────────┐
│   Review    │  │      Question       │
│─────────────│  │─────────────────────│
│ _id (PK)   │  │ _id (PK)           │
│ store (FK) │  │ store (FK)         │
│ user (FK)  │  │ user (FK)          │
│ rating     │  │ title              │
│ wageType   │  │ content            │
│ ...        │  │ answerCount        │
└─────────────┘  └─────────────────────┘
        │                  │
        │ review (1:N)     │ question (1:N)
        ▼                  ▼
┌─────────────┐    ┌─────────────┐
│   Comment   │    │   Answer    │
│─────────────│    │─────────────│
│ _id (PK)   │    │ _id (PK)   │
│ review(FK) │    │ question(FK)│
│ author(FK) │    │ user (FK)  │
│ parent(FK) │    │ content    │
│ content    │    │ likeCount  │
└─────────────┘    │isBestAnswer│
                   └─────────────┘
┌─────────────────────┐
│       Store         │─────────┐
│─────────────────────│         │
│ _id (PK)           │         │
│ googlePlaceId      │         │
│ name               │         │
│ address            │         │
│ location           │         │
│ category           │         │
│ averageRating      │         │ store (1:N)
│ averageWage        │         │
│ wageStats          │         │
│ reviewCount        │         │
│ questionCount      │◄────────┘
└─────────────────────┘
```

---

## 📋 Collection Details

### 1. Users Collection ✅

Stores user account information.

```typescript
interface IUser extends Document {
  email: string;
  password: string;  // bcrypt hashed
  name: string;
  role: 'admin' | 'manager' | 'employee';
  avatar?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  points: number;  // Reward points
  trustScore: number;  // Trust score (0-100)
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
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ role: 1 });
userSchema.index({ points: -1 });
userSchema.index({ trustScore: -1 });
```

---

### 2. Stores Collection ✅

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
  min: number;      // Minimum hourly wage
  max: number;      // Maximum hourly wage
  average: number;  // Average hourly wage
  count: number;    // Number of wage data points
}

interface IWageStats {
  belowMinimum: number;  // Count of below minimum wage reviews
  minimumWage: number;   // Count of minimum wage reviews
  aboveMinimum: number;  // Count of above minimum wage reviews
  total: number;         // Total wage info reviews
}

interface IStore extends Document {
  googlePlaceId?: string;  // Google Place ID (unique identifier)
  isFromGooglePlaces: boolean;  // Whether store data is from Google Places (read-only if true)
  name: string;
  address: IAddress;  // Structured address
  location: ILocation;
  category: 'cafe' | 'restaurant' | 'convenience' | 'retail' | 'service' | 'education' | 'entertainment' | 'other';
  phone?: string;
  currency: string;  // ISO 4217 currency code (GBP, USD, KRW, etc.)
  createdBy: Schema.Types.ObjectId;  // User reference
  averageRating: number;  // Average rating (1-5)
  averageWage: IAverageWage;  // Hourly wage statistics
  wageStats: IWageStats;  // Wage type statistics
  reviewCount: number;
  questionCount: number;  // Q&A question count
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
      values: ['cafe', 'restaurant', 'convenience', 'retail', 'service', 'education', 'entertainment', 'other'],
      message: '{VALUE} is not a valid category'
    },
    index: true
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
    type: Number,
    default: 0,
    min: 0,
    max: 5,
    index: true
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
  wageStats: {
    belowMinimum: {
      type: Number,
      default: 0,
      min: 0
    },
    minimumWage: {
      type: Number,
      default: 0,
      min: 0
    },
    aboveMinimum: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  questionCount: {
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
storeSchema.index({ 'address.country': 1, 'address.city': 1 });  // Country/city search
storeSchema.index({ 'address.country': 1, category: 1 });  // Country/category search
storeSchema.index({ averageRating: -1 });  // Rating sort
storeSchema.index({ reviewCount: -1 });  // Review count sort
storeSchema.index({ createdAt: -1 });

// Virtual: reviews list
storeSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'store'
});
```

---

### 3. Reviews Collection ✅

Stores worker reviews for workplaces.

```typescript
interface IReview extends Document {
  user: Schema.Types.ObjectId;  // Review author
  store: Schema.Types.ObjectId;  // Review target workplace
  reviewMode: 'quick' | 'detailed';  // Quick vs detailed review
  rating: number;  // Rating (1-5)
  wageType?: 'below_minimum' | 'minimum_wage' | 'above_minimum';  // Wage level
  hourlyWage?: number;  // Hourly wage (deprecated)
  content?: string;  // Review content (optional, 0-2000 chars)
  position?: string;  // Job position (optional)
  isAnonymous: boolean;  // Anonymous flag
  helpfulCount: number;  // Helpful votes count
  likeCount: number;  // Like count
  dislikeCount: number;  // Dislike count
  likedBy: Schema.Types.ObjectId[];  // Users who liked
  dislikedBy: Schema.Types.ObjectId[];  // Users who disliked
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Review author is required'],
    index: true
  },
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: [true, 'Review target workplace is required'],
    index: true
  },
  reviewMode: {
    type: String,
    enum: {
      values: ['quick', 'detailed'],
      message: '{VALUE} is not a valid review mode'
    },
    default: 'quick',
    index: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    index: true
  },
  wageType: {
    type: String,
    enum: {
      values: ['below_minimum', 'minimum_wage', 'above_minimum'],
      message: '{VALUE} is not a valid wage level'
    },
    index: true
  },
  hourlyWage: {
    type: Number,
    min: [0, 'Hourly wage must be positive'],
    index: true
  },
  content: {
    type: String,
    trim: true,
    maxlength: [2000, 'Review content cannot exceed 2000 characters']
  },
  position: {
    type: String,
    trim: true,
    maxlength: [100, 'Position cannot exceed 100 characters'],
    index: true
  },
  isAnonymous: {
    type: Boolean,
    default: false,
    index: true
  },
  helpfulCount: {
    type: Number,
    default: 0,
    min: 0,
    index: true
  },
  likeCount: {
    type: Number,
    default: 0,
    min: 0,
    index: true
  },
  dislikeCount: {
    type: Number,
    default: 0,
    min: 0,
    index: true
  },
  likedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
reviewSchema.index({ user: 1, store: 1 });  // User's store reviews
reviewSchema.index({ store: 1, createdAt: -1 });  // Store's latest reviews
reviewSchema.index({ store: 1, rating: -1 });  // Store's rating sort
reviewSchema.index({ store: 1, likeCount: -1 });  // Store's most helpful
reviewSchema.index({ createdAt: -1 });  // Latest reviews
reviewSchema.index({ helpfulCount: -1 });  // Most helpful
reviewSchema.index({ position: 1, store: 1 });  // Position reviews

// Virtual: comments list
reviewSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'review'
});

// Virtual: comment count
reviewSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'review',
  count: true
});
```

---

### 4. Questions Collection ✅

Stores Q&A questions about workplaces.

```typescript
interface IQuestion extends Document {
  store: Schema.Types.ObjectId;  // Workplace reference
  user: Schema.Types.ObjectId;   // Question author
  title: string;  // Question title
  content: string;  // Question content
  answerCount: number;  // Number of answers
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>({
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
  title: {
    type: String,
    required: [true, 'Question title is required'],
    trim: true,
    maxlength: [200, 'Question title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Question content is required'],
    trim: true,
    maxlength: [2000, 'Question content cannot exceed 2000 characters']
  },
  answerCount: {
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
questionSchema.index({ store: 1, createdAt: -1 });  // Store's latest questions
questionSchema.index({ store: 1, answerCount: -1 });  // Store's most answered

// Virtual: answers list
questionSchema.virtual('answers', {
  ref: 'Answer',
  localField: '_id',
  foreignField: 'question'
});
```

---

### 5. Answers Collection ✅

Stores answers to Q&A questions.

```typescript
interface IAnswer extends Document {
  question: Schema.Types.ObjectId;  // Question reference
  user: Schema.Types.ObjectId;      // Answer author
  content: string;  // Answer content
  likeCount: number;  // Like count
  isBestAnswer: boolean;  // Best answer flag
  createdAt: Date;
  updatedAt: Date;
}

const answerSchema = new Schema<IAnswer>({
  question: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: [true, 'Question is required'],
    index: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true
  },
  content: {
    type: String,
    required: [true, 'Answer content is required'],
    trim: true,
    maxlength: [2000, 'Answer content cannot exceed 2000 characters']
  },
  likeCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isBestAnswer: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
answerSchema.index({ question: 1, createdAt: -1 });  // Question's latest answers
answerSchema.index({ question: 1, likeCount: -1 });  // Question's most liked
answerSchema.index({ question: 1, isBestAnswer: -1 });  // Best answer first
```

---

### 6. Comments Collection ✅

Stores comments on reviews (with nested reply support).

```typescript
interface IComment extends Document {
  content: string;  // Comment content
  review: Schema.Types.ObjectId;  // Review reference
  author: Schema.Types.ObjectId;  // Comment author
  parent: Schema.Types.ObjectId | null;  // Parent comment (null = top-level)
  isEdited: boolean;  // Edited flag
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>({
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    minlength: [1, 'Comment must be at least 1 character'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  review: {
    type: Schema.Types.ObjectId,
    ref: 'Review',
    required: [true, 'Review is required'],
    index: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required'],
    index: true
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,  // null = top-level comment
    index: true
  },
  isEdited: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
commentSchema.index({ review: 1, createdAt: -1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parent: 1 });

// Pre-save hook: Set isEdited flag
commentSchema.pre('save', function() {
  if (this.isModified('content') && !this.isNew) {
    this.isEdited = true;
  }
});

// Virtual: reply count
commentSchema.virtual('replyCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parent',
  count: true
});
```

---

## 📈 Index Strategy Summary

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
{ averageRating: -1 }  // Rating sort
{ reviewCount: -1 }    // Review count sort
{ createdBy: 1 }       // User's stores
{ createdAt: -1 }      // Recent stores

// Review
{ rating: -1 }         // Rating sort
{ likeCount: -1 }      // Like count sort
{ helpfulCount: -1 }   // Helpful sort
{ position: 1 }        // Position filtering
{ wageType: 1 }        // Wage type filtering

// Question
{ answerCount: -1 }    // Answer count sort

// Answer
{ likeCount: -1 }      // Like count sort
{ isBestAnswer: -1 }   // Best answer first
```

### Compound Indexes
```javascript
// Store
{ 'address.country': 1, 'address.city': 1 }  // Country/city search
{ 'address.country': 1, category: 1 }        // Country/category search

// Review
{ user: 1, store: 1 }          // User's store reviews
{ store: 1, createdAt: -1 }    // Store's latest reviews
{ store: 1, rating: -1 }       // Store's rating sort
{ store: 1, likeCount: -1 }    // Store's most helpful
{ position: 1, store: 1 }      // Position reviews

// Question
{ store: 1, createdAt: -1 }    // Store's latest questions
{ store: 1, answerCount: -1 }  // Store's most answered

// Answer
{ question: 1, createdAt: -1 }     // Question's latest answers
{ question: 1, likeCount: -1 }     // Question's most liked
{ question: 1, isBestAnswer: -1 }  // Best answer first

// Comment
{ review: 1, createdAt: -1 }   // Review's latest comments
{ parent: 1 }                  // Nested replies
```

### Geospatial Index
```javascript
// Store
{ location: '2dsphere' }  // Map-based search
```

### Text Search Index
```javascript
// Store
{ name: 'text', 'address.formatted': 'text' }
```

---

## 🔗 Relationships Summary

```
User (1:N) ─┬─> Store (createdBy)
            ├─> Review (user)
            ├─> Question (user)
            ├─> Answer (user)
            └─> Comment (author)

Store (1:N) ─┬─> Review (store)
             └─> Question (store)

Review (1:N) ──> Comment (review)

Question (1:N) ──> Answer (question)

Comment (1:N) ──> Comment (parent) [nested replies]
```

---

**Document Management**
- **Created**: 2024-12-10
- **Updated**: 2024-12-27
- **Author**: Development Team
- **Version**: 3.0.0 (Added Question, Answer, Comment collections; Updated Review and Store models)
