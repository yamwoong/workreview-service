# 📡 WorkReview API Specification

> **Project**: WorkReview - Workplace Review Platform
> **Base URL**: `http://localhost:5000/api`
> **Version**: v2.0.0
> **Protocol**: REST
> **Last Updated**: 2024-12-14

---

## 🔑 Authentication

Most endpoints require JWT token authentication.

### Header Format
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiration
- **Access Token**: 15 minutes
- **Refresh Token**: 7 days

---

## 📚 Table of Contents

1. [Authentication API](#1-authentication-api) ✅
2. [Google Places API](#2-google-places-api) 🆕
3. [Workplace API](#3-workplace-api) ✅
4. [Review API](#4-review-api) ✅
5. [Q&A API](#5-qa-api) ✅
6. [Insights API](#6-insights-api) 🆕
7. [User API](#7-user-api) 🆕
8. [Error Codes](#error-codes)
9. [Frontend Integration](#frontend-integration)

---

## 1. Authentication API

### 1.1 Register

```http
POST /api/auth/register
```

**Request Body**
```json
{
  "email": "john.doe@example.com",
  "password": "Test1234!",
  "name": "John Doe",
  "role": "employee"
}
```

**Validation**
- `email`: Valid email format, required
- `password`: Minimum 8 characters, uppercase+lowercase+numbers, required
- `name`: 2-50 characters, required
- `role`: "admin" | "manager" | "employee" (default: employee)

**Response** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "john.doe@example.com",
      "name": "John Doe",
      "role": "employee",
      "points": 0,
      "trustScore": 50
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors**
- `400`: Email already exists or invalid input
- `500`: Server error

---

### 1.2 Login

```http
POST /api/auth/login
```

**Request Body**
```json
{
  "email": "john.doe@example.com",
  "password": "Test1234!"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "john.doe@example.com",
      "name": "John Doe",
      "role": "employee",
      "points": 120,
      "trustScore": 75
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors**
- `401`: Invalid email or password
- `500`: Server error

---

### 1.3 Logout

```http
POST /api/auth/logout
```

**Headers**
```http
Authorization: Bearer {accessToken}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

---

### 1.4 Get Current User

```http
GET /api/auth/me
```

**Headers**
```http
Authorization: Bearer {accessToken}
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "role": "employee",
    "avatar": null,
    "points": 120,
    "trustScore": 75,
    "reviewCount": 5,
    "createdAt": "2024-11-01T00:00:00.000Z"
  }
}
```

---

### 1.5 Request Password Reset

```http
POST /api/auth/forgot-password
```

**Request Body**
```json
{
  "email": "john.doe@example.com"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### 1.6 Reset Password

```http
POST /api/auth/reset-password/:token
```

**Request Body**
```json
{
  "password": "NewPass1234!"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

**Errors**
- `400`: Token is invalid or expired
- `500`: Server error

---

### 1.7 Update Profile

```http
PATCH /api/auth/profile
```

**Headers**
```http
Authorization: Bearer {accessToken}
```

**Request Body**
```json
{
  "name": "Jane Smith"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "john.doe@example.com",
    "name": "Jane Smith",
    "role": "employee"
  }
}
```

---

### 1.8 Change Password

```http
PATCH /api/auth/change-password
```

**Headers**
```http
Authorization: Bearer {accessToken}
```

**Request Body**
```json
{
  "currentPassword": "Test1234!",
  "newPassword": "NewPass1234!"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Errors**
- `401`: Current password is incorrect
- `400`: New password validation failed

---

## 2. Google Places API

### 2.1 Search Places (Autocomplete)

Proxy endpoint to Google Places Autocomplete API. Returns workplace suggestions based on user input.

```http
GET /api/places/search
```

**Query Parameters**
- `q`: Search query (required, min 2 characters)
- `lat`: User's latitude (optional, for location bias)
- `lng`: User's longitude (optional, for location bias)
- `types`: Place types filter (default: 'establishment')

**Example Request**
```http
GET /api/places/search?q=Starbucks%20Oxford&lat=51.752&lng=-1.258
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "predictions": [
      {
        "placeId": "ChIJ_WXS9XQHZ0gRBKRvCi6GHYI",
        "description": "Starbucks, High Street, Oxford, UK",
        "mainText": "Starbucks",
        "secondaryText": "High Street, Oxford, UK",
        "types": ["cafe", "food", "establishment"]
      },
      {
        "placeId": "ChIJ_WXS9XQHZ0gRBKRvCi6GHYJ",
        "description": "Starbucks Coffee, Cornmarket Street, Oxford, UK",
        "mainText": "Starbucks Coffee",
        "secondaryText": "Cornmarket Street, Oxford, UK",
        "types": ["cafe", "food", "establishment"]
      }
    ]
  }
}
```

**Errors**
- `400`: Invalid query or parameters
- `500`: Google Places API error

---

### 2.2 Get Place Details

Fetch detailed information about a specific place from Google Places API.

```http
GET /api/places/details/:placeId
```

**Path Parameters**
- `placeId`: Google Place ID (required)

**Example Request**
```http
GET /api/places/details/ChIJ_WXS9XQHZ0gRBKRvCi6GHYI
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "placeId": "ChIJ_WXS9XQHZ0gRBKRvCi6GHYI",
    "name": "Starbucks",
    "formattedAddress": "91-92 High St, Oxford OX1 4BJ, UK",
    "location": {
      "lat": 51.7520,
      "lng": -1.2577
    },
    "phoneNumber": "+44 1865 791479",
    "types": ["cafe", "food", "establishment"],
    "businessStatus": "OPERATIONAL",
    "openingHours": {
      "openNow": true,
      "weekdayText": [
        "Monday: 7:00 AM – 8:00 PM",
        "Tuesday: 7:00 AM – 8:00 PM",
        "Wednesday: 7:00 AM – 8:00 PM",
        "Thursday: 7:00 AM – 8:00 PM",
        "Friday: 7:00 AM – 8:00 PM",
        "Saturday: 7:30 AM – 8:00 PM",
        "Sunday: 8:00 AM – 7:00 PM"
      ]
    }
  }
}
```

**Errors**
- `400`: Invalid place ID
- `404`: Place not found
- `500`: Google Places API error

---

### 2.3 Check if Workplace Exists

Check if a workplace already exists in our database by Google Place ID.

```http
GET /api/places/check/:placeId
```

**Path Parameters**
- `placeId`: Google Place ID (required)

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "exists": true,
    "workplace": {
      "_id": "507f1f77bcf86cd799439012",
      "googlePlaceId": "ChIJ_WXS9XQHZ0gRBKRvCi6GHYI",
      "name": "Starbucks",
      "address": "91-92 High St, Oxford OX1 4BJ, UK",
      "reviewCount": 12,
      "averageRating": {
        "overall": 4.2
      },
      "averageWage": {
        "min": 10.50,
        "max": 13.25,
        "average": 11.85,
        "count": 8
      }
    }
  }
}
```

**If workplace doesn't exist**
```json
{
  "success": true,
  "data": {
    "exists": false,
    "workplace": null
  }
}
```

---

## 3. Workplace API

### 3.1 Get Workplaces

Get list of workplaces with optional geospatial and country/city filtering.

```http
GET /api/stores
```

**Query Parameters**
- `lat`: Latitude (optional, required for nearby search)
- `lng`: Longitude (optional, required for nearby search)
- `radius`: Radius in meters (default: 5000, max: 50000)
- `country`: Country code filter (ISO 3166-1 alpha-2, e.g., GB, US, KR) (optional)
- `city`: City filter (case-insensitive) (optional)
- `category`: Category filter (cafe | restaurant | convenience | retail | service | education | entertainment | other)
- `search`: Search by name/address (optional)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 50)
- `sort`: Sort by (rating | reviewCount | createdAt)

**Example Requests**
```http
# Nearby search
GET /api/stores?lat=51.5074&lng=-0.1278&radius=5000&category=cafe&page=1&limit=20

# Country/city search
GET /api/stores?country=GB&city=London&category=cafe

# Combined search
GET /api/stores?lat=51.5074&lng=-0.1278&country=GB&city=London
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "stores": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "googlePlaceId": "ChIJ_WXS9XQHZ0gRBKRvCi6GHYI",
        "name": "Starbucks",
        "address": {
          "country": "GB",
          "countryName": "United Kingdom",
          "formatted": "91-92 High St, Oxford OX1 4BJ, UK",
          "street": "91-92 High St",
          "city": "Oxford",
          "state": null,
          "postalCode": "OX1 4BJ"
        },
        "location": {
          "type": "Point",
          "coordinates": [-1.2577, 51.7520]
        },
        "category": "cafe",
        "phone": "+44 1865 791479",
        "currency": "GBP",
        "averageRating": {
          "salary": 4.2,
          "restTime": 3.8,
          "workEnv": 4.0,
          "management": 4.1,
          "overall": 4.03
        },
        "averageWage": {
          "min": 10.50,
          "max": 13.25,
          "average": 11.85,
          "count": 8
        },
        "reviewCount": 12,
        "distance": 1250,
        "createdAt": "2024-11-05T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

---

### 3.2 Get Workplace Details

```http
GET /api/stores/:id
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "googlePlaceId": "ChIJ_WXS9XQHZ0gRBKRvCi6GHYI",
    "name": "Starbucks",
    "address": {
      "country": "GB",
      "countryName": "United Kingdom",
      "formatted": "91-92 High St, Oxford OX1 4BJ, UK",
      "street": "91-92 High St",
      "city": "Oxford",
      "state": null,
      "postalCode": "OX1 4BJ"
    },
    "location": {
      "type": "Point",
      "coordinates": [-1.2577, 51.7520]
    },
    "category": "cafe",
    "phone": "+44 1865 791479",
    "currency": "GBP",
    "createdBy": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe"
    },
    "averageRating": {
      "salary": 4.2,
      "restTime": 3.8,
      "workEnv": 4.0,
      "management": 4.1,
      "overall": 4.03
    },
    "averageWage": {
      "min": 10.50,
      "max": 13.25,
      "average": 11.85,
      "count": 8
    },
    "reviewCount": 12,
    "createdAt": "2024-11-05T00:00:00.000Z",
    "updatedAt": "2024-12-10T00:00:00.000Z"
  }
}
```

**Errors**
- `404`: Workplace not found

---

### 3.3 Create Workplace

Create a new workplace from Google Places data. Called automatically when writing a review for a non-existent workplace.

```http
POST /api/stores
```

**Headers**
```http
Authorization: Bearer {accessToken}
```

**Request Body**
```json
{
  "googlePlaceId": "ChIJ_WXS9XQHZ0gRBKRvCi6GHYI",
  "name": "Starbucks",
  "address": {
    "country": "GB",
    "countryName": "United Kingdom",
    "formatted": "91-92 High St, Oxford OX1 4BJ, UK",
    "street": "91-92 High St",
    "city": "Oxford",
    "postalCode": "OX1 4BJ"
  },
  "location": {
    "type": "Point",
    "coordinates": [-1.2577, 51.7520]
  },
  "category": "cafe",
  "phone": "+44 1865 791479"
}
```

**Validation**
- `googlePlaceId`: Valid Google Place ID, optional (unique if provided)
- `name`: 2-100 characters, required
- `address.country`: ISO 3166-1 alpha-2 country code (2 chars), required
- `address.countryName`: Country name, required
- `address.formatted`: Full address string, required
- `address.street`: Street address, optional
- `address.city`: City name, optional
- `address.state`: State/province, optional
- `address.postalCode`: Postal code, optional
- `location.coordinates`: [longitude, latitude], required
- `category`: enum (cafe | restaurant | convenience | retail | service | education | entertainment | other), required
- `currency`: ISO 4217 currency code (default: GBP), optional
- `phone`: Optional

**Response** `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "googlePlaceId": "ChIJ_WXS9XQHZ0gRBKRvCi6GHYI",
    "isFromGooglePlaces": false,
    "name": "Starbucks",
    "address": {
      "country": "GB",
      "countryName": "United Kingdom",
      "formatted": "91-92 High St, Oxford OX1 4BJ, UK",
      "street": "91-92 High St",
      "city": "Oxford",
      "state": null,
      "postalCode": "OX1 4BJ"
    },
    "location": {
      "type": "Point",
      "coordinates": [-1.2577, 51.7520]
    },
    "category": "cafe",
    "phone": "+44 1865 791479",
    "currency": "GBP",
    "createdBy": "507f1f77bcf86cd799439011",
    "averageRating": {
      "salary": 0,
      "restTime": 0,
      "workEnv": 0,
      "management": 0,
      "overall": 0
    },
    "averageWage": {
      "min": 0,
      "max": 0,
      "average": 0,
      "count": 0
    },
    "reviewCount": 0,
    "createdAt": "2024-12-10T00:00:00.000Z"
  }
}
```

**Errors**
- `401`: Authentication required
- `400`: Invalid input or duplicate Google Place ID
- `409`: Workplace with this Google Place ID already exists

---

### 3.4 Get or Create Workplace from Google Place ID

Get existing workplace or create new one from Google Places API data.

```http
POST /api/stores/from-place
```

**Headers**
```http
Authorization: Bearer {accessToken}
```

**Request Body**
```json
{
  "placeId": "ChIJ_WXS9XQHZ0gRBKRvCi6GHYI"
}
```

**Validation**
- `placeId`: Google Place ID, required

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "googlePlaceId": "ChIJ_WXS9XQHZ0gRBKRvCi6GHYI",
    "isFromGooglePlaces": true,
    "name": "Starbucks",
    "address": {
      "country": "GB",
      "countryName": "United Kingdom",
      "formatted": "91-92 High St, Oxford OX1 4BJ, UK",
      "street": "91-92 High St",
      "city": "Oxford",
      "state": null,
      "postalCode": "OX1 4BJ"
    },
    "location": {
      "type": "Point",
      "coordinates": [-1.2577, 51.7520]
    },
    "category": "cafe",
    "phone": "+44 1865 791479",
    "currency": "GBP",
    "createdBy": "507f1f77bcf86cd799439011",
    "averageRating": {
      "salary": 0,
      "restTime": 0,
      "workEnv": 0,
      "management": 0,
      "overall": 0
    },
    "averageWage": {
      "min": 0,
      "max": 0,
      "average": 0,
      "count": 0
    },
    "reviewCount": 0,
    "createdAt": "2024-12-10T00:00:00.000Z"
  },
  "message": "가게 정보를 가져왔습니다"
}
```

