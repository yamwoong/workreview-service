import { StoreModel } from '../models/Store.model';
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from '../utils/errors.util';
import { logger } from '../config/logger';
import type {
  GetStoresQuery,
  CreateStoreInput,
  UpdateStoreInput,
} from '../validators/store.validator';

/**
 * 가게 서비스 클래스
 * 가게 관련 비즈니스 로직 처리
 */
export class StoreService {
  /**
   * 가게 목록 조회 (지도 기반 검색)
   * @param query - 검색 쿼리 파라미터
   * @returns 가게 목록 및 페이지네이션 정보
   */
  static async getStores(query: GetStoresQuery): Promise<{
    stores: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const {
      lat,
      lng,
      radius = 5000,
      category,
      search,
      page = 1,
      limit = 20,
      sort,
    } = query;

    // 필터 조건 구성
    const filter: any = {};

    // 지리공간 검색 (lat, lng가 있을 때)
    if (lat !== undefined && lng !== undefined) {
      filter.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat], // [경도, 위도]
          },
          $maxDistance: radius, // 미터 단위
        },
      };
    }

    // 카테고리 필터
    if (category) {
      filter.category = category;
    }

    // 텍스트 검색 (가게명/주소)
    if (search) {
      filter.$text = { $search: search };
    }

    // 정렬 조건 구성
    let sortOption: any = {};
    if (sort === 'rating') {
      sortOption = { 'averageRating.overall': -1 };
    } else if (sort === 'reviewCount') {
      sortOption = { reviewCount: -1 };
    } else if (sort === 'createdAt') {
      sortOption = { createdAt: -1 };
    }
    // 지리공간 검색 시에는 거리순으로 자동 정렬되므로 sortOption 무시

    // 페이지네이션
    const skip = (page - 1) * limit;

    // 가게 조회
    const stores = await StoreModel.find(filter)
      .select(
        'googlePlaceId name address location category phone averageRating averageWage reviewCount createdAt'
      )
      .sort(lat !== undefined && lng !== undefined ? {} : sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    // 총 개수 조회
    const total = await StoreModel.countDocuments(filter);

    logger.info('가게 목록 조회', {
      filter: JSON.stringify(filter),
      count: stores.length,
      total,
    });

    return {
      stores,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 가게 상세 조회
   * @param storeId - 가게 ID
   * @returns 가게 상세 정보
   * @throws {NotFoundError} 가게를 찾을 수 없는 경우
   */
  static async getStoreById(storeId: string): Promise<any> {
    const store = await StoreModel.findById(storeId)
      .populate('createdBy', 'name email avatar')
      .lean();

    if (!store) {
      throw new NotFoundError('가게를 찾을 수 없습니다');
    }

    logger.info('가게 상세 조회', {
      storeId,
    });

    return store;
  }

  /**
   * 가게 등록
   * @param data - 가게 등록 데이터
   * @param userId - 등록자 ID
   * @returns 생성된 가게 정보
   */
  static async createStore(
    data: CreateStoreInput,
    userId: string
  ): Promise<any> {
    // Google Place ID 중복 체크
    if (data.googlePlaceId) {
      const existingStoreByPlaceId = await StoreModel.findOne({
        googlePlaceId: data.googlePlaceId,
      });

      if (existingStoreByPlaceId) {
        logger.warn('가게 등록 실패 - 동일 Google Place ID 존재', {
          userId,
          googlePlaceId: data.googlePlaceId,
        });
        throw new BadRequestError(
          '해당 Google Place ID로 이미 가게가 등록되어 있습니다'
        );
      }
    }

    // 동일 위치에 이미 가게가 있는지 확인 (반경 10m 이내)
    const existingStore = await StoreModel.findOne({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: data.location.coordinates,
          },
          $maxDistance: 10, // 10미터
        },
      },
    });

    if (existingStore) {
      logger.warn('가게 등록 실패 - 동일 위치에 이미 가게 존재', {
        userId,
        location: data.location.coordinates,
      });
      throw new BadRequestError('해당 위치에 이미 가게가 등록되어 있습니다');
    }

    // 가게 생성
    const store = await StoreModel.create({
      ...data,
      createdBy: userId,
    });

    logger.info('새 가게 등록 완료', {
      storeId: store._id.toString(),
      userId,
      name: store.name,
    });

    return store;
  }

  /**
   * 가게 수정
   * @param storeId - 가게 ID
   * @param data - 수정할 데이터
   * @param userId - 요청 사용자 ID
   * @returns 수정된 가게 정보
   * @throws {NotFoundError} 가게를 찾을 수 없는 경우
   * @throws {ForbiddenError} 권한이 없는 경우
   */
  static async updateStore(
    storeId: string,
    data: UpdateStoreInput,
    userId: string
  ): Promise<any> {
    const store = await StoreModel.findById(storeId);

    if (!store) {
      throw new NotFoundError('가게를 찾을 수 없습니다');
    }

    // 등록자만 수정 가능 (관리자 권한은 controller에서 처리)
    if (store.createdBy.toString() !== userId) {
      throw new ForbiddenError('가게를 수정할 권한이 없습니다');
    }

    // Google Place ID가 변경되는 경우 중복 체크
    if (data.googlePlaceId && data.googlePlaceId !== store.googlePlaceId) {
      const existingStoreByPlaceId = await StoreModel.findOne({
        googlePlaceId: data.googlePlaceId,
      });

      if (existingStoreByPlaceId) {
        logger.warn('가게 수정 실패 - 동일 Google Place ID 존재', {
          userId,
          googlePlaceId: data.googlePlaceId,
        });
        throw new BadRequestError(
          '해당 Google Place ID로 이미 가게가 등록되어 있습니다'
        );
      }
    }

    // 위치가 변경되는 경우 동일 위치 체크
    if (data.location) {
      const existingStore = await StoreModel.findOne({
        _id: { $ne: storeId }, // 자기 자신 제외
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: data.location.coordinates,
            },
            $maxDistance: 10, // 10미터
          },
        },
      });

      if (existingStore) {
        throw new BadRequestError('해당 위치에 이미 가게가 등록되어 있습니다');
      }
    }

    // 가게 업데이트
    Object.assign(store, data);
    await store.save();

    logger.info('가게 정보 수정 완료', {
      storeId,
      userId,
    });

    return store;
  }

  /**
   * 가게 삭제
   * @param storeId - 가게 ID
   * @param userId - 요청 사용자 ID
   * @throws {NotFoundError} 가게를 찾을 수 없는 경우
   * @throws {ForbiddenError} 권한이 없는 경우
   */
  static async deleteStore(storeId: string, userId: string): Promise<void> {
    const store = await StoreModel.findById(storeId);

    if (!store) {
      throw new NotFoundError('가게를 찾을 수 없습니다');
    }

    // 등록자만 삭제 가능 (관리자 권한은 controller에서 처리)
    if (store.createdBy.toString() !== userId) {
      throw new ForbiddenError('가게를 삭제할 권한이 없습니다');
    }

    await store.deleteOne();

    logger.info('가게 삭제 완료', {
      storeId,
      userId,
    });
  }
}
