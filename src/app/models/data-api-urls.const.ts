/** Endpoints del servidor de datos local (scripts/data-server.mjs), accesibles vía el proxy de ng serve. */
export const DATA_API_URLS = {
  CHECK: '/api/data/check',
  REFRESH: '/api/data/refresh',
} as const;