**Flow**:
1. Check if workplace with this Google Place ID exists in database
2. If exists: Return existing workplace
3. If not exists:
   - Fetch workplace data from Google Places API
   - Auto-populate: name, address (structured), location, phone, category, currency
   - Set `isFromGooglePlaces: true`
   - Create and return new workplace

**Errors**
- `401`: Authentication required
- `400`: Invalid Place ID or Google Places API error

**Notes**:
- Automatically determines currency based on country code
- Automatically maps Google Place types to our category system
- Stores created this way are read-only (cannot be edited)

---

### 3.5 Update Workplace

```http
PATCH /api/stores/:id
```

**Headers**
```http
Authorization: Bearer {accessToken}
```

**Request Body** (partial update allowed)
```json
{
  "name": "Starbucks Coffee",
  "phone": "+44 1865 791480"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "googlePlaceId": "ChIJ_WXS9XQHZ0gRBKRvCi6GHYI",
    "isFromGooglePlaces": false,
    "name": "Starbucks Coffee",
    "address": {
      "country": "GB",
      "countryName": "United Kingdom",
      "formatted": "91-92 High St, Oxford OX1 4BJ, UK",
      "street": "91-92 High St",
      "city": "Oxford",
      "state": null,
      "postalCode": "OX1 4BJ"
    },
    "location": {
      "type": "Point",
      "coordinates": [-1.2577, 51.7520]
    },
    "category": "cafe",
    "phone": "+44 1865 791480",
    "currency": "GBP",
    "averageRating": {
      "overall": 4.03
    },
    "updatedAt": "2024-12-10T01:00:00.000Z"
  }
}
```

