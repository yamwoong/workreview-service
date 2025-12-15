import { z } from 'zod';

/**
 * 카테고리 enum
 */
const storeCategories = [
  'cafe',
  'restaurant',
  'convenience',
  'retail',
  'service',
  'education',
  'entertainment',
  'other',
] as const;

/**
 * 가게 목록 조회 쿼리 스키마
 */
export const getStoresQuerySchema = z.object({
  lat: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .refine(
      (val) => val === undefined || (val >= -90 && val <= 90),
      '위도는 -90과 90 사이여야 합니다'
    ),
  lng: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .refine(
      (val) => val === undefined || (val >= -180 && val <= 180),
      '경도는 -180과 180 사이여야 합니다'
    ),
  radius: z
    .string()
    .optional()
    .default('5000')
    .transform((val) => parseInt(val))
    .refine((val) => val > 0 && val <= 50000, '반경은 1~50000 사이여야 합니다'),
  category: z.enum(storeCategories).optional(),
  search: z.string().optional(),
  page: z
    .string()
    .optional()
    .default('1')
    .transform((val) => parseInt(val))
    .refine((val) => val > 0, '페이지는 1 이상이어야 합니다'),
  limit: z
    .string()
    .optional()
    .default('20')
    .transform((val) => parseInt(val))
    .refine(
      (val) => val > 0 && val <= 50,
      '페이지당 개수는 1~50 사이여야 합니다'
    ),
  sort: z.enum(['rating', 'reviewCount', 'createdAt']).optional(),
});

/**
 * 가게 등록 스키마
 */
export const createStoreSchema = z.object({
  googlePlaceId: z
    .string()
    .trim()
    .min(1, 'Google Place ID는 최소 1자 이상이어야 합니다')
    .optional(),
  name: z
    .string({
      required_error: '가게 이름은 필수입니다',
    })
    .min(2, '가게 이름은 최소 2자 이상이어야 합니다')
    .max(100, '가게 이름은 최대 100자까지 가능합니다')
    .trim(),
  address: z
    .string({
      required_error: '주소는 필수입니다',
    })
    .trim(),
  location: z.object({
    type: z.literal('Point'),
    coordinates: z
      .array(z.number())
      .length(2, '좌표는 [경도, 위도] 형식이어야 합니다')
      .refine(
        ([lng, lat]) => lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90,
        '유효하지 않은 좌표입니다'
      ),
  }),
  category: z.enum(storeCategories, {
    required_error: '업종은 필수입니다',
    invalid_type_error: '유효하지 않은 업종입니다',
  }),
  phone: z.string().trim().optional(),
});

/**
 * 가게 수정 스키마
 */
export const updateStoreSchema = z.object({
  googlePlaceId: z
    .string()
    .trim()
    .min(1, 'Google Place ID는 최소 1자 이상이어야 합니다')
    .optional(),
  name: z
    .string()
    .min(2, '가게 이름은 최소 2자 이상이어야 합니다')
    .max(100, '가게 이름은 최대 100자까지 가능합니다')
    .trim()
    .optional(),
  address: z.string().trim().optional(),
  location: z
    .object({
      type: z.literal('Point'),
      coordinates: z
        .array(z.number())
        .length(2, '좌표는 [경도, 위도] 형식이어야 합니다')
        .refine(
          ([lng, lat]) => lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90,
          '유효하지 않은 좌표입니다'
        ),
    })
    .optional(),
  category: z.enum(storeCategories).optional(),
  phone: z.string().trim().optional(),
});

/**
 * 타입 추론
 */
export type GetStoresQuery = z.infer<typeof getStoresQuerySchema>;
export type CreateStoreInput = z.infer<typeof createStoreSchema>;
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
