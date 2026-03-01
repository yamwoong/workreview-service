import { Schema, model, Document } from 'mongoose';

/**
 * Question 인터페이스
 * 매장에 대한 질문
 */
export interface IQuestion extends Document {
  store: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  title: string;
  content: string;
  answerCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Question 스키마 정의
 */
const questionSchema = new Schema<IQuestion>(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: [true, '매장은 필수입니다'],
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, '작성자는 필수입니다'],
      index: true,
    },
    title: {
      type: String,
      required: [true, '질문 제목은 필수입니다'],
      trim: true,
      maxlength: [200, '질문 제목은 최대 200자까지 가능합니다'],
    },
    content: {
      type: String,
      required: [true, '질문 내용은 필수입니다'],
      trim: true,
      maxlength: [2000, '질문 내용은 최대 2000자까지 가능합니다'],
    },
    answerCount: {
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
questionSchema.index({ store: 1, createdAt: -1 }); // 매장별 최신순 정렬
questionSchema.index({ store: 1, answerCount: -1 }); // 매장별 답변 많은순 정렬

// Virtual: 답변 목록
questionSchema.virtual('answers', {
  ref: 'Answer',
  localField: '_id',
  foreignField: 'question',
});

export const QuestionModel = model<IQuestion>('Question', questionSchema);