**Errors**
- `401`: Authentication required
- `403`: Forbidden (only creator or admin can update, Google Places stores cannot be edited)
- `404`: Workplace not found

**Notes**:
- Workplaces with `isFromGooglePlaces: true` cannot be edited
- Only the creator or admin can update a workplace

---

### 3.6 Delete Workplace

```http
DELETE /api/stores/:id
```

**Headers**
```http
Authorization: Bearer {accessToken}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Workplace deleted successfully"
}
```

**Errors**
- `401`: Authentication required
- `403`: Forbidden (admin only)
- `404`: Workplace not found

---

## 4. Review API

### 4.1 Get Workplace Reviews

```http
GET /api/stores/:storeId/reviews
```

**Query Parameters**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 50)
- `sort`: Sort by (latest | rating | helpful)
- `reviewMode`: Filter by review mode (quick | detailed)
- `wageType`: Filter by wage type (custom | minimum_wage | average | above_average)

**Example Request**
```http
GET /api/stores/507f1f77bcf86cd799439012/reviews?page=1&limit=10&sort=latest&wageType=custom
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "_id": "507f1f77bcf86cd799439015",
        "user": {
          "_id": "507f1f77bcf86cd799439011",
          "name": "John Doe",
          "avatar": null,
          "trustScore": 75
        },
        "reviewMode": "detailed",
        "ratings": {
          "salary": 5,
          "restTime": 4,
          "workEnv": 4,
          "management": 5
        },
        "averageRating": 4.5,
        "wageType": "custom",
        "hourlyWage": 12.50,
        "content": "Great place to work! Pay is always on time and management is very supportive. Can get busy during peak hours but overall a positive experience.",
        "workPeriod": {
          "start": "2024-06-01T00:00:00.000Z",
          "end": "2024-11-30T00:00:00.000Z"
        },
        "position": "Barista",
        "pros": "Accurate pay, friendly management, flexible shifts",
        "cons": "Very busy during peak times",
        "helpfulCount": 15,
        "isAnonymous": false,
        "createdAt": "2024-12-08T00:00:00.000Z"
      },
      {
        "_id": "507f1f77bcf86cd799439016",
        "user": {
          "_id": "507f1f77bcf86cd799439013",
          "name": "Anonymous",
          "avatar": null,
          "trustScore": 60
        },
        "reviewMode": "quick",
        "ratings": {
          "salary": 4,
          "restTime": 3,
          "workEnv": 4,
          "management": 4
        },
        "averageRating": 3.75,
        "wageType": "above_average",
        "content": "Overall decent experience. Standard cafe work.",
        "workPeriod": null,
        "position": "Team Member",
        "helpfulCount": 3,
        "isAnonymous": true,
        "createdAt": "2024-12-09T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 12,
      "pages": 2
    },
    "stats": {
      "totalReviews": 12,
      "averageWage": 11.85,
      "averageRating": 4.03
    }
  }
}
```

