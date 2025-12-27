import { AnswerModel, IAnswer } from '../models/Answer.model';
import { QuestionModel } from '../models/Question.model';
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from '../utils/errors.util';
import { logger } from '../config/logger';
import type {
  GetAnswersQuery,
  CreateAnswerInput,
  UpdateAnswerInput,
  SetBestAnswerInput,
} from '../validators/answer.validator';

/**
 * 답변 서비스 클래스
 * 답변 관련 비즈니스 로직 처리
 */
export class AnswerService {
  /**
   * 특정 질문의 답변 목록 조회
   */
  static async getAnswersByQuestion(
    questionId: string,
    query: GetAnswersQuery
  ): Promise<{
    answers: IAnswer[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const { page = 1, limit = 10, sort = 'latest' } = query;

    // 정렬 조건
    let sortOption: Record<string, 1 | -1> = {};
    if (sort === 'latest') {
      sortOption = { isBestAnswer: -1, createdAt: -1 }; // Best Answer 먼저, 그 다음 최신순
    } else if (sort === 'mostLiked') {
      sortOption = { isBestAnswer: -1, likeCount: -1, createdAt: -1 }; // Best Answer 먼저, 좋아요 많은순
    }

    // 페이지네이션
    const skip = (page - 1) * limit;

    // 답변 조회
    const answers = await AnswerModel.find({ question: questionId })
      .populate('user', 'name email')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    // 총 개수
    const total = await AnswerModel.countDocuments({ question: questionId });

    logger.info('질문 답변 목록 조회', {
      questionId,
      count: answers.length,
      total,
    });

    return {
      answers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 답변 생성
   */
  static async createAnswer(
    questionId: string,
    userId: string,
    input: CreateAnswerInput
  ): Promise<IAnswer> {
    // 질문 존재 확인
    const question = await QuestionModel.findById(questionId);
    if (!question) {
      throw new NotFoundError('질문을 찾을 수 없습니다');
    }

    // 답변 생성
    const answer = await AnswerModel.create({
      question: questionId,
      user: userId,
      ...input,
    });

    // 질문의 answerCount 증가
    await QuestionModel.findByIdAndUpdate(questionId, {
      $inc: { answerCount: 1 },
    });

    logger.info('답변 생성', {
      answerId: answer._id.toString(),
      questionId,
      userId,
    });

    // populate 후 반환
    return await AnswerModel.findById(answer._id)
      .populate('user', 'name email')
      .lean() as IAnswer;
  }

  /**
   * 답변 수정
   */
  static async updateAnswer(
    answerId: string,
    userId: string,
    input: UpdateAnswerInput
  ): Promise<IAnswer> {
    const answer = await AnswerModel.findById(answerId);

    if (!answer) {
      throw new NotFoundError('답변을 찾을 수 없습니다');
    }

    // 작성자 확인
    if (answer.user.toString() !== userId) {
      throw new ForbiddenError('답변을 수정할 권한이 없습니다');
    }

    // 답변 수정
    const updatedAnswer = await AnswerModel.findByIdAndUpdate(
      answerId,
      { $set: input },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .lean();

    logger.info('답변 수정', { answerId, userId });

    return updatedAnswer as IAnswer;
  }

  /**
   * 답변 삭제
   */
  static async deleteAnswer(answerId: string, userId: string): Promise<void> {
    const answer = await AnswerModel.findById(answerId);

    if (!answer) {
      throw new NotFoundError('답변을 찾을 수 없습니다');
    }

    // 작성자 확인
    if (answer.user.toString() !== userId) {
      throw new ForbiddenError('답변을 삭제할 권한이 없습니다');
    }

    // 답변 삭제
    await AnswerModel.findByIdAndDelete(answerId);

    // 질문의 answerCount 감소
    await QuestionModel.findByIdAndUpdate(answer.question, {
      $inc: { answerCount: -1 },
    });

    logger.info('답변 삭제', { answerId, userId });
  }

  /**
   * Best Answer 설정/해제
   */
  static async setBestAnswer(
    answerId: string,
    userId: string,
    input: SetBestAnswerInput
  ): Promise<IAnswer> {
    const answer = await AnswerModel.findById(answerId).populate({
      path: 'question',
      populate: { path: 'user' },
    });

    if (!answer) {
      throw new NotFoundError('답변을 찾을 수 없습니다');
    }

    // 질문 작성자만 Best Answer 설정 가능
    const question = answer.question as any;
    if (question.user._id.toString() !== userId) {
      throw new ForbiddenError('Best Answer를 설정할 권한이 없습니다');
    }

    // Best Answer 설정/해제
    const updatedAnswer = await AnswerModel.findByIdAndUpdate(
      answerId,
      { $set: { isBestAnswer: input.isBestAnswer } },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .lean();

    logger.info('Best Answer 설정/해제', {
      answerId,
      isBestAnswer: input.isBestAnswer,
    });

    return updatedAnswer as IAnswer;
  }

  /**
   * 답변 좋아요 (간단 구현 - 추후 확장 가능)
   */
  static async likeAnswer(answerId: string): Promise<IAnswer> {
    const answer = await AnswerModel.findByIdAndUpdate(
      answerId,
      { $inc: { likeCount: 1 } },
      { new: true }
    )
      .populate('user', 'name email')
      .lean();

    if (!answer) {
      throw new NotFoundError('답변을 찾을 수 없습니다');
    }

    logger.info('답변 좋아요', { answerId });

    return answer;
  }
}
