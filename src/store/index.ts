import { configureStore } from '@reduxjs/toolkit'
import catalogFiltersReducer from './slices/catalogFiltersSlice'
import userReducer from './slices/userSlice'
import indexedTableSqlQueryReducer from './slices/indexedTableSqlQuerySlice'

/**
 * Redux Toolkit: catalogFilters (лаб.8), user, indexedTableSqlQuery (thunks + codegen).
 */
export const store = configureStore({
  reducer: {
    catalogFilters: catalogFiltersReducer,
    user: userReducer,
    indexedTableSqlQuery: indexedTableSqlQueryReducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
