import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthStatus, ProfileType } from '../models/Auth'
import { useAppDispatch } from './index'

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
    unsetProfile: (state) => {
      state.status = AuthStatus.NO_PROFILE_SELECTED
      state.profile = null
      state.encryptedPassword = null
    },
    authSuccess: (state) => {
      state.status = AuthStatus.PASSWORD_VERIFIED
    },
    authFailed: (state) => {
      state.status = AuthStatus.PASSWORD_REQUIRED
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
    requireProfileCleanup: (state) => {
      state.status = AuthStatus.NO_PROFILE_SELECTED
    },
    requirePassword: (state) => {
      state.status = AuthStatus.PASSWORD_REQUIRED
    },
    requirePasswordCleanup: (state) => {
      state.status = AuthStatus.NO_PASSWORD
    }
  },
})

export const {
  setAuth,
  setProfile,
  unsetProfile,
  authSuccess,
  authFailed,
  noProfileDuringInit,
  noProfilesDuringInit,
  noEncryptedPasswordDuringInit,
  setCreatingProfileVehicle,
  clearCreatingProfileVehicle,
  requireProfile,
  requireProfileCleanup,
  requirePassword,
  requirePasswordCleanup,
} = authSlice.actions

export const requirePasswordCaptured = (dispatch: ReturnType<typeof useAppDispatch>): typeof requirePassword => {
  setTimeout(() => {
    dispatch(requirePasswordCleanup())
  }, 400)
  return requirePassword
}

export const requireProfileCaptured = (dispatch: ReturnType<typeof useAppDispatch>): typeof requireProfile => {
  setTimeout(() => {
    dispatch(requireProfileCleanup())
  }, 400)
  return requireProfile
}


export default authSlice.reducer