/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_BASE_PATH: string
  readonly VITE_USE_MOCK: string
  readonly VITE_GUEST_ONLY: string
  readonly VITE_MEDIA_BASE_URL: string
  readonly VITE_HTTPS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
