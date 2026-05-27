import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './styles/index_style.css'
import './styles/lab-overrides.css'
import './index.css'
import { RootErrorBoundary } from './components/RootErrorBoundary'
import App from './App.tsx'
import { store } from './store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </RootErrorBoundary>
  </StrictMode>,
)
