import { envConfig } from '../config/env'

/** В dev Vite проксирует `/media` на MinIO; в Tauri — VITE_MEDIA_BASE_URL. */
export function proxiedMediaUrl(url: string): string {
  const u = url?.trim()
  if (!u) return u
  if (u.startsWith('/') && envConfig.mediaBaseUrl) {
    const base = envConfig.mediaBaseUrl.replace(/\/$/, '')
    return `${base}${u}`
  }
  if (!import.meta.env.DEV) return u
  try {
    const parsed =
      u.startsWith('http://') || u.startsWith('https://')
        ? new URL(u)
        : new URL(u, window.location.origin)
    if (parsed.port === '9000') {
      return `/media${parsed.pathname}${parsed.search}`
    }
    if (envConfig.mediaBaseUrl && parsed.hostname !== window.location.hostname) {
      return u
    }
  } catch {
    return u
  }
  return u
}
