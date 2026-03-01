import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeAPI } from '@/api/store.api';
import type {
  GetStoresParams,
  CreateStoreFromPlaceRequest
} from '@/types/store.types';

/**
 * Query key factory for stores
 */
export const storeKeys = {
  all: ['stores'] as const,
  lists: () => [...storeKeys.all, 'list'] as const,
  list: (params: GetStoresParams) => [...storeKeys.lists(), params] as const,
  details: () => [...storeKeys.all, 'detail'] as const,
  detail: (id: string) => [...storeKeys.details(), id] as const
};

/**
 * Hook to get list of stores with filters and pagination
 */
export const useStores = (params: GetStoresParams = {}) => {
  return useQuery({
    queryKey: storeKeys.list(params),
    queryFn: () => storeAPI.getStores(params),
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};

/**
 * Hook to get single store details
 */
export const useStore = (id: string) => {
  return useQuery({
    queryKey: storeKeys.detail(id),
    queryFn: () => storeAPI.getStore(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};

/**
 * Hook to create store from Google Place ID
 */
export const useCreateStoreFromPlace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStoreFromPlaceRequest) =>
      storeAPI.createStoreFromPlace(data),
    onSuccess: () => {
      // Invalidate all store lists to refetch
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
    }
  });
};
