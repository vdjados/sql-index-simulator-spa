import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class RootErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('RootErrorBoundary', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif', maxWidth: 480 }}>
          <h1 style={{ fontSize: 18 }}>Ошибка загрузки</h1>
          <p style={{ color: '#c0392b' }}>{this.state.error.message}</p>
          <p className="ui-hint">
            GitHub Pages: проверьте, что URL совпадает с именем репозитория и есть слэш в конце.
            <br />
            BASE: <code>{import.meta.env.BASE_URL}</code>
          </p>
          <button type="button" className="search-btn" onClick={() => window.location.reload()}>
            Обновить
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