---

### 4.2 Get My Reviews

```http
GET /api/reviews/my
```

**Headers**
```http
Authorization: Bearer {accessToken}
```

**Query Parameters**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "_id": "507f1f77bcf86cd799439015",
        "store": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Starbucks",
          "address": "91-92 High St, Oxford OX1 4BJ, UK",
          "category": "cafe",
          "averageRating": {
            "overall": 4.03
          }
        },
        "reviewMode": "detailed",
        "ratings": {
          "salary": 5,
          "restTime": 4,
          "workEnv": 4,
          "management": 5
        },
        "averageRating": 4.5,
        "wageType": "custom",
        "hourlyWage": 12.50,
        "content": "Great place to work!...",
        "position": "Barista",
        "helpfulCount": 15,
        "createdAt": "2024-12-08T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "pages": 1
    }
  }
}
```

---

### 4.3 Get Review Details

```http
GET /api/reviews/:id
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "store": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Starbucks",
      "address": "91-92 High St, Oxford OX1 4BJ, UK",
      "category": "cafe"
    },
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "avatar": null,
      "trustScore": 75
    },
    "reviewMode": "detailed",
    "ratings": {
      "salary": 5,
      "restTime": 4,
      "workEnv": 4,
      "management": 5
    },
    "averageRating": 4.5,
    "wageType": "custom",
    "hourlyWage": 12.50,
    "content": "Great place to work! Pay is always on time and management is very supportive. Can get busy during peak hours but overall a positive experience.",
    "workPeriod": {
      "start": "2024-06-01T00:00:00.000Z",
      "end": "2024-11-30T00:00:00.000Z"
    },
    "position": "Barista",
    "pros": "Accurate pay, friendly management, flexible shifts",
    "cons": "Very busy during peak times",
    "helpfulCount": 15,
    "isAnonymous": false,
    "createdAt": "2024-12-08T00:00:00.000Z",
    "updatedAt": "2024-12-08T00:00:00.000Z"
  }
}
```

**Errors**
- `404`: Review not found

---

### 4.4 Create Review (Detailed Mode)

Write a detailed review for a workplace. If the workplace doesn't exist in our database, it will be auto-created from Google Places data.

```http
POST /api/reviews
```

**Headers**
```http
Authorization: Bearer {accessToken}
```

**Request Body**
```json
{
  "googlePlaceId": "ChIJ_WXS9XQHZ0gRBKRvCi6GHYI",
  "storeId": "507f1f77bcf86cd799439012",
  "reviewMode": "detailed",
  "ratings": {
    "salary": 5,
    "restTime": 4,
    "workEnv": 4,
    "management": 5
  },
  "wageType": "custom",
  "hourlyWage": 12.50,
  "content": "Great place to work! Pay is always on time and management is very supportive. Can get busy during peak hours but overall a positive experience.",
  "workPeriod": {
    "start": "2024-06-01",
    "end": "2024-11-30"
  },
  "position": "Barista",
  "pros": "Accurate pay, friendly management, flexible shifts",
  "cons": "Very busy during peak times",
  "isAnonymous": false
}
```

**Validation**
- `googlePlaceId`: Required (used to find or create workplace)
- `storeId`: Optional (if workplace already exists)
- `reviewMode`: "detailed" (default)
- `ratings.salary`: 1-5, required
- `ratings.restTime`: 1-5, required
- `ratings.workEnv`: 1-5, required
- `ratings.management`: 1-5, required
- `wageType`: 'custom' | 'minimum_wage' | 'average' | 'above_average', optional
- `hourlyWage`: 0-100, optional (£ per hour, required when wageType is 'custom')
- `content`: 10-2000 characters, required
- `workPeriod.start`: Date, required
- `workPeriod.end`: Date, optional (null if currently working)
- `position`: 1-50 characters, required
- `pros`: Max 500 characters, optional
- `cons`: Max 500 characters, optional
- `isAnonymous`: Boolean, default false

**Response** `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "store": "507f1f77bcf86cd799439012",
    "user": "507f1f77bcf86cd799439011",
    "reviewMode": "detailed",
    "ratings": {
      "salary": 5,
      "restTime": 4,
      "workEnv": 4,
      "management": 5
    },
    "averageRating": 4.5,
    "wageType": "custom",
    "hourlyWage": 12.50,
    "content": "Great place to work!...",
    "workPeriod": {
      "start": "2024-06-01T00:00:00.000Z",
      "end": "2024-11-30T00:00:00.000Z"
    },
    "position": "Barista",
    "pros": "Accurate pay, friendly management, flexible shifts",
    "cons": "Very busy during peak times",
    "helpfulCount": 0,
    "isAnonymous": false,
    "createdAt": "2024-12-08T00:00:00.000Z",
    "rewardPoints": 50
  },
  "message": "Review created successfully. You earned 50 points!"
}
```

**Errors**
- `401`: Authentication required
- `400`: Invalid input
- `409`: Already reviewed this workplace (1 review per user per workplace)
- `404`: Workplace not found and unable to create from Google Place ID

---

### 4.5 Create Quick Review

Write a quick review (30 seconds or less). Simpler than detailed review.

```http
POST /api/reviews/quick
```

**Headers**
```http
Authorization: Bearer {accessToken}
```

**Request Body**
```json
{
  "googlePlaceId": "ChIJ_WXS9XQHZ0gRBKRvCi6GHYI",
  "storeId": "507f1f77bcf86cd799439012",
  "reviewMode": "quick",
  "ratings": {
    "salary": 4,
    "restTime": 3,
    "workEnv": 4,
    "management": 4
  },
  "wageType": "above_average",
  "content": "Overall decent experience. Standard cafe work.",
  "position": "Team Member",
  "isAnonymous": true
}
```

**Validation**
- `googlePlaceId`: Required
- `storeId`: Optional
- `reviewMode`: "quick"
- `ratings`: All 4 categories, 1-5, required
- `wageType`: Optional (custom | minimum_wage | average | above_average)
- `hourlyWage`: Optional (required when wageType is 'custom')
- `content`: 10-500 characters (shorter than detailed)
- `position`: 1-50 characters, required
- `isAnonymous`: Boolean, default false
- No `workPeriod`, `pros`, `cons` required

**Response** `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "store": "507f1f77bcf86cd799439012",
    "user": "507f1f77bcf86cd799439013",
    "reviewMode": "quick",
    "ratings": {
      "salary": 4,
      "restTime": 3,
      "workEnv": 4,
      "management": 4
    },
    "averageRating": 3.75,
    "wageType": "above_average",
    "content": "Overall decent experience. Standard cafe work.",
    "position": "Team Member",
    "helpfulCount": 0,
    "isAnonymous": true,
    "createdAt": "2024-12-09T00:00:00.000Z",
    "rewardPoints": 20
  },
  "message": "Quick review created successfully. You earned 20 points!"
}
```

**Note**: Quick reviews earn fewer points (20) than detailed reviews (50).

---

### 4.6 Mark Review as Helpful

```http
POST /api/reviews/:id/helpful
```

**Headers**
```http
Authorization: Bearer {accessToken}
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "reviewId": "507f1f77bcf86cd799439015",
    "helpfulCount": 16
  },
  "message": "Review marked as helpful"
}
```

**Errors**
- `401`: Authentication required
- `409`: Already marked as helpful
- `404`: Review not found

---

### 4.7 Update Review

```http
PATCH /api/reviews/:id
```

**Headers**
```http
Authorization: Bearer {accessToken}
```

**Request Body** (partial update allowed)
```json
{
  "ratings": {
    "salary": 4,
    "restTime": 3,
    "workEnv": 4,
    "management": 4
  },
  "content": "Updated review content.",
  "wageType": "custom",
  "hourlyWage": 12.00
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "store": "507f1f77bcf86cd799439012",
    "user": "507f1f77bcf86cd799439011",
    "ratings": {
      "salary": 4,
      "restTime": 3,
      "workEnv": 4,
      "management": 4
    },
    "averageRating": 3.75,
    "wageType": "custom",
    "hourlyWage": 12.00,
    "content": "Updated review content.",
    "updatedAt": "2024-12-09T00:00:00.000Z"
  }
}
```

**Errors**
- `401`: Authentication required
- `403`: Not your review
- `404`: Review not found

---

### 4.8 Upgrade Quick Review to Detailed

Convert a quick review to a detailed review by adding more information.

```http
PATCH /api/reviews/:id/upgrade
```

**Headers**
```http
Authorization: Bearer {accessToken}
```

**Request Body**
```json
{
  "workPeriod": {
    "start": "2024-06-01",
    "end": "2024-11-30"
  },
  "pros": "Accurate pay, friendly management",
  "cons": "Very busy during peak times",
  "content": "Expanded detailed review content with more information about the experience..."
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "reviewMode": "detailed",
    "content": "Expanded detailed review content...",
    "workPeriod": {
      "start": "2024-06-01T00:00:00.000Z",
      "end": "2024-11-30T00:00:00.000Z"
    },
    "pros": "Accurate pay, friendly management",
    "cons": "Very busy during peak times",
    "rewardPoints": 30
  },
  "message": "Review upgraded to detailed mode. You earned 30 bonus points!"
}
```

**Note**: Upgrading earns additional 30 points (total 50, same as writing detailed review initially).

---

### 4.9 Delete Review

```http
DELETE /api/reviews/:id
```

**Headers**
```http
Authorization: Bearer {accessToken}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

