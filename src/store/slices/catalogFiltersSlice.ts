import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {
  defaultFilters,
  type CatalogFiltersState,
} from '../../hooks/useFilteredIndexedTables'

/**
 * Лаб. 8: фильтр каталога в Redux — сохраняется при переходе «Подробнее» и назад.
 */
const catalogFiltersSlice = createSlice({
  name: 'catalogFilters',
  initialState: defaultFilters,
  reducers: {
    setCatalogFilters: (state, action: PayloadAction<Partial<CatalogFiltersState>>) => {
      Object.assign(state, action.payload)
    },
    resetCatalogFilters: () => defaultFilters,
  },
})

export const { setCatalogFilters, resetCatalogFilters } = catalogFiltersSlice.actions
export default catalogFiltersSlice.reducer
