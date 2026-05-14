import api from '../utils/api';
import useCachedResource from './useCachedResource';
import { prefetchCachedResource } from '../utils/publicCatalogCache';

const PUBLIC_STALE_TIME = 10 * 60 * 1000;
const PUBLIC_REVALIDATE_TIME = 60 * 1000;
const PUBLIC_CACHE_TIME = 60 * 60 * 1000;
const EMPTY_COLLECTION = [];

export const PUBLIC_SERVICES_CACHE_KEY = 'public-services';
export const PUBLIC_BARBERS_CACHE_KEY = 'public-barbers';
const getServiceBarbersCacheKey = (serviceId) => `public-barbers:${serviceId}`;

const normalizeArrayResponse = (payload) => (Array.isArray(payload) ? payload : []);

const fetchPublicServices = async () => {
  const response = await api.get('/services');
  return normalizeArrayResponse(response.data);
};

const fetchPublicBarbers = async () => {
  const response = await api.get('/barbers');
  return normalizeArrayResponse(response.data);
};

const fetchBarbersByService = async (serviceId) => {
  const response = await api.get(`/barbers?serviceId=${serviceId}`);
  return normalizeArrayResponse(response.data);
};

export const usePublicServices = () =>
  useCachedResource({
    cacheKey: PUBLIC_SERVICES_CACHE_KEY,
    fetcher: fetchPublicServices,
    staleTime: PUBLIC_STALE_TIME,
    revalidateTime: PUBLIC_REVALIDATE_TIME,
    cacheTime: PUBLIC_CACHE_TIME,
    initialData: EMPTY_COLLECTION,
  });

export const usePublicBarbers = () =>
  useCachedResource({
    cacheKey: PUBLIC_BARBERS_CACHE_KEY,
    fetcher: fetchPublicBarbers,
    staleTime: PUBLIC_STALE_TIME,
    revalidateTime: PUBLIC_REVALIDATE_TIME,
    cacheTime: PUBLIC_CACHE_TIME,
    initialData: EMPTY_COLLECTION,
  });

export const usePublicBarbersByService = (serviceId) =>
  useCachedResource({
    cacheKey: getServiceBarbersCacheKey(serviceId),
    fetcher: () => fetchBarbersByService(serviceId),
    enabled: Boolean(serviceId),
    staleTime: PUBLIC_STALE_TIME,
    revalidateTime: PUBLIC_REVALIDATE_TIME,
    cacheTime: PUBLIC_CACHE_TIME,
    initialData: EMPTY_COLLECTION,
  });

// Keep public catalog caching isolated here so swapping providers later stays low-risk.
export const prefetchPublicHomepageData = async () =>
  Promise.allSettled([
    prefetchCachedResource({
      cacheKey: PUBLIC_SERVICES_CACHE_KEY,
      fetcher: fetchPublicServices,
      staleTime: PUBLIC_STALE_TIME,
      cacheTime: PUBLIC_CACHE_TIME,
    }),
    prefetchCachedResource({
      cacheKey: PUBLIC_BARBERS_CACHE_KEY,
      fetcher: fetchPublicBarbers,
      staleTime: PUBLIC_STALE_TIME,
      cacheTime: PUBLIC_CACHE_TIME,
    }),
  ]);

export const prefetchPublicBookingData = async () =>
  Promise.allSettled([
    prefetchCachedResource({
      cacheKey: PUBLIC_SERVICES_CACHE_KEY,
      fetcher: fetchPublicServices,
      staleTime: PUBLIC_STALE_TIME,
      cacheTime: PUBLIC_CACHE_TIME,
    }),
    prefetchCachedResource({
      cacheKey: PUBLIC_BARBERS_CACHE_KEY,
      fetcher: fetchPublicBarbers,
      staleTime: PUBLIC_STALE_TIME,
      cacheTime: PUBLIC_CACHE_TIME,
    }),
  ]);