**Errors**
- `401`: Authentication required
- `403`: Not your review (only own reviews or admin)
- `404`: Review not found

**Note**: Deleting a review will:
- Deduct points earned from the review
- Update workplace statistics

---

## 5. Q&A API

### 5.1 Get Questions

Get list of questions for a specific workplace.

```http
GET /api/stores/:storeId/questions
```

**Query Parameters**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | `1` | Page number |
| `limit` | number | No | `10` | Items per page (max: 50) |
| `sort` | string | No | `latest` | Sort order (`latest`, `mostAnswered`) |

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "_id": "673...",
        "store": "672...",
        "user": {
          "_id": "671...",
          "name": "John Doe"
        },
        "title": "What are the working hours?",
        "content": "I'm interested in applying. Can someone tell me about the typical working hours?",
        "answerCount": 3,
        "createdAt": "2024-12-20T10:00:00.000Z",
        "updatedAt": "2024-12-20T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

---

### 5.2 Create Question

Create a new question about a workplace.

```http
POST /api/stores/:storeId/questions
```

**Authentication Required**: Yes

**Request Body**
```json
{
  "title": "What are the working hours?",
  "content": "I'm interested in applying. Can someone tell me about the typical working hours?"
}
```

**Response** `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "673...",
    "store": "672...",
    "user": "671...",
    "title": "What are the working hours?",
    "content": "I'm interested in applying. Can someone tell me about the typical working hours?",
    "answerCount": 0,
    "createdAt": "2024-12-27T10:00:00.000Z",
    "updatedAt": "2024-12-27T10:00:00.000Z"
  }
}
```

**Errors**
- `400`: Validation error (title/content missing or too long)
- `401`: Authentication required
- `404`: Store not found

---

### 5.3 Get Question Detail

Get detailed information about a specific question.

```http
GET /api/questions/:questionId
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "673...",
    "store": {
      "_id": "672...",
      "name": "Starbucks Oxford Street"
    },
    "user": {
      "_id": "671...",
      "name": "John Doe"
    },
    "title": "What are the working hours?",
    "content": "I'm interested in applying. Can someone tell me about the typical working hours?",
    "answerCount": 3,
    "createdAt": "2024-12-20T10:00:00.000Z",
    "updatedAt": "2024-12-20T10:00:00.000Z"
  }
}
```

**Errors**
- `404`: Question not found

---

### 5.4 Update Question

Update an existing question (only by question author).

```http
PUT /api/questions/:questionId
```

**Authentication Required**: Yes

