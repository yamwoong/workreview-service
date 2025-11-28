import { Schema, model, Document } from 'mongoose';

/**
 * Review 인터페이스
 */
export interface IReview extends Document {
  reviewer: Schema.Types.ObjectId;
  reviewee: Schema.Types.ObjectId;
  title: string;
  content: string;
  rating: number;
  category: 'performance' | 'teamwork' | 'leadership' | 'communication';
  period: string;
  isPublic: boolean;
  status: 'draft' | 'submitted' | 'reviewed';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Review 스키마 정의
 */
const reviewSchema = new Schema<IReview>(
  {
    reviewer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, '리뷰 작성자는 필수입니다'],
      index: true,
    },
    reviewee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, '리뷰 대상자는 필수입니다'],
      index: true,
    },
    title: {
      type: String,
      required: [true, '제목은 필수입니다'],
      trim: true,
      minlength: [3, '제목은 최소 3자 이상이어야 합니다'],
      maxlength: [200, '제목은 최대 200자까지 가능합니다'],
    },
    content: {
      type: String,
      required: [true, '내용은 필수입니다'],
      trim: true,
      minlength: [10, '내용은 최소 10자 이상이어야 합니다'],
      maxlength: [5000, '내용은 최대 5000자까지 가능합니다'],
    },
    rating: {
      type: Number,
      required: [true, '평점은 필수입니다'],
      min: [1, '평점은 최소 1점 이상이어야 합니다'],
      max: [5, '평점은 최대 5점까지 가능합니다'],
      index: true,
    },
    category: {
      type: String,
      enum: {
        values: ['performance', 'teamwork', 'leadership', 'communication'],
        message: '{VALUE}는 유효하지 않은 카테고리입니다',
      },
      required: [true, '카테고리는 필수입니다'],
      index: true,
    },
    period: {
      type: String,
      required: [true, '기간은 필수입니다'],
      trim: true,
      match: [/^\d{4}-Q[1-4]$|^\d{4}$/, '기간 형식이 올바르지 않습니다 (예: 2024-Q1 또는 2024)'],
    },
    isPublic: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'submitted', 'reviewed'],
        message: '{VALUE}는 유효하지 않은 상태입니다',
      },
      default: 'draft',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 복합 인덱스
reviewSchema.index({ reviewer: 1, reviewee: 1 });
reviewSchema.index({ reviewer: 1, status: 1 });
reviewSchema.index({ reviewee: 1, status: 1 });
reviewSchema.index({ status: 1, createdAt: -1 });
reviewSchema.index({ createdAt: -1 });

// Virtual: 댓글 수
reviewSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'review',
  count: true,
});

export const ReviewModel = model<IReview>('Review', reviewSchema);






