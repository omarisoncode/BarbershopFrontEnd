import { useEffect, useMemo, useState } from 'react';

export const HOMEPAGE_FALLBACK_DELAY_MS = 2000;

export default function useHomepagePreviewCollection({
  data,
  error,
  isLoading,
  isRefreshing,
  hasCachedData,
  refetch,
  fallbackItems,
}) {
  const liveItems = useMemo(
    () => (Array.isArray(data) ? data.filter(Boolean) : []),
    [data],
  );
  const hasLiveItems = liveItems.length > 0;
  const [fallbackCycle, setFallbackCycle] = useState(0);
  const shouldDelayFallback = isLoading && !hasLiveItems && !hasCachedData && !error;

  useEffect(() => {
    if (!shouldDelayFallback) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setFallbackCycle((current) => current + 1);
    }, HOMEPAGE_FALLBACK_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [shouldDelayFallback]);

  const showFallback = shouldDelayFallback && fallbackCycle > 0;

  const state = useMemo(() => {
    if (hasLiveItems) return 'data';
    if (error) return 'error';
    if (showFallback) return 'fallback';
    if (isLoading) return 'loading';
    return 'empty';
  }, [error, hasLiveItems, isLoading, showFallback]);

  return {
    items: state === 'fallback' ? fallbackItems : liveItems,
    liveItems,
    state,
    refetch,
    isRefreshing,
    showRefreshing: isRefreshing && hasLiveDataForRefresh(liveItems),
    showCachedWarning: Boolean(error) && hasLiveItems,
  };
}

const hasLiveDataForRefresh = (items) => Array.isArray(items) && items.length > 0;