**Request Body**
```json
{
  "title": "What are the typical working hours?",
  "content": "I'm interested in applying for a barista position. Can someone tell me about the typical working hours and schedule flexibility?"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "673...",
    "store": "672...",
    "user": "671...",
    "title": "What are the typical working hours?",
    "content": "I'm interested in applying for a barista position. Can someone tell me about the typical working hours and schedule flexibility?",
    "answerCount": 3,
    "createdAt": "2024-12-20T10:00:00.000Z",
    "updatedAt": "2024-12-27T11:00:00.000Z"
  }
}
```

**Errors**
- `400`: Validation error
- `401`: Authentication required
- `403`: Not your question (only author can update)
- `404`: Question not found

---

### 5.5 Delete Question

Delete a question (only by question author).

```http
DELETE /api/questions/:questionId
```

**Authentication Required**: Yes

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Question deleted successfully"
}
```

**Errors**
- `401`: Authentication required
- `403`: Not your question (only author can delete)
- `404`: Question not found

**Note**: Deleting a question will also delete all associated answers (cascade delete).

---

### 5.6 Get Answers

Get list of answers for a specific question.

```http
GET /api/questions/:questionId/answers
```

**Query Parameters**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | `1` | Page number |
| `limit` | number | No | `50` | Items per page (max: 50) |
| `sort` | string | No | `best` | Sort order (`best`, `latest`, `mostLiked`) |

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "answers": [
      {
        "_id": "674...",
        "question": "673...",
        "user": {
          "_id": "671...",
          "name": "Jane Smith"
        },
        "content": "The usual shift is 8 hours, typically from 7am-3pm or 3pm-11pm. Pretty flexible with scheduling.",
        "likeCount": 5,
        "isBestAnswer": true,
        "createdAt": "2024-12-20T12:00:00.000Z",
        "updatedAt": "2024-12-20T12:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 3,
      "pages": 1
    }
  }
}
```

---

### 5.7 Create Answer

Create a new answer to a question.

```http
POST /api/questions/:questionId/answers
```

**Authentication Required**: Yes

**Request Body**
```json
{
  "content": "The usual shift is 8 hours, typically from 7am-3pm or 3pm-11pm. Pretty flexible with scheduling."
}
```

**Response** `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "674...",
    "question": "673...",
    "user": "671...",
    "content": "The usual shift is 8 hours, typically from 7am-3pm or 3pm-11pm. Pretty flexible with scheduling.",
    "likeCount": 0,
    "isBestAnswer": false,
    "createdAt": "2024-12-27T12:00:00.000Z",
    "updatedAt": "2024-12-27T12:00:00.000Z"
  }
}
```

**Errors**
- `400`: Validation error (content missing or too long)
- `401`: Authentication required
- `404`: Question not found

---

### 5.8 Update Answer

Update an existing answer (only by answer author).

```http
PUT /api/answers/:answerId
```

**Authentication Required**: Yes

**Request Body**
```json
{
  "content": "The usual shift is 8 hours. Morning shifts are 7am-3pm and evening shifts are 3pm-11pm. Very flexible with scheduling and shift swaps."
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "674...",
    "question": "673...",
    "user": "671...",
    "content": "The usual shift is 8 hours. Morning shifts are 7am-3pm and evening shifts are 3pm-11pm. Very flexible with scheduling and shift swaps.",
    "likeCount": 5,
    "isBestAnswer": true,
    "createdAt": "2024-12-20T12:00:00.000Z",
    "updatedAt": "2024-12-27T13:00:00.000Z"
  }
}
```

**Errors**
- `400`: Validation error
- `401`: Authentication required
- `403`: Not your answer (only author can update)
- `404`: Answer not found

---

### 5.9 Delete Answer

Delete an answer (only by answer author).

```http
DELETE /api/answers/:answerId
```

**Authentication Required**: Yes

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Answer deleted successfully"
}
```

**Errors**
- `401`: Authentication required
- `403`: Not your answer (only author can delete)
- `404`: Answer not found

---

### 5.10 Like Answer

Toggle like on an answer.

```http
POST /api/answers/:answerId/like
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "liked": true,
    "likeCount": 6
  }
}
```

**Response** (if unliking)
```json
{
  "success": true,
  "data": {
    "liked": false,
    "likeCount": 5
  }
}
```

**Errors**
- `404`: Answer not found

**Note**: This endpoint toggles the like status. Calling it again will unlike the answer.

---

### 5.11 Set Best Answer

Mark an answer as the best answer (only by question author).

```http
PATCH /api/answers/:answerId/best
```

**Authentication Required**: Yes

**Request Body**
```json
{
  "isBestAnswer": true
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "674...",
    "question": "673...",
    "user": "671...",
    "content": "The usual shift is 8 hours...",
    "likeCount": 5,
    "isBestAnswer": true,
    "createdAt": "2024-12-20T12:00:00.000Z",
    "updatedAt": "2024-12-27T14:00:00.000Z"
  }
}
```

**Errors**
- `400`: Validation error
- `401`: Authentication required
- `403`: Only question author can set best answer
- `404`: Answer not found

**Note**: Only one answer can be marked as best per question. Setting a new best answer will automatically unset the previous one.

---

## 6. Insights API

### 6.1 Get Salary Insights

Get wage statistics and insights for a specific workplace.

```http
GET /api/insights/salary/:storeId
```

**Response** `200 OK`
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
      },
      {
        "position": "Team Member",
        "average": 11.20,
        "count": 3,
        "min": 10.50,
        "max": 12.00
      }
    ],
    "trend": {
      "direction": "increasing",
      "changePercent": 5.2,
      "lastUpdated": "2024-12-08T00:00:00.000Z"
    }
  }
}
```

**Errors**
- `404`: Workplace not found or no wage data available

---

### 5.2 Get Regional Wage Comparison

Compare wages across workplaces in a specific region.

```http
GET /api/insights/salary/regional
```

**Query Parameters**
- `lat`: Latitude (required)
- `lng`: Longitude (required)
- `radius`: Radius in meters (default: 10000, max: 50000)
- `category`: Filter by category (optional)

