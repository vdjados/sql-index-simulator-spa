import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authLoginRequest, authRegisterRequest } from '../modules/authApi'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  applyAuthFailure,
  applyAuthSuccess,
  clearUserError,
  setAuthLoading,
} from '../store/slices/userSlice'
import { fetchIndexedTableSqlQueryCart } from '../store/slices/indexedTableSqlQuerySlice'
import { apiErrMessage } from '../store/utils/apiError'
import { ROUTES } from '../routePaths'

/** Регистрация: только axios; после register — login тем же axios. */
export function SignUpPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useAppSelector((s) => s.user)
  const [form, setForm] = useState({ email: '', name: '', password: '' })

  useEffect(() => {
    if (isAuthenticated) navigate(ROUTES.CATALOG, { replace: true })
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) return
    dispatch(clearUserError())
    dispatch(setAuthLoading(true))
    try {
      await authRegisterRequest(form)
      await authLoginRequest({ email: form.email, password: form.password })
      const label =
        form.name.trim() && form.name.trim() !== form.email
          ? `${form.name.trim()} (${form.email})`
          : form.email
      dispatch(applyAuthSuccess({ displayName: label }))
      void dispatch(fetchIndexedTableSqlQueryCart())
      navigate(ROUTES.CATALOG, { replace: true })
    } catch (err) {
      dispatch(applyAuthFailure(apiErrMessage(err)))
    }
  }

  return (
    <div className="auth-page-min">
      <h1 className="page-heading" style={{ marginBottom: '1rem' }}>
        Регистрация
      </h1>
      {error ? <div className="ui-error">{error}</div> : null}
      <form onSubmit={handleSubmit}>
        <label className="auth-page-min__label" htmlFor="signup-name">
          Имя
        </label>
        <input
          id="signup-name"
          className="search-input"
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          disabled={loading}
        />
        <label className="auth-page-min__label" htmlFor="signup-email">
          Email
        </label>
        <input
          id="signup-email"
          className="search-input"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          disabled={loading}
          autoComplete="email"
        />
        <label className="auth-page-min__label" htmlFor="signup-password">
          Пароль
        </label>
        <input
          id="signup-password"
          className="search-input"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          disabled={loading}
          autoComplete="new-password"
        />
        <button type="submit" className="search-btn" style={{ width: '100%', marginTop: 16 }} disabled={loading}>
          {loading ? (
            <span className="ui-loading-row">
              <span className="ui-spinner" aria-hidden="true" /> Регистрация…
            </span>
          ) : (
            'Создать аккаунт'
          )}
        </button>
      </form>
      <p style={{ marginTop: 16 }} className="ui-hint">
        Уже есть аккаунт? <Link to={ROUTES.SIGN_IN}>Вход</Link>
      </p>
    </div>
  )
}
