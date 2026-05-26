import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  fetchIndexedTableSqlQueriesListThunk,
  finishIndexedTableSqlQueryThunk,
  setIndexedTableSqlQueryListFilters,
} from '../store/slices/indexedTableSqlQuerySlice'
import { ROUTES } from '../routePaths'
import type { SqlQueryListRow } from '../store/slices/indexedTableSqlQuerySlice'

function statusLabel(s: string | undefined): string {
  const m: Record<string, string> = {
    draft: 'Черновик',
    formed: 'Сформирована',
    completed: 'Завершена',
    rejected: 'Отклонена',
    deleted: 'Удалена',
  }
  return s ? (m[s] ?? s) : '—'
}

function formatDate(s: string | undefined | null): string {
  if (!s) return '—'
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return s
  return d.toLocaleDateString()
}

export function SqlQueriesListPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, isModerator } = useAppSelector((s) => s.user)
  const { list, listLoading, listError, filters, itemMutationLoading } = useAppSelector(
    (s) => s.indexedTableSqlQuery,
  )
  const [creatorFilter, setCreatorFilter] = useState('')
  /** Поиск по краткому описанию задачи (индексы/SQL); на бэкенде хранится в поле ответа `theme`. */
  const [indexBriefFilter, setIndexBriefFilter] = useState('')
  const [draftFrom, setDraftFrom] = useState(filters.fromDate)
  const [draftTo, setDraftTo] = useState(filters.toDate)
  const [draftStatus, setDraftStatus] = useState(filters.status)

  useEffect(() => {
    setDraftFrom(filters.fromDate)
    setDraftTo(filters.toDate)
    setDraftStatus(filters.status)
  }, [filters.fromDate, filters.toDate, filters.status])

  const load = useCallback(() => {
    void dispatch(fetchIndexedTableSqlQueriesListThunk())
  }, [dispatch])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.SIGN_IN, { replace: true })
      return
    }
    load()
    const id = window.setInterval(load, 4000)
    return () => window.clearInterval(id)
  }, [isAuthenticated, navigate, load])

  const visible = useMemo(() => {
    let rows = list
    const creatorQ = creatorFilter.trim().toLowerCase()
    if (creatorQ) {
      rows = rows.filter((a) => (a.creator_login ?? '').toLowerCase().includes(creatorQ))
    }
    const briefQ = indexBriefFilter.trim().toLowerCase()
    if (briefQ) {
      rows = rows.filter((a) => (a.theme ?? '').toLowerCase().includes(briefQ))
    }
    return rows
  }, [list, creatorFilter, indexBriefFilter])

  const withNonemptyResults = useMemo(
    () => visible.filter((row) => (row.results_count ?? 0) > 0).length,
    [visible],
  )

  const handleApplyFilters = () => {
    dispatch(
      setIndexedTableSqlQueryListFilters({
        fromDate: draftFrom,
        toDate: draftTo,
        status: draftStatus,
      }),
    )
    void dispatch(fetchIndexedTableSqlQueriesListThunk())
  }

  const goDetail = (row: SqlQueryListRow) => {
    const id = row.id
    if (id == null) return
    navigate(ROUTES.sqlQueryDetail(id))
  }

  const busyFinish = (id: number) => Boolean(itemMutationLoading[`finish-${id}`])

  if (!isAuthenticated) return null

  return (
    <div className="sql-queries-page">
      <h1 className="page-heading">
        {isModerator ? 'Заявки sql_query (модератор)' : 'Мои заявки sql_query'}
      </h1>
      <p className="ui-hint">
        Список обновляется каждые 4 с (short polling). Фильтры по дате формирования и статусу уходят на бэкенд;
        по краткому описанию заявки про индексы и расчёт SQL и по создателю — на клиенте.
      </p>
      <p className="ui-hint" style={{ marginTop: 4 }}>
        Показано заявок: <strong>{visible.length}</strong>, с непустым количеством результатов:{' '}
        <strong>{withNonemptyResults}</strong>
      </p>

      <section className="filters-bar">
        <div className="ui-field">
          <span className="ui-label">С даты</span>
          <input
            type="date"
            className="search-input"
            value={draftFrom}
            onChange={(e) => setDraftFrom(e.target.value)}
          />
        </div>
        <div className="ui-field">
          <span className="ui-label">По дату</span>
          <input
            type="date"
            className="search-input"
            value={draftTo}
            onChange={(e) => setDraftTo(e.target.value)}
          />
        </div>
        <div className="ui-field">
          <span className="ui-label">Статус</span>
          <select
            className="ui-select"
            value={draftStatus}
            onChange={(e) => setDraftStatus(e.target.value)}
          >
            <option value="">Все</option>
            <option value="formed">Сформирована</option>
            <option value="completed">Завершена</option>
            <option value="rejected">Отклонена</option>
          </select>
        </div>
        <div className="ui-field" style={{ minWidth: 240 }}>
          <span className="ui-label">По задаче (индексы, SQL) — клиент</span>
          <input
            type="text"
            className="search-input"
            value={indexBriefFilter}
            onChange={(e) => setIndexBriefFilter(e.target.value)}
            placeholder="напр. clustered, hash, время плана"
            title="Ищет подстроку в том, что вы ввели как краткое описание заявки (индексы, таблица, цель расчёта)"
            autoComplete="off"
          />
        </div>
        {isModerator ? (
          <div className="ui-field" style={{ minWidth: 200 }}>
            <span className="ui-label">Создатель (на клиенте)</span>
            <input
              type="text"
              className="search-input"
              value={creatorFilter}
              onChange={(e) => setCreatorFilter(e.target.value)}
              placeholder="подстрока логина"
              autoComplete="off"
            />
          </div>
        ) : null}
        <button type="button" className="search-btn" onClick={handleApplyFilters} disabled={listLoading}>
          {listLoading ? (
            <span className="ui-loading-row">
              <span className="ui-spinner" aria-hidden="true" /> Обновление…
            </span>
          ) : (
            'Применить фильтры'
          )}
        </button>
      </section>

      {listError ? <div className="ui-error">{listError}</div> : null}

      {listLoading && visible.length === 0 ? (
        <p className="ui-hint ui-loading-row" style={{ marginTop: 24 }}>
          <span className="ui-spinner" aria-hidden="true" /> Загрузка списка…
        </p>
      ) : null}

      <div className="sql-queries-table-wrap">
        <table className="request-table" style={{ marginTop: 16 }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Задача (индексы / SQL)</th>
              <th>Статус</th>
              <th>Дата формирования</th>
              <th>Непустых результатов</th>
              <th>Создатель</th>
              <th />
              {isModerator ? <th>Модерация</th> : null}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => {
              const id = row.id ?? 0
              return (
                <tr key={id}>
                  <td>{row.id}</td>
                  <td>{row.theme?.trim() ? row.theme : '—'}</td>
                  <td>{statusLabel(row.status)}</td>
                  <td>{formatDate(row.formed_at ?? null)}</td>
                  <td>{row.results_count != null && row.results_count > 0 ? row.results_count : '—'}</td>
                  <td>{row.creator_login ?? '—'}</td>
                  <td>
                    <button type="button" className="search-btn search-btn--sm" onClick={() => goDetail(row)}>
                      Открыть
                    </button>
                  </td>
                  {isModerator ? (
                    <td>
                      {row.status === 'formed' ? (
                        <div className="sql-query-actions-row" style={{ marginTop: 0 }}>
                          <button
                            type="button"
                            className="search-btn search-btn--sm"
                            disabled={busyFinish(id)}
                            onClick={() =>
                              void dispatch(
                                finishIndexedTableSqlQueryThunk({ sqlQueryId: id, status: 'completed' }),
                              )
                            }
                          >
                            Завершить
                          </button>
                          <button
                            type="button"
                            className="search-btn search-btn--sm search-btn--warn"
                            disabled={busyFinish(id)}
                            onClick={() =>
                              void dispatch(
                                finishIndexedTableSqlQueryThunk({ sqlQueryId: id, status: 'rejected' }),
                              )
                            }
                          >
                            Отклонить
                          </button>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                  ) : null}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
