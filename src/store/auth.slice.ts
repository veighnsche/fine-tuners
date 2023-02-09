import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthStatus, ProfileType } from '../models/Auth'

export interface AuthState {
  encryptedPassword: string | null
  profile: Omit<ProfileType, 'id'> | null
  status: AuthStatus
  isDialogOpen: boolean
  creatingProfileVehicle: {
    name: string
    unencryptedApiKey: string
  } | null
}

export const initialState: AuthState = {
  encryptedPassword: null,
  profile: null,
  status: AuthStatus.NOT_INITIALIZED,
  isDialogOpen: false,
  creatingProfileVehicle: null,
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
      state.status = AuthStatus.NO_PASSWORD_VERIFICATION
    },
    setEncryptedPassword: (state, action: PayloadAction<{
      encryptedPassword: string
    }>) => {
      state.encryptedPassword = action.payload.encryptedPassword
      state.status = AuthStatus.NO_PASSWORD_VERIFICATION
    },
    setLockedApiKey: (state, action: PayloadAction<{
      profile: ProfileType
    }>) => {
      state.status = AuthStatus.NO_PASSWORD
      state.encryptedPassword = null
      state.profile = action.payload.profile
      state.isDialogOpen = true
    },
    authSuccess: (state) => {
      state.status = AuthStatus.PASSWORD_VERIFIED
    },
    authFailed: (state) => {
      state.status = AuthStatus.NO_PASSWORD
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
      state.status = AuthStatus.NO_PASSWORD
    },
    setCreatingProfileVehicle: (state, action: PayloadAction<AuthState['creatingProfileVehicle']>) => {
      state.creatingProfileVehicle = action.payload
    },
    clearCreatingProfileVehicle: (state) => {
      state.creatingProfileVehicle = null
    }
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
  setCreatingProfileVehicle,
  clearCreatingProfileVehicle,
} = authSlice.actions


export default authSlice.reducer