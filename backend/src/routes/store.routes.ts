import { Router } from 'express';
import { StoreController } from '../controllers/store.controller';
import { authenticate } from '../middlewares/auth.middleware';
import {
  validateRequest,
  validateQuery,
} from '../middlewares/validation.middleware';
import {
  getStoresQuerySchema,
  createStoreSchema,
  updateStoreSchema,
  createStoreFromPlaceSchema,
} from '../validators/store.validator';

const router = Router();

/**
 * 가게 목록 조회
 * GET /api/stores
 */
router.get(
  '/',
  validateQuery(getStoresQuerySchema),
  StoreController.getStores
);

/**
 * Google Place ID로 가게 존재 여부 확인
 * GET /api/stores/check-place/:placeId
 */
router.get('/check-place/:placeId', StoreController.checkStoreByPlaceId);

/**
 * 가게 상세 조회
 * GET /api/stores/:id
 */
router.get('/:id', StoreController.getStoreById);

/**
 * 가게 등록
 * POST /api/stores
 * 🔒 Requires Authentication
 */
router.post(
  '/',
  authenticate,
  validateRequest(createStoreSchema),
  StoreController.createStore
);

/**
 * Google Place ID로 가게 조회 또는 생성
 * POST /api/stores/from-place
 * 🔒 Requires Authentication
 */
router.post(
  '/from-place',
  authenticate,
  validateRequest(createStoreFromPlaceSchema),
  StoreController.createStoreFromPlace
);

/**
 * 가게 수정
 * PATCH /api/stores/:id
 * 🔒 Requires Authentication
 */
router.patch(
  '/:id',
  authenticate,
  validateRequest(updateStoreSchema),
  StoreController.updateStore
);

/**
 * 가게 삭제
 * DELETE /api/stores/:id
 * 🔒 Requires Authentication
 */
router.delete('/:id', authenticate, StoreController.deleteStore);

export default router;
