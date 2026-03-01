import { ReviewModel, IReview } from '../models/Review.model';
import { StoreModel } from '../models/Store.model';
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from '../utils/errors.util';
import { logger } from '../config/logger';
import type { FilterQuery, Types } from 'mongoose';
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
   * 가게 통계 업데이트 (평점, 리뷰 수, 급여 통계)
   * @param storeId - 가게 ID
   */
  private static async updateStoreStats(storeId: string): Promise<void> {
    // 해당 가게의 모든 리뷰 조회 (평점과 급여 타입)
    const reviews = await ReviewModel.find({ store: storeId })
      .select('rating wageType')
      .lean();

    if (reviews.length === 0) {
      // 리뷰가 없으면 모든 통계 0으로 설정
      await StoreModel.findByIdAndUpdate(storeId, {
        averageRating: 0,
        reviewCount: 0,
        wageStats: {
          belowMinimum: 0,
          minimumWage: 0,
          aboveMinimum: 0,
          total: 0,
        },
      });
      return;
    }

    // 평균 평점 계산
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // 급여 타입 통계 계산
    const wageStats = {
      belowMinimum: 0,
      minimumWage: 0,
      aboveMinimum: 0,
      total: 0,
    };

    reviews.forEach((review) => {
      if (review.wageType) {
        wageStats.total++;
        if (review.wageType === 'below_minimum') wageStats.belowMinimum++;
        else if (review.wageType === 'minimum_wage') wageStats.minimumWage++;
        else if (review.wageType === 'above_minimum') wageStats.aboveMinimum++;
      }
    });

    // 가게 통계 업데이트
    await StoreModel.findByIdAndUpdate(storeId, {
      averageRating: Math.round(averageRating * 10) / 10, // 소수점 첫째자리까지
      reviewCount: reviews.length,
      wageStats,
    });

    logger.info('가게 통계 업데이트 완료', {
      storeId,
      averageRating,
      reviewCount: reviews.length,
      wageStats,
    });
  }

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
      filter.rating = { $gte: minRating };
    }

    if (position) {
      filter.position = new RegExp(position, 'i'); // Case-insensitive search
    }

    // 정렬 조건 구성
    let sortOption: Record<string, 1 | -1> = {};
    if (sort === 'latest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'helpful') {
      sortOption = { likeCount: -1 }; // Use likeCount (thumbs up) for "most helpful"
    }

    // 페이지네이션
    const skip = (page - 1) * limit;

    // 리뷰 조회
    const reviews = await ReviewModel.find(filter)
      .select(
        'store user reviewMode rating wageType hourlyWage content position isAnonymous helpfulCount likeCount dislikeCount createdAt updatedAt'
      )
      .populate('store', 'name address category googlePlaceId averageRating')
      .populate('user', 'username trustScore')
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
      .populate('user', 'username trustScore')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username',
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
    // storeId 또는 store 필드에서 실제 store ID 추출
    const dataWithStoreId = data as CreateReviewInput & { storeId?: string; store?: string };
    const storeId = dataWithStoreId.storeId || dataWithStoreId.store;

    // 가게 존재 확인
    const store = await StoreModel.findById(storeId);
    if (!store) {
      throw new NotFoundError('가게를 찾을 수 없습니다');
    }

    // 중복 리뷰 체크 (한 user당 한 store에 하나만)
    const existingReview = await ReviewModel.findOne({
      user: userId,
      store: storeId,
    });

    if (existingReview) {
      logger.warn('리뷰 작성 실패 - 이미 리뷰 존재', {
        userId,
        storeId,
      });
      throw new BadRequestError('이미 이 가게에 리뷰를 작성하셨습니다');
    }

    // 리뷰 생성 (store 필드로 통일)
    const review = await ReviewModel.create({
      ...data,
      store: storeId,
      user: userId,
    });

    logger.info('새 리뷰 작성 완료', {
      reviewId: review._id.toString(),
      userId,
      storeId: data.store,
      reviewMode: data.reviewMode,
    });

    // 가게 통계 업데이트
    await this.updateStoreStats(storeId);

    // Populate하여 반환
    return await ReviewModel.findById(review._id)
      .populate('store', 'name address category')
      .populate('user', 'username')
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

    // 가게 통계 업데이트 (평점이 변경되었을 수 있음)
    await this.updateStoreStats(review.store.toString());

    // Populate하여 반환
    return await ReviewModel.findById(reviewId)
      .populate('store', 'name address category')
      .populate('user', 'username')
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

    // 가게 ID 저장 (삭제 후 통계 업데이트에 사용)
    const storeId = review.store.toString();

    await review.deleteOne();

    logger.info('리뷰 삭제 완료', {
      reviewId,
      userId,
    });

    // 가게 통계 업데이트
    await this.updateStoreStats(storeId);
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

  /**
   * 리뷰 추천 (Like)
   * @param reviewId - 리뷰 ID
   * @param userId - 사용자 ID
   * @returns 업데이트된 리뷰 정보
   * @throws {NotFoundError} 리뷰를 찾을 수 없는 경우
   */
  static async likeReview(reviewId: string, userId: string): Promise<IReview> {
    const review = await ReviewModel.findById(reviewId);

    if (!review) {
      throw new NotFoundError('리뷰를 찾을 수 없습니다');
    }

    const userIdObj = userId;
    const hasLiked = review.likedBy.some((id) => id.toString() === userIdObj);
    const hasDisliked = review.dislikedBy.some((id) => id.toString() === userIdObj);

    if (hasLiked) {
      // 이미 추천했으면 취소
      review.likedBy = review.likedBy.filter((id) => id.toString() !== userIdObj);
      review.likeCount = Math.max(0, review.likeCount - 1);
      logger.info('리뷰 추천 취소', { reviewId, userId });
    } else {
      // 비추천했었으면 비추천 제거
      if (hasDisliked) {
        review.dislikedBy = review.dislikedBy.filter((id) => id.toString() !== userIdObj);
        review.dislikeCount = Math.max(0, review.dislikeCount - 1);
      }
      // 추천 추가
      review.likedBy.push(userIdObj as unknown as Types.ObjectId);
      review.likeCount += 1;
      logger.info('리뷰 추천', { reviewId, userId });
    }

    await review.save();

    return review;
  }

  /**
   * 리뷰 비추천 (Dislike)
   * @param reviewId - 리뷰 ID
   * @param userId - 사용자 ID
   * @returns 업데이트된 리뷰 정보
   * @throws {NotFoundError} 리뷰를 찾을 수 없는 경우
   */
  static async dislikeReview(reviewId: string, userId: string): Promise<IReview> {
    const review = await ReviewModel.findById(reviewId);

    if (!review) {
      throw new NotFoundError('리뷰를 찾을 수 없습니다');
    }

    const userIdObj = userId;
    const hasLiked = review.likedBy.some((id) => id.toString() === userIdObj);
    const hasDisliked = review.dislikedBy.some((id) => id.toString() === userIdObj);

    if (hasDisliked) {
      // 이미 비추천했으면 취소
      review.dislikedBy = review.dislikedBy.filter((id) => id.toString() !== userIdObj);
      review.dislikeCount = Math.max(0, review.dislikeCount - 1);
      logger.info('리뷰 비추천 취소', { reviewId, userId });
    } else {
      // 추천했었으면 추천 제거
      if (hasLiked) {
        review.likedBy = review.likedBy.filter((id) => id.toString() !== userIdObj);
        review.likeCount = Math.max(0, review.likeCount - 1);
      }
      // 비추천 추가
      review.dislikedBy.push(userIdObj as unknown as Types.ObjectId);
      review.dislikeCount += 1;
      logger.info('리뷰 비추천', { reviewId, userId });
    }

    await review.save();

    return review;
  }
}
