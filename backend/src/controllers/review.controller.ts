import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/review.service';
import { asyncHandler } from '../utils/asyncHandler.util';
import type {
  GetReviewsQuery,
  CreateReviewInput,
  UpdateReviewInput,
  VoteHelpfulInput,
} from '../validators/review.validator';

/**
 * 리뷰 컨트롤러 클래스
 * 리뷰 관련 API 엔드포인트 처리
 */
export class ReviewController {
  /**
   * 리뷰 목록 조회
   * @param req - Express Request 객체
   * @param res - Express Response 객체
   * @param next - Express NextFunction
   */
  static getReviews = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const query = req.validatedQuery as GetReviewsQuery;

      const result = await ReviewService.getReviews(query);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  /**
   * 리뷰 상세 조회
   * @param req - Express Request 객체
   * @param res - Express Response 객체
   * @param next - Express NextFunction
   */
  static getReviewById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { id } = req.params;

      const review = await ReviewService.getReviewById(id);

      res.status(200).json({
        success: true,
        data: review,
      });
    }
  );

  /**
   * 리뷰 작성
   * @param req - Express Request 객체
   * @param res - Express Response 객체
   * @param next - Express NextFunction
   */
  static createReview = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const data = req.validatedBody as CreateReviewInput;
      const userId = req.user!.id;

      const review = await ReviewService.createReview(data, userId);

      res.status(201).json({
        success: true,
        data: review,
        message: '리뷰가 작성되었습니다',
      });
    }
  );

  /**
   * 리뷰 수정
   * @param req - Express Request 객체
   * @param res - Express Response 객체
   * @param next - Express NextFunction
   */
  static updateReview = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { id } = req.params;
      const data = req.validatedBody as UpdateReviewInput;
      const userId = req.user!.id;

      const review = await ReviewService.updateReview(id, data, userId);

      res.status(200).json({
        success: true,
        data: review,
        message: '리뷰가 수정되었습니다',
      });
    }
  );

  /**
   * 리뷰 삭제
   * @param req - Express Request 객체
   * @param res - Express Response 객체
   * @param next - Express NextFunction
   */
  static deleteReview = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { id } = req.params;
      const userId = req.user!.id;

      await ReviewService.deleteReview(id, userId);

      res.status(200).json({
        success: true,
        message: '리뷰가 삭제되었습니다',
      });
    }
  );

  /**
   * 도움됨 투표
   * @param req - Express Request 객체
   * @param res - Express Response 객체
   * @param next - Express NextFunction
   */
  static voteHelpful = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { id } = req.params;
      const { helpful } = req.validatedBody as VoteHelpfulInput;

      const review = await ReviewService.voteHelpful(id, helpful);

      res.status(200).json({
        success: true,
        data: { helpfulCount: review.helpfulCount },
        message: helpful ? '도움됨으로 표시되었습니다' : '도움됨이 취소되었습니다',
      });
    }
  );

  /**
   * 리뷰 추천 (Like)
   * @param req - Express Request 객체
   * @param res - Express Response 객체
   * @param next - Express NextFunction
   */
  static likeReview = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { id } = req.params;
      const userId = req.user!.id;

      const review = await ReviewService.likeReview(id, userId);

      res.status(200).json({
        success: true,
        data: { likeCount: review.likeCount, dislikeCount: review.dislikeCount },
        message: '추천했습니다',
      });
    }
  );

  /**
   * 리뷰 비추천 (Dislike)
   * @param req - Express Request 객체
   * @param res - Express Response 객체
   * @param next - Express NextFunction
   */
  static dislikeReview = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { id } = req.params;
      const userId = req.user!.id;

      const review = await ReviewService.dislikeReview(id, userId);

      res.status(200).json({
        success: true,
        data: { likeCount: review.likeCount, dislikeCount: review.dislikeCount },
        message: '비추천했습니다',
      });
    }
  );
}
