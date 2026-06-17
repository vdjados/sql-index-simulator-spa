import { useEffect, useMemo, useState } from 'react'
import { CartIcon } from '../components/CartIcon'
import { CatalogFilters } from '../components/CatalogFilters'
import { IndexedTableCard } from '../components/IndexedTableCard'
import { envConfig } from '../config/env'
import { axiosFetchPublicCart, axiosFetchServices } from '../modules/servicesAxios'
import { fallbackServices } from '../api/fallback'
import { useServiceImageSearch } from '../hooks/useServiceImageSearch'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setCatalogFilters } from '../store/slices/catalogFiltersSlice'
import type { ApiService } from '../api/client'

/** Каталог: услуги через axios; фильтр — Redux (лаб. 8). */
export function CatalogPage() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((s) => s.catalogFilters)
  const [cartCount, setCartCount] = useState(0)
  const [items, setItems] = useState<ApiService[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'fallback' | 'mock'>('idle')

  const filter = filters.nameQuery.trim()
  const { items: ranked, ready, searchByImage, resetSearch, imageEmbedding } =
    useServiceImageSearch(items, { threshold: 0.4, topK: 12 })
  const visible = useMemo(() => ranked.filter((x) => x.isVisible), [ranked])

  useEffect(() => {
    if (envConfig.guestOnly || envConfig.useMock) {
      setCartCount(0)
      return
    }
    let cancelled = false
    axiosFetchPublicCart()
      .then((c) => {
        if (cancelled) return
        setCartCount(c.count)
      })
      .catch(() => {
        if (cancelled) return
        setCartCount(0)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    if (envConfig.useMock) {
      const fb = fallbackServices(filter)
      setItems(fb)
      setStatus('mock')
      return
    }
    axiosFetchServices({ filter })
      .then((list) => {
        if (cancelled) return
        setItems(list)
        setStatus('ok')
      })
      .catch(() => {
        if (cancelled) return
        setItems(fallbackServices(filter))
        setStatus('fallback')
      })
    return () => {
      cancelled = true
    }
  }, [filter])

  return (
    <>
      <section className="search-section">
        <CatalogFilters
          filters={filters}
          onChange={(next) => dispatch(setCatalogFilters(next))}
          onImageUpload={(file) => searchByImage(file)}
          onResetImageSearch={() => resetSearch()}
          ready={ready}
        />
        {!envConfig.guestOnly ? <CartIcon guestCount={cartCount} /> : null}
      </section>

      {status === 'mock' && (
        <p className="ui-hint ui-hint--mock">
          Режим GitHub Pages: mock-данные (VITE_USE_MOCK=true), бэкенд не вызывается.
        </p>
      )}
      {envConfig.guestOnly && status === 'ok' ? (
        <p className="ui-hint ui-hint--mock">
          Tauri → API: <strong>{envConfig.apiBaseUrl}</strong>
        </p>
      ) : null}
      {status === 'fallback' && (
        <p className="ui-hint ui-hint--mock">
          Бэкенд недоступен по адресу <strong>{envConfig.apiBaseUrl}</strong> — показаны mock-данные.
          Перезапустите Go после правки CORS и пересоберите Tauri (<code>npm run lab8:ip</code>,{' '}
          <code>npm run tauri:build</code>).
        </p>
      )}

      <p className="ui-hint catalog-layout-hint" aria-live="polite">
        Сетка: <strong>3</strong> колонки (&gt;992px), <strong>2</strong> (641–992px), <strong>1</strong> (≤640px).
        Сейчас карточек: {visible.length}.
      </p>

      <section className="cards-grid">
        {visible.map((item) => (
          <IndexedTableCard
            key={item.id}
            item={item}
            imageSimilarity={imageEmbedding ? item.score : undefined}
          />
        ))}
      </section>
      {visible.length === 0 && (
        <p style={{ color: '#7f8c8d', marginTop: 16 }}>Ничего не найдено — измените фильтры.</p>
      )}
    </>
  )
}
