import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProfileType } from '../auth/profile.store'

export enum AuthStatus {
  UNINITIALIZED = 'UNINITIALIZED',
  NO_PROFILE_CREATED = 'NO_PROFILE_CREATED',
  NO_PROFILE_SELECTED = 'NO_PROFILE_SELECTED',
  PROFILE_SELECTED = 'PROFILE_SELECTED',
  PROFILE_LOCKED = 'PROFILE_LOCKED',
  PROFILE_UNLOCKED = 'PROFILE_UNLOCKED',
}

export interface AuthState {
  encryptedPassword: string | null
  profile: Omit<ProfileType, 'id'> | null
  status: AuthStatus
  isDialogOpen: boolean
}

export const initialState: AuthState = {
  encryptedPassword: null,
  profile: null,
  status: AuthStatus.UNINITIALIZED,
  isDialogOpen: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{
      encryptedPassword: string
      profile: ProfileType
    }>) => {
      state.encryptedPassword = action.payload.encryptedPassword
      state.profile = action.payload.profile
      state.status = AuthStatus.PROFILE_LOCKED
    },
    setEncryptedPassword: (state, action: PayloadAction<{
      encryptedPassword: string
    }>) => {
      state.encryptedPassword = action.payload.encryptedPassword
      state.status = AuthStatus.PROFILE_LOCKED
    },
    setLockedApiKey: (state, action: PayloadAction<{
      profile: ProfileType
    }>) => {
      state.status = AuthStatus.PROFILE_SELECTED
      state.encryptedPassword = null
      state.profile = action.payload.profile
      state.isDialogOpen = true
    },
    authSuccess: (state) => {
      state.status = AuthStatus.PROFILE_UNLOCKED
    },
    authFailed: (state) => {
      state.status = AuthStatus.PROFILE_SELECTED
      state.encryptedPassword = null
      state.isDialogOpen = true
    },
    openPasswordDialog: (state) => {
      state.isDialogOpen = true
    },
    closePasswordDialog: (state) => {
      state.isDialogOpen = false
    },
    noProfileDuringInit: (state) => {
      state.status = AuthStatus.NO_PROFILE_SELECTED
    },
    noProfilesDuringInit: (state) => {
      state.status = AuthStatus.NO_PROFILE_CREATED
    },
    noEncryptedPasswordDuringInit: (state, action: PayloadAction<{
      profile: ProfileType
    }>) => {
      state.profile = action.payload.profile
      state.status = AuthStatus.PROFILE_SELECTED
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
  noProfileDuringInit,
  noProfilesDuringInit,
  noEncryptedPasswordDuringInit,
} = authSlice.actions


export default authSlice.reducer