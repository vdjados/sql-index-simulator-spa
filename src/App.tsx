import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { envConfig } from './config/env'
import { AppLayout } from './layout/AppLayout'
import { CatalogPage } from './pages/CatalogPage'
import { ServiceDetailPage } from './pages/ServiceDetailPage'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import { SqlQueriesListPage } from './pages/SqlQueriesListPage'
import { SqlQueryDetailPage } from './pages/SqlQueryDetailPage'
import { LegacySqlQueryDraftRedirect } from './pages/LegacySqlQueryDraftRedirect'
import { ROUTES } from './routePaths'

const routerBasename =
  import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '')

function FullAppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.CATALOG} element={<CatalogPage />} />
        <Route path={ROUTES.CATALOG_ALT} element={<CatalogPage />} />
        <Route path="/sql_query/draft" element={<LegacySqlQueryDraftRedirect />} />
        <Route path="/sql-query/:id" element={<SqlQueryDetailPage />} />
        <Route path={ROUTES.SQL_QUERIES} element={<SqlQueriesListPage />} />
        <Route path="/service/:id" element={<ServiceDetailPage />} />
        <Route path={ROUTES.SIGN_IN} element={<SignInPage />} />
        <Route path={ROUTES.SIGN_UP} element={<SignUpPage />} />
        <Route path="*" element={<Navigate to={ROUTES.CATALOG} replace />} />
      </Route>
    </Routes>
  )
}

/** Tauri / гость: каталог + карточка услуги (3-я «страница» — деталь). */
function GuestAppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.CATALOG} element={<CatalogPage />} />
        <Route path={ROUTES.CATALOG_ALT} element={<CatalogPage />} />
        <Route path="/service/:id" element={<ServiceDetailPage />} />
        <Route path="*" element={<Navigate to={ROUTES.CATALOG} replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <Router basename={routerBasename}>
      {envConfig.guestOnly ? <GuestAppRoutes /> : <FullAppRoutes />}
    </Router>
  )
}
