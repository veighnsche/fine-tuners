import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthStatus, ProfileType } from '../models/Auth'

export interface AuthState {
  encryptedPassword: string | null
  profile: Omit<ProfileType, 'id'> | null
  status: AuthStatus
  creatingProfileVehicle: {
    name: string
    unencryptedApiKey: string
  } | null
}

export const initialState: AuthState = {
  encryptedPassword: null,
  profile: null,
  status: AuthStatus.NOT_INITIALIZED,
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
    setProfile: (state, action: PayloadAction<{
      profile: ProfileType
    }>) => {
      state.status = AuthStatus.NO_PASSWORD
      state.encryptedPassword = null
      state.profile = action.payload.profile
    },
    setEncryptedPassword: (state, action: PayloadAction<{
      encryptedPassword: string
    }>) => {
      state.encryptedPassword = action.payload.encryptedPassword
      state.status = AuthStatus.NO_PASSWORD_VERIFICATION
    },
    authSuccess: (state) => {
      state.status = AuthStatus.PASSWORD_VERIFIED
    },
    authFailed: (state) => {
      state.status = AuthStatus.NO_PASSWORD
      state.encryptedPassword = null
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
    },
    requireProfile: (state) => {
      state.status = AuthStatus.PROFILE_REQUIRED
    },
    requirePassword: (state) => {
      state.status = AuthStatus.PASSWORD_REQUIRED
    }
  },
})

export const {
  setAuth,
  setProfile,
  authSuccess,
  authFailed,
  noProfileDuringInit,
  noProfilesDuringInit,
  noEncryptedPasswordDuringInit,
  setCreatingProfileVehicle,
  clearCreatingProfileVehicle,
  requireProfile,
  requirePassword,
} = authSlice.actions


export default authSlice.reducer