import { Schema, model, Document } from 'mongoose';
import { logger } from '../config/logger';

/**
 * Comment 인터페이스
 */
export interface IComment extends Document {
  content: string;
  review: Schema.Types.ObjectId;
  author: Schema.Types.ObjectId;
  parent: Schema.Types.ObjectId | null;  // MongoDB는 null 저장
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Comment 스키마 정의
 */
const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: [true, '댓글 내용은 필수입니다'],
      trim: true,
      minlength: [1, '댓글은 최소 1자 이상이어야 합니다'],
      maxlength: [1000, '댓글은 최대 1000자까지 가능합니다'],
    },
    review: {
      type: Schema.Types.ObjectId,
      ref: 'Review',
      required: [true, '리뷰는 필수입니다'],
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, '작성자는 필수입니다'],
      index: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null, // null이면 최상위 댓글
      index: true,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 인덱스
commentSchema.index({ review: 1, createdAt: -1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parent: 1 });

/**
 * 수정 시 isEdited 플래그 설정 (pre-save hook)
 * Mongoose 9+ 버전: Promise 기반 (next 콜백 사용 안 함)
 */
commentSchema.pre('save', function () {
  try {
    if (this.isModified('content') && !this.isNew) {
      this.isEdited = true;
    }
  } catch (error) {
    logger.error('댓글 pre-save hook 실패', {
      commentId: this._id ? this._id.toString() : 'new_comment',
      error: error instanceof Error ? error.message : String(error),
    });

    // Error 타입 변환: unknown -> Error
    const errorToThrow =
      error instanceof Error
        ? error
        : new Error(`댓글 저장 중 오류가 발생했습니다: ${String(error)}`);

    throw errorToThrow;
  }
});

// Virtual: 대댓글 수
commentSchema.virtual('replyCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parent',
  count: true,
});

export const CommentModel = model<IComment>('Comment', commentSchema);














