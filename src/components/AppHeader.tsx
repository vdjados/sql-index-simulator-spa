import { useState, type MouseEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { authLogoutRequest } from '../modules/authApi'
import { envConfig } from '../config/env'
import { proxiedMediaUrl } from '../utils/proxiedMediaUrl'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { clearUserSession } from '../store/slices/userSlice'
import { ROUTES } from '../routePaths'

const LOGO_DEFAULT = 'http://localhost:9000/sql-index/logo.svg'

export function AppHeader() {
  const { pathname } = useLocation()
  const [logoOk, setLogoOk] = useState(true)
  const dispatch = useAppDispatch()
  const { isAuthenticated, displayName } = useAppSelector((s) => s.user)
  const cart = useAppSelector((s) => s.indexedTableSqlQuery.cart)
  const guestOnly = envConfig.guestOnly

  const headerClass = pathname.startsWith('/service/') ? 'header-secondary' : 'header-main'

  const draftReady = Boolean(!guestOnly && isAuthenticated && cart?.id != null)
  const draftTo = draftReady && cart?.id != null ? ROUTES.sqlQueryDetail(cart.id) : ROUTES.CATALOG

  const handleLogout = async (e: MouseEvent) => {
    e.preventDefault()
    try {
      await authLogoutRequest()
    } catch {
      void 0
    } finally {
      localStorage.removeItem('token')
      dispatch(clearUserSession())
    }
  }

  return (
    <header className={headerClass}>
      <Link to={ROUTES.CATALOG} className="header-logo">
        {logoOk ? (
          <img
            src={proxiedMediaUrl(LOGO_DEFAULT)}
            alt="SQL Index Simulator"
            onError={() => setLogoOk(false)}
          />
        ) : (
          <span className="header-title" style={{ fontSize: '1.5rem' }}>
            SQL
          </span>
        )}
        <span className="header-title">SQL Index Simulator</span>
      </Link>

      <div className="header-actions">
        <Link to={ROUTES.CATALOG} className="header-nav-link">
          Индексы (каталог)
        </Link>
        {!guestOnly && isAuthenticated ? (
          <Link to={ROUTES.SQL_QUERIES} className="header-nav-link">
            Заявки sql_query
          </Link>
        ) : null}
        {!guestOnly ? (
          draftReady ? (
            <Link to={draftTo} className="header-nav-link">
              Текущая sql_query (черновик)
            </Link>
          ) : (
            <span className="header-nav-link header-nav-link--muted">
              Текущая sql_query (черновик)
            </span>
          )
        ) : null}
        {!guestOnly && isAuthenticated ? (
          <span className="header-user-label">{displayName}</span>
        ) : null}
        {!guestOnly ? (
          isAuthenticated ? (
            <a href={ROUTES.CATALOG} className="header-nav-link" onClick={handleLogout}>
              Выход
            </a>
          ) : (
            <>
              <Link to={ROUTES.SIGN_IN} className="header-nav-link">
                Вход
              </Link>
              <Link to={ROUTES.SIGN_UP} className="header-nav-link">
                Регистрация
              </Link>
            </>
          )
        ) : (
          <span className="header-nav-link header-nav-link--muted" title="Режим Tauri: только гость">
            Гость (Tauri)
          </span>
        )}
      </div>
    </header>
  )
}
