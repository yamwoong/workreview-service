import { Schema, model, Document } from 'mongoose';

/**
 * Answer 인터페이스
 * 질문에 대한 답변
 */
export interface IAnswer extends Document {
  question: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  content: string;
  likeCount: number;
  isBestAnswer: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Answer 스키마 정의
 */
const answerSchema = new Schema<IAnswer>(
  {
    question: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: [true, '질문은 필수입니다'],
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, '작성자는 필수입니다'],
      index: true,
    },
    content: {
      type: String,
      required: [true, '답변 내용은 필수입니다'],
      trim: true,
      maxlength: [2000, '답변 내용은 최대 2000자까지 가능합니다'],
    },
    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isBestAnswer: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 인덱스
answerSchema.index({ question: 1, createdAt: -1 }); // 질문별 최신순 정렬
answerSchema.index({ question: 1, likeCount: -1 }); // 질문별 좋아요 많은순 정렬
answerSchema.index({ question: 1, isBestAnswer: -1 }); // Best Answer 우선 정렬

export const AnswerModel = model<IAnswer>('Answer', answerSchema);
