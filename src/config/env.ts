/** Локальная конфигурация сборки (без git): задаётся в `.env.*` / `--mode`. */
export const envConfig = {
  /** GitHub Pages: только mock, без бэкенда */
  useMock: import.meta.env.VITE_USE_MOCK === 'true',
  /** Tauri: только каталог + карточка услуги (гость) */
  guestOnly: import.meta.env.VITE_GUEST_ONLY === 'true',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  /** Для Tauri: прямой MinIO, напр. http://192.168.1.10:9000 */
  mediaBaseUrl: import.meta.env.VITE_MEDIA_BASE_URL ?? '',
} as const
