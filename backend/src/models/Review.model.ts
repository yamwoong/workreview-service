import { Schema, model, Document } from 'mongoose';

/**
 * Review 인터페이스
 */
export interface IReview extends Document {
  user: Schema.Types.ObjectId; // 리뷰 작성자
  store: Schema.Types.ObjectId; // 리뷰 대상 직장
  reviewMode: 'quick' | 'detailed'; // 빠른 리뷰 vs 상세 리뷰
  rating: number; // 평점 (1-5)
  wageType?: 'below_minimum' | 'minimum_wage' | 'above_minimum'; // 급여 수준
  hourlyWage?: number; // 시급 (£) - deprecated, 더 이상 사용 안 함
  content?: string; // 리뷰 내용 (선택사항, 10-2000자)
  position?: string; // 직책/포지션 (선택사항)
  isAnonymous: boolean; // 익명 여부
  helpfulCount: number; // 도움됨 투표 수
  likeCount: number; // 추천 수
  dislikeCount: number; // 비추천 수
  likedBy: Schema.Types.ObjectId[]; // 추천한 사용자 목록
  dislikedBy: Schema.Types.ObjectId[]; // 비추천한 사용자 목록
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Review 스키마 정의
 */
const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, '리뷰 작성자는 필수입니다'],
      index: true,
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: [true, '리뷰 대상 직장은 필수입니다'],
      index: true,
    },
    reviewMode: {
      type: String,
      enum: {
        values: ['quick', 'detailed'],
        message: '{VALUE}는 유효하지 않은 리뷰 모드입니다',
      },
      default: 'quick',
      index: true,
    },
    rating: {
      type: Number,
      required: [true, '평점은 필수입니다'],
      min: [1, '평점은 최소 1점 이상이어야 합니다'],
      max: [5, '평점은 최대 5점까지 가능합니다'],
      index: true,
    },
    wageType: {
      type: String,
      enum: {
        values: ['below_minimum', 'minimum_wage', 'above_minimum'],
        message: '{VALUE}는 유효하지 않은 급여 수준입니다',
      },
      index: true,
    },
    hourlyWage: {
      type: Number,
      min: [0, '시급은 0 이상이어야 합니다'],
      index: true,
    },
    content: {
      type: String,
      trim: true,
      maxlength: [2000, '리뷰 내용은 최대 2000자까지 가능합니다'],
    },
    position: {
      type: String,
      trim: true,
      maxlength: [100, '직책/포지션은 최대 100자까지 가능합니다'],
      index: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
      index: true,
    },
    helpfulCount: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    likeCount: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    dislikeCount: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    likedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    dislikedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 복합 인덱스
reviewSchema.index({ user: 1, store: 1 }); // 사용자별 직장 리뷰
reviewSchema.index({ store: 1, createdAt: -1 }); // 직장별 최신 리뷰
reviewSchema.index({ store: 1, rating: -1 }); // 직장별 평점 정렬
reviewSchema.index({ store: 1, likeCount: -1 }); // 직장별 추천 많은 순 (Most Helpful)
reviewSchema.index({ createdAt: -1 }); // 최신 리뷰
reviewSchema.index({ helpfulCount: -1 }); // 도움됨 많은 순
reviewSchema.index({ position: 1, store: 1 }); // 포지션별 리뷰

// Virtual: 댓글 목록
reviewSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'review',
});

// Virtual: 댓글 수
reviewSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'review',
  count: true,
});

export const ReviewModel = model<IReview>('Review', reviewSchema);

















