import { Schema, model, Document } from 'mongoose';

/**
 * Ratings 인터페이스 (4가지 평가 항목)
 */
export interface IRatings {
  salary: number; // 급여 만족도 (1-5)
  restTime: number; // 휴식시간 (1-5)
  workEnv: number; // 근무환경 (1-5)
  management: number; // 사장님 스타일 (1-5)
}

/**
 * Work Period 인터페이스
 */
export interface IWorkPeriod {
  start: Date;
  end?: Date; // 현재 근무중이면 null
}

/**
 * Review 인터페이스
 */
export interface IReview extends Document {
  user: Schema.Types.ObjectId; // 리뷰 작성자
  store: Schema.Types.ObjectId; // 리뷰 대상 직장
  reviewMode: 'quick' | 'detailed'; // 빠른 리뷰 vs 상세 리뷰
  ratings: IRatings; // 4가지 평가 항목
  averageRating: number; // 평균 평점 (자동 계산)
  wageType?: 'custom' | 'minimum_wage' | 'average' | 'above_average'; // 급여 입력 방식
  hourlyWage?: number; // 시급 (£)
  content: string; // 리뷰 내용 (10-500자: quick, 10-2000자: detailed)
  workPeriod?: IWorkPeriod; // 근무 기간
  position: string; // 직책/포지션
  pros?: string; // 장점 (detailed만)
  cons?: string; // 단점 (detailed만)
  isAnonymous: boolean; // 익명 여부
  helpfulCount: number; // 도움됨 투표 수
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
      required: [true, '리뷰 모드는 필수입니다'],
      default: 'quick',
      index: true,
    },
    ratings: {
      salary: {
        type: Number,
        required: [true, '급여 평점은 필수입니다'],
        min: [1, '평점은 최소 1점 이상이어야 합니다'],
        max: [5, '평점은 최대 5점까지 가능합니다'],
      },
      restTime: {
        type: Number,
        required: [true, '휴식시간 평점은 필수입니다'],
        min: [1, '평점은 최소 1점 이상이어야 합니다'],
        max: [5, '평점은 최대 5점까지 가능합니다'],
      },
      workEnv: {
        type: Number,
        required: [true, '근무환경 평점은 필수입니다'],
        min: [1, '평점은 최소 1점 이상이어야 합니다'],
        max: [5, '평점은 최대 5점까지 가능합니다'],
      },
      management: {
        type: Number,
        required: [true, '사장님 스타일 평점은 필수입니다'],
        min: [1, '평점은 최소 1점 이상이어야 합니다'],
        max: [5, '평점은 최대 5점까지 가능합니다'],
      },
    },
    averageRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      index: true,
    },
    wageType: {
      type: String,
      enum: {
        values: ['custom', 'minimum_wage', 'average', 'above_average'],
        message: '{VALUE}는 유효하지 않은 급여 입력 방식입니다',
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
      required: [true, '리뷰 내용은 필수입니다'],
      trim: true,
      minlength: [10, '리뷰 내용은 최소 10자 이상이어야 합니다'],
      maxlength: [2000, '리뷰 내용은 최대 2000자까지 가능합니다'],
    },
    workPeriod: {
      start: {
        type: Date,
        required: function (this: IReview) {
          return this.reviewMode === 'detailed';
        },
      },
      end: {
        type: Date,
      },
    },
    position: {
      type: String,
      required: [true, '직책/포지션은 필수입니다'],
      trim: true,
      maxlength: [100, '직책/포지션은 최대 100자까지 가능합니다'],
      index: true,
    },
    pros: {
      type: String,
      trim: true,
      maxlength: [1000, '장점은 최대 1000자까지 가능합니다'],
    },
    cons: {
      type: String,
      trim: true,
      maxlength: [1000, '단점은 최대 1000자까지 가능합니다'],
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save hook: averageRating 자동 계산
reviewSchema.pre('save', function (next) {
  if (this.isModified('ratings')) {
    const { salary, restTime, workEnv, management } = this.ratings;
    this.averageRating = (salary + restTime + workEnv + management) / 4;
  }
  next();
});

// 복합 인덱스
reviewSchema.index({ user: 1, store: 1 }); // 사용자별 직장 리뷰
reviewSchema.index({ store: 1, createdAt: -1 }); // 직장별 최신 리뷰
reviewSchema.index({ store: 1, averageRating: -1 }); // 직장별 평점 정렬
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
