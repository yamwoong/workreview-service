import type { Request, Response, NextFunction } from 'express';
import { AnswerService } from '../services/answer.service';
import { asyncHandler } from '../utils/asyncHandler.util';
import type { AuthRequest } from '../types/express';
import type { GetAnswersQuery } from '../validators/answer.validator';

/**
 * Answer 컨트롤러
 * 답변 관련 요청 처리
 */
export class AnswerController {
  /**
   * 특정 질문의 답변 목록 조회
   * GET /api/questions/:questionId/answers
   */
  static getAnswers = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { questionId } = req.params;
      const query = req.query;

      const result = await AnswerService.getAnswersByQuestion(
        questionId,
        query as unknown as GetAnswersQuery
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  /**
   * 답변 생성
   * POST /api/questions/:questionId/answers
   */
  static createAnswer = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const { questionId } = req.params;
      const userId = req.user!.id;
      const input = req.body;

      const answer = await AnswerService.createAnswer(
        questionId,
        userId,
        input
      );

      res.status(201).json({
        success: true,
        data: answer,
        message: req.t('answer.createSuccess'),
      });
    }
  );

  /**
   * 답변 수정
   * PUT /api/answers/:answerId
   */
  static updateAnswer = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const { answerId } = req.params;
      const userId = req.user!.id;
      const input = req.body;

      const answer = await AnswerService.updateAnswer(answerId, userId, input);

      res.status(200).json({
        success: true,
        data: answer,
        message: req.t('answer.updateSuccess'),
      });
    }
  );

  /**
   * 답변 삭제
   * DELETE /api/answers/:answerId
   */
  static deleteAnswer = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const { answerId } = req.params;
      const userId = req.user!.id;

      await AnswerService.deleteAnswer(answerId, userId);

      res.status(200).json({
        success: true,
        message: req.t('answer.deleteSuccess'),
      });
    }
  );

  /**
   * Best Answer 설정/해제
   * PATCH /api/answers/:answerId/best
   */
  static setBestAnswer = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const { answerId } = req.params;
      const userId = req.user!.id;
      const input = req.body;

      const answer = await AnswerService.setBestAnswer(
        answerId,
        userId,
        input
      );

      res.status(200).json({
        success: true,
        data: answer,
        message: req.t('answer.bestAnswerSet'),
      });
    }
  );

  /**
   * 답변 좋아요
   * POST /api/answers/:answerId/like
   */
  static likeAnswer = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { answerId } = req.params;

      const answer = await AnswerService.likeAnswer(answerId);

      res.status(200).json({
        success: true,
        data: answer,
        message: req.t('answer.likeSuccess'),
      });
    }
  );
}
