export const DEFAULT_API_BASE_URL = 'http://localhost:3001';

export const normalizeApiBaseUrl = (value) => {
  const normalized = String(value || '').trim();
  return normalized ? normalized.replace(/\/+$/, '') : '';
};

// Keep one canonical frontend source for the backend origin so REST and SSE stay aligned.
export const getApiBaseUrl = (env = import.meta.env) =>
  normalizeApiBaseUrl(env?.VITE_API_URL) || DEFAULT_API_BASE_URL;

export const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;
