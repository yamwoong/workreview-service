import { Request, Response, NextFunction } from 'express';
import { StoreService } from '../services/store.service';
import { asyncHandler } from '../utils/asyncHandler.util';
import type {
  GetStoresQuery,
  CreateStoreInput,
  UpdateStoreInput,
  CreateStoreFromPlaceInput,
} from '../validators/store.validator';

/**
 * 가게 컨트롤러 클래스
 * 가게 관련 API 엔드포인트 처리
 */
export class StoreController {
  /**
   * 가게 목록 조회
   * @param req - Express Request 객체
   * @param res - Express Response 객체
   * @param next - Express NextFunction
   */
  static getStores = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const query = req.validatedQuery as GetStoresQuery;

      const result = await StoreService.getStores(query);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  /**
   * 가게 상세 조회
   * @param req - Express Request 객체
   * @param res - Express Response 객체
   * @param next - Express NextFunction
   */
  static getStoreById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { id } = req.params;

      const store = await StoreService.getStoreById(id);

      res.status(200).json({
        success: true,
        data: store,
      });
    }
  );

  /**
   * Google Place ID로 가게 존재 여부 확인
   * @param req - Express Request 객체
   * @param res - Express Response 객체
   * @param next - Express NextFunction
   */
  static checkStoreByPlaceId = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { placeId } = req.params;

      const store = await StoreService.findByPlaceId(placeId);

      res.status(200).json({
        success: true,
        data: {
          exists: !!store,
          storeId: store?._id || null,
          store: store || null,
        },
      });
    }
  );

  /**
   * 가게 등록
   * @param req - Express Request 객체
   * @param res - Express Response 객체
   * @param next - Express NextFunction
   */
  static createStore = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const data = req.validatedBody as CreateStoreInput;
      const userId = req.user!.id;

      const store = await StoreService.createStore(data, userId);

      res.status(201).json({
        success: true,
        data: store,
        message: req.t('store.createSuccess'),
      });
    }
  );

  /**
   * Google Place ID로 가게 조회 또는 생성
   * @param req - Express Request 객체
   * @param res - Express Response 객체
   * @param next - Express NextFunction
   */
  static createStoreFromPlace = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { placeId } = req.validatedBody as CreateStoreFromPlaceInput;
      const userId = req.user!.id;

      const store = await StoreService.getOrCreateFromPlaceId(placeId, userId);

      res.status(200).json({
        success: true,
        data: store,
        message: req.t('store.fetchSuccess'),
      });
    }
  );

  /**
   * 가게 수정
   * @param req - Express Request 객체
   * @param res - Express Response 객체
   * @param next - Express NextFunction
   */
  static updateStore = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { id } = req.params;
      const data = req.validatedBody as UpdateStoreInput;
      const userId = req.user!.id;

      const store = await StoreService.updateStore(id, data, userId);

      res.status(200).json({
        success: true,
        data: store,
        message: req.t('store.updateSuccess'),
      });
    }
  );

  /**
   * 가게 삭제
   * @param req - Express Request 객체
   * @param res - Express Response 객체
   * @param next - Express NextFunction
   */
  static deleteStore = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { id } = req.params;
      const userId = req.user!.id;

      await StoreService.deleteStore(id, userId);

      res.status(200).json({
        success: true,
        message: req.t('store.deleteSuccess'),
      });
    }
  );
}
