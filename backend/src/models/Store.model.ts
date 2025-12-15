import { Schema, model, Document } from 'mongoose';

/**
 * Address 인터페이스 (구조화된 주소)
 */
export interface IAddress {
  country: string; // ISO 3166-1 alpha-2 (GB, US, KR, etc.)
  countryName: string; // 국가명 (표시용)
  formatted: string; // 전체 주소 (표시용)
  street?: string; // 상세 주소
  city?: string; // 도시
  state?: string; // 주/도
  postalCode?: string; // 우편번호
}

/**
 * Location 인터페이스 (GeoJSON Point)
 */
export interface ILocation {
  type: 'Point';
  coordinates: [number, number]; // [경도, 위도]
}

/**
 * Average Rating 인터페이스
 */
export interface IAverageRating {
  salary: number; // 평균 급여 평점
  restTime: number; // 평균 휴식시간 평점
  workEnv: number; // 평균 근무환경 평점
  management: number; // 평균 사장님 스타일 평점
  overall: number; // 전체 평균
}

/**
 * Average Wage 인터페이스
 */
export interface IAverageWage {
  min: number; // 최저 시급 (£)
  max: number; // 최고 시급 (£)
  average: number; // 평균 시급 (£)
  count: number; // 급여 리뷰 수
}

/**
 * Store 인터페이스
 */
export interface IStore extends Document {
  googlePlaceId?: string; // Google Place ID (unique)
  isFromGooglePlaces: boolean; // 🆕 Google Places에서 가져온 가게인지 (true: 수정 불가)
  name: string;
  address: IAddress; // 구조화된 주소
  location: ILocation;
  category:
    | 'cafe'
    | 'restaurant'
    | 'convenience'
    | 'retail'
    | 'service'
    | 'education'
    | 'entertainment'
    | 'other';
  phone?: string;
  currency: string; // 통화 코드 (ISO 4217: GBP, USD, KRW, etc.)
  createdBy: Schema.Types.ObjectId;
  averageRating: IAverageRating;
  averageWage: IAverageWage;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Store 스키마 정의
 */
const storeSchema = new Schema<IStore>(
  {
    googlePlaceId: {
      type: String,
      unique: true,
      sparse: true, // null 값 허용하면서 unique
      trim: true,
      index: true,
    },
    isFromGooglePlaces: {
      type: Boolean,
      default: false,
      index: true,
    },
    name: {
      type: String,
      required: [true, '가게 이름은 필수입니다'],
      trim: true,
      minlength: [2, '가게 이름은 최소 2자 이상이어야 합니다'],
      maxlength: [100, '가게 이름은 최대 100자까지 가능합니다'],
    },
    address: {
      country: {
        type: String,
        required: [true, '국가 코드는 필수입니다'],
        uppercase: true,
        minlength: [2, '국가 코드는 2자여야 합니다'],
        maxlength: [2, '국가 코드는 2자여야 합니다'],
        index: true,
      },
      countryName: {
        type: String,
        required: [true, '국가명은 필수입니다'],
        trim: true,
      },
      formatted: {
        type: String,
        required: [true, '주소는 필수입니다'],
        trim: true,
      },
      street: {
        type: String,
        trim: true,
        default: null,
      },
      city: {
        type: String,
        trim: true,
        index: true,
        default: null,
      },
      state: {
        type: String,
        trim: true,
        default: null,
      },
      postalCode: {
        type: String,
        trim: true,
        default: null,
      },
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: [true, '좌표는 필수입니다'],
        validate: {
          validator: function (v: number[]) {
            return (
              v.length === 2 &&
              v[0] >= -180 &&
              v[0] <= 180 && // 경도
              v[1] >= -90 &&
              v[1] <= 90
            ); // 위도
          },
          message: '유효하지 않은 좌표입니다',
        },
      },
    },
    category: {
      type: String,
      required: [true, '업종은 필수입니다'],
      enum: {
        values: [
          'cafe', // 카페
          'restaurant', // 음식점
          'convenience', // 편의점
          'retail', // 소매점
          'service', // 서비스업
          'education', // 학원/교육
          'entertainment', // 오락/엔터테인먼트
          'other', // 기타
        ],
        message: '{VALUE}는 유효하지 않은 업종입니다',
      },
      index: true,
    },
    phone: {
      type: String,
      default: null,
      trim: true,
    },
    currency: {
      type: String,
      required: [true, '통화 코드는 필수입니다'],
      uppercase: true,
      enum: {
        values: ['GBP', 'USD', 'KRW', 'EUR', 'JPY', 'CNY', 'AUD', 'CAD'],
        message: '{VALUE}는 지원하지 않는 통화입니다',
      },
      default: 'GBP',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, '등록자는 필수입니다'],
      index: true,
    },
    averageRating: {
      salary: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      restTime: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      workEnv: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      management: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      overall: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
    },
    averageWage: {
      min: {
        type: Number,
        default: 0,
        min: 0,
      },
      max: {
        type: Number,
        default: 0,
        min: 0,
      },
      average: {
        type: Number,
        default: 0,
        min: 0,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 인덱스
storeSchema.index({ location: '2dsphere' }); // 지리공간 인덱스
storeSchema.index({ name: 'text', 'address.formatted': 'text' }); // 텍스트 검색
storeSchema.index({ 'address.country': 1, 'address.city': 1 }); // 국가/도시 검색
storeSchema.index({ 'address.country': 1, category: 1 }); // 국가/업종 검색
storeSchema.index({ 'averageRating.overall': -1 }); // 평점 정렬
storeSchema.index({ reviewCount: -1 }); // 리뷰 수 정렬
storeSchema.index({ createdAt: -1 });

// Virtual: 리뷰 목록
storeSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'store',
});

export const StoreModel = model<IStore>('Store', storeSchema);
