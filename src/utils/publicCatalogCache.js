// Version the public catalog cache so old persisted data can be invalidated safely
// when the caching strategy changes.
const STORAGE_PREFIX = 'the-cut:public-cache:v2:';
const memoryCache = new Map();
const inflightRequests = new Map();

const hasWindow = typeof window !== 'undefined';

const getStorageKey = (cacheKey) => `${STORAGE_PREFIX}${cacheKey}`;

const isEntryShapeValid = (entry) =>
  entry &&
  typeof entry === 'object' &&
  typeof entry.updatedAt === 'number' &&
  'data' in entry;

const readStorageEntry = (cacheKey) => {
  if (!hasWindow) return null;

  try {
    const raw = window.localStorage.getItem(getStorageKey(cacheKey));
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return isEntryShapeValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const writeStorageEntry = (cacheKey, entry) => {
  if (!hasWindow) return;

  try {
    window.localStorage.setItem(getStorageKey(cacheKey), JSON.stringify(entry));
  } catch {
    // Ignore storage quota/private mode failures and keep the in-memory cache alive.
  }
};

const deleteStorageEntry = (cacheKey) => {
  if (!hasWindow) return;

  try {
    window.localStorage.removeItem(getStorageKey(cacheKey));
  } catch {
    // Ignore storage cleanup failures.
  }
};

export const getCachedResource = (cacheKey, { cacheTime } = {}) => {
  const now = Date.now();
  const maxAge = Number(cacheTime) || 0;
  const cached = memoryCache.get(cacheKey) || readStorageEntry(cacheKey);

  if (!isEntryShapeValid(cached)) {
    return null;
  }

  if (maxAge > 0 && now - cached.updatedAt > maxAge) {
    memoryCache.delete(cacheKey);
    deleteStorageEntry(cacheKey);
    return null;
  }

  memoryCache.set(cacheKey, cached);
  return cached;
};

export const setCachedResource = (cacheKey, data) => {
  const entry = { data, updatedAt: Date.now() };
  memoryCache.set(cacheKey, entry);
  writeStorageEntry(cacheKey, entry);
  return entry;
};

export const isCachedResourceStale = (entry, staleTime) => {
  if (!isEntryShapeValid(entry)) return true;
  return Date.now() - entry.updatedAt >= Number(staleTime || 0);
};

export const fetchCachedResource = async ({ cacheKey, fetcher, cacheTime }) => {
  const currentRequest = inflightRequests.get(cacheKey);
  if (currentRequest) {
    return currentRequest;
  }

  const request = Promise.resolve()
    .then(fetcher)
    .then((data) => {
      setCachedResource(cacheKey, data);
      return getCachedResource(cacheKey, { cacheTime })?.data ?? data;
    })
    .finally(() => {
      inflightRequests.delete(cacheKey);
    });

  inflightRequests.set(cacheKey, request);
  return request;
};

export const prefetchCachedResource = async (options) => {
  try {
    await fetchCachedResource(options);
    return { status: 'fulfilled' };
  } catch (error) {
    return { status: 'rejected', reason: error };
  }
};
