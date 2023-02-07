import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ApiKeyType } from '../auth/lockedApiKeys.indexedDb'

export enum AuthStatus {
  UNINITIALIZED = 'UNINITIALIZED',
  NO_API_KEY = 'NO_API_KEY',
  LOCKED = 'LOCKED',
  UNTESTED = 'UNTESTED',
  UNLOCKED = 'UNLOCKED',
}

export interface AuthState {
  encryptedPassword: string | null
  lockedApiKey: Omit<ApiKeyType, 'id'> | null
  status: AuthStatus
  isDialogOpen: boolean
}

export const initialState: AuthState = {
  encryptedPassword: null,
  lockedApiKey: null,
  status: AuthStatus.UNINITIALIZED,
  isDialogOpen: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{
      encryptedPassword: string
      lockedApiKey: ApiKeyType
    }>) => {
      state.encryptedPassword = action.payload.encryptedPassword
      state.lockedApiKey = action.payload.lockedApiKey
      state.status = AuthStatus.UNTESTED
    },
    setEncryptedPassword: (state, action: PayloadAction<{
      encryptedPassword: string
    }>) => {
      state.encryptedPassword = action.payload.encryptedPassword
      state.status = AuthStatus.UNTESTED
    },
    setLockedApiKey: (state, action: PayloadAction<{
      lockedApiKey: ApiKeyType
    }>) => {
      state.status = AuthStatus.LOCKED
      state.encryptedPassword = null
      state.lockedApiKey = action.payload.lockedApiKey
      state.isDialogOpen = true
    },
    authSuccess: (state) => {
      state.status = AuthStatus.UNLOCKED
    },
    authFailed: (state) => {
      state.status = AuthStatus.LOCKED
      state.encryptedPassword = null
      state.isDialogOpen = true
    },
    openPasswordDialog: (state) => {
      state.isDialogOpen = true
    },
    closePasswordDialog: (state) => {
      state.isDialogOpen = false
    },
    noApiKeyDuringInit: (state) => {
      state.status = AuthStatus.NO_API_KEY
    },
    noEncryptedPasswordDuringInit: (state, action: PayloadAction<{
      lockedApiKey: ApiKeyType
    }>) => {
      state.lockedApiKey = action.payload.lockedApiKey
      state.status = AuthStatus.LOCKED
    },
  },
})

export const {
  setAuth,
  setEncryptedPassword,
  setLockedApiKey,
  authSuccess,
  authFailed,
  openPasswordDialog,
  closePasswordDialog,
  noApiKeyDuringInit,
  noEncryptedPasswordDuringInit,
} = authSlice.actions


export default authSlice.reducer