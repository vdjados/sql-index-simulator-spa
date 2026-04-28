import { useState } from 'react'
import { CartIcon } from '../components/CartIcon'
import { CatalogFilters } from '../components/CatalogFilters'
import { IndexedTableCard } from '../components/IndexedTableCard'
import {
  defaultFilters,
  useFilteredIndexedTables,
  type CatalogFiltersState,
} from '../hooks/useFilteredIndexedTables'
import { MOCK_INDEXED_TABLES } from '../mock/indexedTables'

/** Список как `services.html`: секция поиска + корзина, сетка `.cards-grid`, карточки из mock. */
interface CatalogPageProps {
  cartCount: number
}

export function CatalogPage(props: CatalogPageProps) {
  const { cartCount } = props
  const [filters, setFilters] = useState<CatalogFiltersState>(defaultFilters)
  const visible = useFilteredIndexedTables(MOCK_INDEXED_TABLES, filters)

  return (
    <>
      <section className="search-section">
        <CatalogFilters filters={filters} onChange={setFilters} />
        <CartIcon count={cartCount} />
      </section>

      <section className="cards-grid">
        {visible.map((item) => (
          <IndexedTableCard key={item.id} item={item} />
        ))}
      </section>
      {visible.length === 0 && (
        <p style={{ color: '#7f8c8d', marginTop: 16 }}>Ничего не найдено — измените фильтры.</p>
      )}
    </>
  )
}
