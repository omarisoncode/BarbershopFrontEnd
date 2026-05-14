import { useCallback, useEffect, useRef, useState } from 'react';

import {
  fetchCachedResource,
  getCachedResource,
  isCachedResourceStale,
} from '../utils/publicCatalogCache';

const getInitialCachedEntry = (enabled, cacheKey, cacheTime) =>
  enabled ? getCachedResource(cacheKey, { cacheTime }) : null;

export default function useCachedResource({
  cacheKey,
  fetcher,
  enabled = true,
  staleTime = 0,
  revalidateTime = 0,
  cacheTime = 0,
  initialData = [],
}) {
  const mountedRef = useRef(true);
  const initialEntry = getInitialCachedEntry(enabled, cacheKey, cacheTime);

  const [data, setData] = useState(() => initialEntry?.data ?? initialData);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(() => initialEntry?.updatedAt ?? 0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(() => enabled && !initialEntry);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const syncFromCache = useCallback(() => {
    const cachedEntry = getCachedResource(cacheKey, { cacheTime });
    if (!cachedEntry) return null;

    if (mountedRef.current) {
      setData(cachedEntry.data);
      setLastUpdatedAt(cachedEntry.updatedAt);
      setIsLoading(false);
    }

    return cachedEntry;
  }, [cacheKey, cacheTime]);

  const refresh = useCallback(
    async ({ force = false } = {}) => {
      if (!enabled) return null;

      const cachedEntry = syncFromCache();
      const shouldBackgroundRefresh =
        !force &&
        Boolean(cachedEntry) &&
        Number(revalidateTime || 0) > 0 &&
        Date.now() - cachedEntry.updatedAt >= Number(revalidateTime || 0);
      const shouldFetch =
        force ||
        !cachedEntry ||
        isCachedResourceStale(cachedEntry, staleTime) ||
        shouldBackgroundRefresh;

      if (!shouldFetch) {
        return cachedEntry?.data ?? null;
      }

      if (cachedEntry) {
        if (mountedRef.current) {
          setIsRefreshing(true);
        }
      } else if (mountedRef.current) {
        setIsLoading(true);
      }

      try {
        const freshData = await fetchCachedResource({
          cacheKey,
          fetcher,
          cacheTime,
        });

        if (!mountedRef.current) return freshData;

        const latestEntry = syncFromCache();
        setError(null);
        setData(latestEntry?.data ?? freshData);
        setLastUpdatedAt(latestEntry?.updatedAt ?? Date.now());
        return freshData;
      } catch (requestError) {
        if (mountedRef.current) {
          setError(requestError);
        }
        return null;
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [cacheKey, cacheTime, enabled, fetcher, revalidateTime, staleTime, syncFromCache],
  );

  useEffect(() => {
    if (!enabled) {
      setData(initialData);
      setLastUpdatedAt(0);
      setError(null);
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    syncFromCache();
    void refresh();
  }, [enabled, initialData, refresh, syncFromCache]);

  const hasCachedData = lastUpdatedAt > 0;

  return {
    data,
    error,
    hasCachedData,
    isLoading,
    isRefreshing,
    lastUpdatedAt,
    refetch: () => refresh({ force: true }),
  };
}
