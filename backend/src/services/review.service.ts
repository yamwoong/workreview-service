import { ReviewModel, IReview } from '../models/Review.model';
import { StoreModel } from '../models/Store.model';
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from '../utils/errors.util';
import { logger } from '../config/logger';
import type { FilterQuery } from 'mongoose';
import type {
  GetReviewsQuery,
  CreateReviewInput,
  UpdateReviewInput,
} from '../validators/review.validator';

/**
 * 리뷰 서비스 클래스
 * 리뷰 관련 비즈니스 로직 처리
 */
export class ReviewService {
  /**
   * 리뷰 목록 조회
   * @param query - 검색 쿼리 파라미터
   * @returns 리뷰 목록 및 페이지네이션 정보
   */
  static async getReviews(query: GetReviewsQuery): Promise<{
    reviews: IReview[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const {
      store,
      user,
      minRating,
      position,
      page = 1,
      limit = 20,
      sort = 'latest',
    } = query;

    // 필터 조건 구성
    const filter: FilterQuery<IReview> = {};

    if (store) {
      filter.store = store;
    }

    if (user) {
      filter.user = user;
    }

    if (minRating !== undefined) {
      filter.averageRating = { $gte: minRating };
    }

    if (position) {
      filter.position = new RegExp(position, 'i'); // Case-insensitive search
    }

    // 정렬 조건 구성
    let sortOption: Record<string, 1 | -1> = {};
    if (sort === 'latest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'rating') {
      sortOption = { averageRating: -1 };
    } else if (sort === 'helpful') {
      sortOption = { helpfulCount: -1 };
    }

    // 페이지네이션
    const skip = (page - 1) * limit;

    // 리뷰 조회
    const reviews = await ReviewModel.find(filter)
      .select(
        'store user reviewMode ratings averageRating wageType hourlyWage content workPeriod position pros cons isAnonymous helpfulCount createdAt updatedAt'
      )
      .populate('store', 'name address category googlePlaceId averageRating')
      .populate('user', 'name avatar trustScore')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    // 총 개수 조회
    const total = await ReviewModel.countDocuments(filter);

    logger.info('리뷰 목록 조회', {
      filter: JSON.stringify(filter),
      count: reviews.length,
      total,
    });

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 리뷰 상세 조회
   * @param reviewId - 리뷰 ID
   * @returns 리뷰 상세 정보
   * @throws {NotFoundError} 리뷰를 찾을 수 없는 경우
   */
  static async getReviewById(reviewId: string): Promise<IReview> {
    const review = await ReviewModel.findById(reviewId)
      .populate('store', 'name address category googlePlaceId averageRating averageWage')
      .populate('user', 'name avatar trustScore')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name avatar',
        },
      })
      .lean();

    if (!review) {
      throw new NotFoundError('리뷰를 찾을 수 없습니다');
    }

    logger.info('리뷰 상세 조회', {
      reviewId,
    });

    return review;
  }

  /**
   * 리뷰 작성
   * @param data - 리뷰 작성 데이터
   * @param userId - 작성자 ID
   * @returns 생성된 리뷰 정보
   * @throws {NotFoundError} 가게를 찾을 수 없는 경우
   * @throws {BadRequestError} 이미 리뷰를 작성한 경우
   */
  static async createReview(
    data: CreateReviewInput,
    userId: string
  ): Promise<IReview> {
    // 가게 존재 확인
    const store = await StoreModel.findById(data.store);
    if (!store) {
      throw new NotFoundError('가게를 찾을 수 없습니다');
    }

    // 중복 리뷰 체크 (한 user당 한 store에 하나만)
    const existingReview = await ReviewModel.findOne({
      user: userId,
      store: data.store,
    });

    if (existingReview) {
      logger.warn('리뷰 작성 실패 - 이미 리뷰 존재', {
        userId,
        storeId: data.store,
      });
      throw new BadRequestError('이미 이 가게에 리뷰를 작성하셨습니다');
    }

    // 리뷰 생성
    const review = await ReviewModel.create({
      ...data,
      user: userId,
    });

    logger.info('새 리뷰 작성 완료', {
      reviewId: review._id.toString(),
      userId,
      storeId: data.store,
      reviewMode: data.reviewMode,
    });

    // Populate하여 반환
    return await ReviewModel.findById(review._id)
      .populate('store', 'name address category')
      .populate('user', 'name avatar')
      .lean();
  }

  /**
   * 리뷰 수정
   * @param reviewId - 리뷰 ID
   * @param data - 수정할 데이터
   * @param userId - 요청 사용자 ID
   * @returns 수정된 리뷰 정보
   * @throws {NotFoundError} 리뷰를 찾을 수 없는 경우
   * @throws {ForbiddenError} 권한이 없는 경우
   */
  static async updateReview(
    reviewId: string,
    data: UpdateReviewInput,
    userId: string
  ): Promise<IReview> {
    const review = await ReviewModel.findById(reviewId);

    if (!review) {
      throw new NotFoundError('리뷰를 찾을 수 없습니다');
    }

    // 작성자만 수정 가능
    if (review.user.toString() !== userId) {
      throw new ForbiddenError('리뷰를 수정할 권한이 없습니다');
    }

    // 리뷰 업데이트
    Object.assign(review, data);
    await review.save();

    logger.info('리뷰 수정 완료', {
      reviewId,
      userId,
    });

    // Populate하여 반환
    return await ReviewModel.findById(reviewId)
      .populate('store', 'name address category')
      .populate('user', 'name avatar')
      .lean();
  }

  /**
   * 리뷰 삭제
   * @param reviewId - 리뷰 ID
   * @param userId - 요청 사용자 ID
   * @throws {NotFoundError} 리뷰를 찾을 수 없는 경우
   * @throws {ForbiddenError} 권한이 없는 경우
   */
  static async deleteReview(reviewId: string, userId: string): Promise<void> {
    const review = await ReviewModel.findById(reviewId);

    if (!review) {
      throw new NotFoundError('리뷰를 찾을 수 없습니다');
    }

    // 작성자만 삭제 가능
    if (review.user.toString() !== userId) {
      throw new ForbiddenError('리뷰를 삭제할 권한이 없습니다');
    }

    await review.deleteOne();

    logger.info('리뷰 삭제 완료', {
      reviewId,
      userId,
    });
  }

  /**
   * 도움됨 투표
   * @param reviewId - 리뷰 ID
   * @param helpful - 도움됨 여부 (true: 증가, false: 감소)
   * @returns 업데이트된 리뷰 정보
   * @throws {NotFoundError} 리뷰를 찾을 수 없는 경우
   */
  static async voteHelpful(
    reviewId: string,
    helpful: boolean
  ): Promise<IReview> {
    const review = await ReviewModel.findById(reviewId);

    if (!review) {
      throw new NotFoundError('리뷰를 찾을 수 없습니다');
    }

    // helpfulCount 증가/감소
    if (helpful) {
      review.helpfulCount += 1;
    } else {
      review.helpfulCount = Math.max(0, review.helpfulCount - 1);
    }

    await review.save();

    logger.info('도움됨 투표', {
      reviewId,
      helpful,
      newCount: review.helpfulCount,
    });

    return review;
  }
}