**Example Request**
```http
GET /api/insights/salary/regional?lat=51.5074&lng=-0.1278&radius=10000&category=cafe
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "region": {
      "center": {
        "lat": 51.5074,
        "lng": -0.1278
      },
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
        "storeId": "507f1f77bcf86cd799439012",
        "name": "Starbucks",
        "distance": 1250,
        "averageWage": 11.85,
        "reviewCount": 12,
        "verifiedCount": 8
      },
      {
        "storeId": "507f1f77bcf86cd799439013",
        "name": "Costa Coffee",
        "distance": 2300,
        "averageWage": 12.10,
        "reviewCount": 15,
        "verifiedCount": 10
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
      },
      "highestVerified": {
        "name": "Starbucks",
        "verifiedPercent": 66.7
      }
    }
  }
}
```

---

### 5.3 Get Category Benchmarks

Get wage benchmarks by category across UK.

```http
GET /api/insights/benchmarks
```

**Query Parameters**
- `category`: Category filter (optional)

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "benchmarks": [
      {
        "category": "cafe",
        "averageWage": 11.45,
        "minWage": 10.42,
        "maxWage": 15.00,
        "workplaceCount": 234,
        "reviewCount": 1567
      },
      {
        "category": "restaurant",
        "averageWage": 10.85,
        "minWage": 10.42,
        "maxWage": 18.50,
        "workplaceCount": 456,
        "reviewCount": 2341
      },
      {
        "category": "retail",
        "averageWage": 10.95,
        "minWage": 10.42,
        "maxWage": 14.25,
        "workplaceCount": 378,
        "reviewCount": 1892
      }
    ],
    "nationalMinimumWage": {
      "age21Plus": 11.44,
      "age18To20": 8.60,
      "age16To17": 6.40,
      "apprentice": 6.40,
      "lastUpdated": "2024-04-01"
    }
  }
}
```

---

## 7. User API

### 7.1 Get User Profile

```http
GET /api/users/:id
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "avatar": "https://example.com/avatars/user123.jpg",
    "role": "employee",
    "points": 320,
    "trustScore": 75,
    "reviewCount": 8,
    "verifiedReviewCount": 5,
    "helpfulVoteCount": 42,
    "joinedAt": "2024-11-01T00:00:00.000Z",
    "badges": [
      {
        "type": "verified_reviewer",
        "name": "Verified Reviewer",
        "earnedAt": "2024-11-15T00:00:00.000Z"
      },
      {
        "type": "helpful_contributor",
        "name": "Helpful Contributor",
        "earnedAt": "2024-12-01T00:00:00.000Z"
      }
    ]
  }
}
```

**Errors**
- `404`: User not found

---

### 6.2 Get Leaderboard

```http
GET /api/users/leaderboard
```

**Query Parameters**
- `type`: Leaderboard type (points | trustScore | reviews)
- `limit`: Number of users (default: 10, max: 100)

**Example Request**
```http
GET /api/users/leaderboard?type=points&limit=10
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "user": {
          "_id": "507f1f77bcf86cd799439020",
          "name": "Sarah Johnson",
          "avatar": "https://example.com/avatars/user456.jpg",
          "trustScore": 95
        },
        "points": 1250,
        "reviewCount": 25,
        "verifiedCount": 18
      },
      {
        "rank": 2,
        "user": {
          "_id": "507f1f77bcf86cd799439011",
          "name": "John Doe",
          "avatar": "https://example.com/avatars/user123.jpg",
          "trustScore": 75
        },
        "points": 320,
        "reviewCount": 8,
        "verifiedCount": 5
      }
    ]
  }
}
```

---

## Error Codes

### HTTP Status Codes
| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Success |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request (validation failed) |
| 401 | Unauthorized | Authentication required (no token or expired) |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Conflict (duplicate data) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Please enter a valid email address"
      }
    ]
  }
}
```

### Error Code List
| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `UNAUTHORIZED` | Authentication failed |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `DUPLICATE` | Duplicate data |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Server internal error |
| `GOOGLE_PLACES_ERROR` | Google Places API error |
| `FILE_UPLOAD_ERROR` | File upload failed |

---

## Frontend Integration

### Environment Variables

```bash
# frontend/.env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Axios Client Setup

```typescript
// frontend/src/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired - logout
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;
```

### API Functions

```typescript
// frontend/src/api/places.ts
import apiClient from './client';

export const placesAPI = {
  // Search places
  searchPlaces: (query: string, lat?: number, lng?: number) => {
    return apiClient.get('/places/search', {
      params: { q: query, lat, lng }
    });
  },

  // Get place details
  getPlaceDetails: (placeId: string) => {
    return apiClient.get(`/places/details/${placeId}`);
  },

  // Check if workplace exists
  checkWorkplace: (placeId: string) => {
    return apiClient.get(`/places/check/${placeId}`);
  }
};
```

```typescript
// frontend/src/api/stores.ts
import apiClient from './client';

export const storeAPI = {
  // Get workplaces
  getStores: (params: {
    lat?: number;
    lng?: number;
    radius?: number;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }) => {
    return apiClient.get('/stores', { params });
  },

  // Get workplace details
  getStore: (id: string) => {
    return apiClient.get(`/stores/${id}`);
  },

  // Create workplace
  createStore: (data: {
    googlePlaceId: string;
    name: string;
    address: string;
    location: { type: 'Point'; coordinates: [number, number] };
    category: string;
    phone?: string;
  }) => {
    return apiClient.post('/stores', data);
  }
};
```

```typescript
// frontend/src/api/reviews.ts
import apiClient from './client';

