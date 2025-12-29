import type { Request, Response, NextFunction } from 'express';
import { QuestionService } from '../services/question.service';
import { asyncHandler } from '../utils/asyncHandler.util';
import type { AuthRequest } from '../types/express';
import type { GetQuestionsQuery } from '../validators/question.validator';

/**
 * Question 컨트롤러
 * 질문 관련 요청 처리
 */
export class QuestionController {
  /**
   * 특정 매장의 질문 목록 조회
   * GET /api/stores/:storeId/questions
   */
  static getQuestions = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { storeId } = req.params;
      const query = req.query;

      const result = await QuestionService.getQuestionsByStore(
        storeId,
        query as unknown as GetQuestionsQuery
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  /**
   * 질문 상세 조회
   * GET /api/questions/:questionId
   */
  static getQuestion = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { questionId } = req.params;

      const question = await QuestionService.getQuestionById(questionId);

      res.status(200).json({
        success: true,
        data: question,
      });
    }
  );

  /**
   * 질문 생성
   * POST /api/stores/:storeId/questions
   */
  static createQuestion = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const { storeId } = req.params;
      const userId = req.user!.id;
      const input = req.body;

      const question = await QuestionService.createQuestion(
        storeId,
        userId,
        input
      );

      res.status(201).json({
        success: true,
        data: question,
        message: '질문이 생성되었습니다',
      });
    }
  );

  /**
   * 질문 수정
   * PUT /api/questions/:questionId
   */
  static updateQuestion = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const { questionId } = req.params;
      const userId = req.user!.id;
      const input = req.body;

      const question = await QuestionService.updateQuestion(
        questionId,
        userId,
        input
      );

      res.status(200).json({
        success: true,
        data: question,
        message: '질문이 수정되었습니다',
      });
    }
  );

  /**
   * 질문 삭제
   * DELETE /api/questions/:questionId
   */
  static deleteQuestion = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const { questionId } = req.params;
      const userId = req.user!.id;

      await QuestionService.deleteQuestion(questionId, userId);

      res.status(200).json({
        success: true,
        message: '질문이 삭제되었습니다',
      });
    }
  );
}
