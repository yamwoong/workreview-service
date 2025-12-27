import { AxiosError } from 'axios';
import client from './client';
import type {
  GetStoresParams,
  GetStoresResponse,
  GetStoreResponse,
  CreateStoreFromPlaceRequest,
  CreateStoreFromPlaceResponse,
  IStore
} from '@/types/store.types';

const handleRequestError = (error: unknown): never => {
  if (error instanceof AxiosError) {
    if (error.response?.data) {
      throw error.response.data;
    }

    throw new Error(error.message);
  }

  throw error;
};

/**
 * Get list of stores with filters
 */
export const getStores = async (params: GetStoresParams): Promise<GetStoresResponse> => {
  try {
    const response = await client.get<GetStoresResponse>('/stores', { params });
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

/**
 * Get store details by ID
 */
export const getStore = async (id: string): Promise<IStore> => {
  try {
    const response = await client.get<GetStoreResponse>(`/stores/${id}`);
    return response.data.data;
  } catch (error) {
    handleRequestError(error);
  }
};

/**
 * Create or get store from Google Place ID
 */
export const createStoreFromPlace = async (
  data: CreateStoreFromPlaceRequest
): Promise<IStore> => {
  try {
    const response = await client.post<CreateStoreFromPlaceResponse>(
      '/stores/from-place',
      data
    );
    return response.data.data;
  } catch (error) {
    handleRequestError(error);
  }
};

/**
 * Check if store exists by Google Place ID
 */
export const checkStoreByPlaceId = async (placeId: string): Promise<{
  exists: boolean;
  storeId: string | null;
  store: IStore | null;
}> => {
  try {
    const response = await client.get<{
      success: boolean;
      data: {
        exists: boolean;
        storeId: string | null;
        store: IStore | null;
      };
    }>(`/stores/check-place/${placeId}`);
    return response.data.data;
  } catch (error) {
    handleRequestError(error);
  }
};

export const storeAPI = {
  getStores,
  getStore,
  createStoreFromPlace,
  checkStoreByPlaceId
};
