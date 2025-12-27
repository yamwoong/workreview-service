import { QuestionModel, IQuestion } from '../models/Question.model';
import { AnswerModel } from '../models/Answer.model';
import { StoreModel } from '../models/Store.model';
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from '../utils/errors.util';
import { logger } from '../config/logger';
import type {
  GetQuestionsQuery,
  CreateQuestionInput,
  UpdateQuestionInput,
} from '../validators/question.validator';

/**
 * 질문 서비스 클래스
 * 질문 관련 비즈니스 로직 처리
 */
export class QuestionService {
  /**
   * 특정 매장의 질문 목록 조회
   */
  static async getQuestionsByStore(
    storeId: string,
    query: GetQuestionsQuery
  ): Promise<{
    questions: IQuestion[];
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
      sortOption = { createdAt: -1 };
    } else if (sort === 'mostAnswered') {
      sortOption = { answerCount: -1, createdAt: -1 };
    }

    // 페이지네이션
    const skip = (page - 1) * limit;

    // 질문 조회
    const questions = await QuestionModel.find({ store: storeId })
      .populate('user', 'name email')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    // 총 개수
    const total = await QuestionModel.countDocuments({ store: storeId });

    logger.info('매장 질문 목록 조회', {
      storeId,
      count: questions.length,
      total,
    });

    return {
      questions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 질문 상세 조회
   */
  static async getQuestionById(questionId: string): Promise<IQuestion> {
    const question = await QuestionModel.findById(questionId)
      .populate('user', 'name email')
      .lean();

    if (!question) {
      throw new NotFoundError('질문을 찾을 수 없습니다');
    }

    logger.info('질문 상세 조회', { questionId });

    return question;
  }

  /**
   * 질문 생성
   */
  static async createQuestion(
    storeId: string,
    userId: string,
    input: CreateQuestionInput
  ): Promise<IQuestion> {
    // 매장 존재 확인
    const store = await StoreModel.findById(storeId);
    if (!store) {
      throw new NotFoundError('매장을 찾을 수 없습니다');
    }

    // 질문 생성
    const question = await QuestionModel.create({
      store: storeId,
      user: userId,
      ...input,
    });

    // 매장의 questionCount 증가
    await StoreModel.findByIdAndUpdate(storeId, {
      $inc: { questionCount: 1 },
    });

    logger.info('질문 생성', {
      questionId: question._id.toString(),
      storeId,
      userId,
    });

    // populate 후 반환
    return await QuestionModel.findById(question._id)
      .populate('user', 'name email')
      .lean() as IQuestion;
  }

  /**
   * 질문 수정
   */
  static async updateQuestion(
    questionId: string,
    userId: string,
    input: UpdateQuestionInput
  ): Promise<IQuestion> {
    const question = await QuestionModel.findById(questionId);

    if (!question) {
      throw new NotFoundError('질문을 찾을 수 없습니다');
    }

    // 작성자 확인
    if (question.user.toString() !== userId) {
      throw new ForbiddenError('질문을 수정할 권한이 없습니다');
    }

    // 질문 수정
    const updatedQuestion = await QuestionModel.findByIdAndUpdate(
      questionId,
      { $set: input },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .lean();

    logger.info('질문 수정', { questionId, userId });

    return updatedQuestion as IQuestion;
  }

  /**
   * 질문 삭제
   */
  static async deleteQuestion(
    questionId: string,
    userId: string
  ): Promise<void> {
    const question = await QuestionModel.findById(questionId);

    if (!question) {
      throw new NotFoundError('질문을 찾을 수 없습니다');
    }

    // 작성자 확인
    if (question.user.toString() !== userId) {
      throw new ForbiddenError('질문을 삭제할 권한이 없습니다');
    }

    // 질문에 연결된 모든 답변 삭제 (cascade delete)
    const deletedAnswersCount = await AnswerModel.deleteMany({
      question: questionId,
    });

    logger.info('질문 삭제 - 연결된 답변 삭제', {
      questionId,
      deletedAnswers: deletedAnswersCount.deletedCount,
    });

    // 질문 삭제
    await QuestionModel.findByIdAndDelete(questionId);

    // 매장의 questionCount 감소
    await StoreModel.findByIdAndUpdate(question.store, {
      $inc: { questionCount: -1 },
    });

    logger.info('질문 삭제', { questionId, userId });
  }
}
