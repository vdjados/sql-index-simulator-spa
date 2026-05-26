import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import indexedTableSqlQueryReducer from './slices/indexedTableSqlQuerySlice'

/**
 * Redux Toolkit: user — sync reducers + axios в компонентах; indexedTableSqlQuery — thunks + codegen Api.
 * Middleware по умолчанию включает redux-thunk (только домен sql_query / м-м).
 */
export const store = configureStore({
  reducer: {
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
