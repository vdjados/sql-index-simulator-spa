import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { parseIsModeratorFromToken } from '../utils/jwt'

export interface UserState {
  /** Имя и/или email для шапки */
  displayName: string
  isAuthenticated: boolean
  isModerator: boolean
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  displayName: '',
  isAuthenticated: false,
  isModerator: false,
  loading: false,
  error: null,
}

function applyTokenToState(state: UserState, displayName: string) {
  state.loading = false
  state.error = null
  state.isAuthenticated = true
  state.displayName = displayName
  const token = localStorage.getItem('token') ?? ''
  state.isModerator = parseIsModeratorFromToken(token)
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
      if (action.payload) state.error = null
    },
    applyAuthSuccess: (state, action: PayloadAction<{ displayName: string }>) => {
      applyTokenToState(state, action.payload.displayName)
    },
    applyAuthFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
      state.isAuthenticated = false
      state.displayName = ''
      state.isModerator = false
    },
    /** Сброс UI-гостя; JWT в localStorage снимается в компоненте до dispatch. */
    clearUserSession: () => ({ ...initialState }),
  },
})

export const {
  clearUserError,
  setAuthLoading,
  applyAuthSuccess,
  applyAuthFailure,
  clearUserSession,
} = userSlice.actions
export default userSlice.reducer