export const reviewAPI = {
  // Get workplace reviews
  getStoreReviews: (storeId: string, params?: {
    page?: number;
    limit?: number;
    sort?: string;
    reviewMode?: 'quick' | 'detailed';
    verified?: boolean;
  }) => {
    return apiClient.get(`/stores/${storeId}/reviews`, { params });
  },

  // Get my reviews
  getMyReviews: (params?: { page?: number; limit?: number }) => {
    return apiClient.get('/reviews/my', { params });
  },

  // Create detailed review
  createReview: (data: {
    googlePlaceId: string;
    storeId?: string;
    reviewMode: 'detailed';
    ratings: {
      salary: number;
      restTime: number;
      workEnv: number;
      management: number;
    };
    hourlyWage?: number;
    content: string;
    workPeriod: { start: string; end?: string };
    position: string;
    pros?: string;
    cons?: string;
    isAnonymous?: boolean;
  }) => {
    return apiClient.post('/reviews', data);
  },

  // Create quick review
  createQuickReview: (data: {
    googlePlaceId: string;
    storeId?: string;
    reviewMode: 'quick';
    ratings: {
      salary: number;
      restTime: number;
      workEnv: number;
      management: number;
    };
    hourlyWage?: number;
    content: string;
    position: string;
    isAnonymous?: boolean;
  }) => {
    return apiClient.post('/reviews/quick', data);
  },

  // Upload payslip
  uploadPayslip: (reviewId: string, file: File) => {
    const formData = new FormData();
    formData.append('payslip', file);
    return apiClient.post(`/reviews/${reviewId}/payslip`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Mark review as helpful
  markHelpful: (reviewId: string) => {
    return apiClient.post(`/reviews/${reviewId}/helpful`);
  },

  // Upgrade quick review to detailed
  upgradeReview: (reviewId: string, data: {
    workPeriod: { start: string; end?: string };
    pros?: string;
    cons?: string;
    content: string;
  }) => {
    return apiClient.patch(`/reviews/${reviewId}/upgrade`, data);
  },

  // Update review
  updateReview: (id: string, data: Partial<Review>) => {
    return apiClient.patch(`/reviews/${id}`, data);
  },

  // Delete review
  deleteReview: (id: string) => {
    return apiClient.delete(`/reviews/${id}`);
  }
};
```

```typescript
// frontend/src/api/insights.ts
import apiClient from './client';

export const insightsAPI = {
  // Get salary insights for workplace
  getSalaryInsights: (storeId: string) => {
    return apiClient.get(`/insights/salary/${storeId}`);
  },

  // Get regional wage comparison
  getRegionalWages: (lat: number, lng: number, radius?: number, category?: string) => {
    return apiClient.get('/insights/salary/regional', {
      params: { lat, lng, radius, category }
    });
  },

  // Get category benchmarks
  getBenchmarks: (category?: string) => {
    return apiClient.get('/insights/benchmarks', {
      params: { category }
    });
  }
};
```

### React Query Hooks

```typescript
// frontend/src/hooks/usePlaces.ts
import { useQuery } from '@tanstack/react-query';
import { placesAPI } from '@/api/places';

export const useSearchPlaces = (query: string, lat?: number, lng?: number) => {
  return useQuery({
    queryKey: ['places', 'search', query, lat, lng],
    queryFn: () => placesAPI.searchPlaces(query, lat, lng),
    enabled: query.length >= 2
  });
};

export const usePlaceDetails = (placeId: string) => {
  return useQuery({
    queryKey: ['places', 'details', placeId],
    queryFn: () => placesAPI.getPlaceDetails(placeId),
    enabled: !!placeId
  });
};
```

```typescript
// frontend/src/hooks/useStores.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeAPI } from '@/api/stores';

export const useStores = (params: any) => {
  return useQuery({
    queryKey: ['stores', params],
    queryFn: () => storeAPI.getStores(params)
  });
};

export const useStore = (id: string) => {
  return useQuery({
    queryKey: ['store', id],
    queryFn: () => storeAPI.getStore(id),
    enabled: !!id
  });
};

export const useCreateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storeAPI.createStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    }
  });
};
```

```typescript
// frontend/src/hooks/useReviews.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewAPI } from '@/api/reviews';

export const useStoreReviews = (storeId: string, params: any) => {
  return useQuery({
    queryKey: ['reviews', 'store', storeId, params],
    queryFn: () => reviewAPI.getStoreReviews(storeId, params),
    enabled: !!storeId
  });
};

export const useMyReviews = (params: any) => {
  return useQuery({
    queryKey: ['reviews', 'my', params],
    queryFn: () => reviewAPI.getMyReviews(params)
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewAPI.createReview,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    }
  });
};

export const useUploadPayslip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, file }: { reviewId: string; file: File }) =>
      reviewAPI.uploadPayslip(reviewId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    }
  });
};
```

```typescript
// frontend/src/hooks/useInsights.ts
import { useQuery } from '@tanstack/react-query';
import { insightsAPI } from '@/api/insights';

export const useSalaryInsights = (storeId: string) => {
  return useQuery({
    queryKey: ['insights', 'salary', storeId],
    queryFn: () => insightsAPI.getSalaryInsights(storeId),
    enabled: !!storeId
  });
};

export const useRegionalWages = (lat: number, lng: number, radius?: number, category?: string) => {
  return useQuery({
    queryKey: ['insights', 'regional', lat, lng, radius, category],
    queryFn: () => insightsAPI.getRegionalWages(lat, lng, radius, category),
    enabled: !!(lat && lng)
  });
};

export const useBenchmarks = (category?: string) => {
  return useQuery({
    queryKey: ['insights', 'benchmarks', category],
    queryFn: () => insightsAPI.getBenchmarks(category)
  });
};
```

---

## 🛠️ Implementation Guide

### Phase 1: Google Places Integration
```
Implement Google Places proxy endpoints:
1. backend/src/controllers/places.controller.ts
2. backend/src/routes/places.routes.ts
3. backend/src/services/googlePlaces.service.ts

Add Google Maps API key to .env:
GOOGLE_MAPS_API_KEY=your_api_key_here
```

### Phase 2: Enhanced Store & Review APIs
```
Update Store and Review models with new fields:
1. Add googlePlaceId to Store model
2. Add averageWage, verifiedCount to Store model
3. Add hourlyWage, payslipUrl, isPayslipVerified to Review model
4. Add reviewMode, isAnonymous, helpfulCount to Review model
5. Update aggregation pipeline for wage statistics
```

### Phase 3: Insights API
```
Implement salary insights endpoints:
1. backend/src/controllers/insights.controller.ts
2. backend/src/routes/insights.routes.ts
3. backend/src/services/insights.service.ts

Add aggregation queries for regional comparisons.
```

### Phase 4: File Upload
```
Implement payslip upload:
1. Install multer, sharp libraries
2. Configure cloud storage (AWS S3 or Cloudinary)
3. Implement auto-blur service for privacy
4. Add file validation and size limits
```

---

**Document Version**: 2.0.0
**Last Updated**: 2024-12-14
**Authors**: Development Team
