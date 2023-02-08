import { useAppDispatch, useAppSelector } from '../store'
import {
  AuthStatus,
  noEncryptedPasswordDuringInit,
  noProfileDuringInit,
  noProfilesDuringInit,
  setAuth,
} from '../store/auth.slice'
import { encryptPassword, lockApiKey, unlockApiKey } from './crypto'
import {
  fetchEncryptedPasswordFromSession,
  removeEncryptedPasswordFromSession,
  saveEncryptedPasswordToSession,
} from './encryptedPassword.store'
import { addProfile, fetchCurrentProfile, fetchHasProfiles, setCurrentProfile } from './profile.store'

interface AddApiAuthParams {
  name: string
  unencryptedApiKey: string
  unencryptedPassword: string
  use?: boolean
}

interface UseAuthHook {
  initializeAuth: () => Promise<void>;
  getApiKey: () => Promise<string>;
  addApiAuth: ({
    name,
    unencryptedApiKey,
    unencryptedPassword,
    use,
  }: AddApiAuthParams) => Promise<void>
}

export function useAuth(): UseAuthHook {
  const status = useAppSelector((state) => state.auth.status)
  const authProfile = useAppSelector((state) => ({
    encryptedPassword: state.auth.encryptedPassword,
    profile: state.auth.profile,
  }))
  const dispatch = useAppDispatch()

  async function initializeAuth(): Promise<void> {
    const profile = await fetchCurrentProfile()
    if (profile === null) {
      const hasProfiles = await fetchHasProfiles()
      if (!hasProfiles) {
        dispatch(noProfilesDuringInit())
        return
      }
      dispatch(noProfileDuringInit())
      removeEncryptedPasswordFromSession()
      return
    }

    const encryptedPassword = await fetchEncryptedPasswordFromSession()
    if (encryptedPassword === null) {
      dispatch(noEncryptedPasswordDuringInit({ profile }))
      return
    }

    dispatch(setAuth({ encryptedPassword, profile }))
  }

  async function addApiAuth({ name, unencryptedApiKey, unencryptedPassword, use }: AddApiAuthParams): Promise<void> {
    const encryptedPassword = await encryptPassword(unencryptedPassword)
    const lockedApiKey = await lockApiKey(unencryptedApiKey, encryptedPassword)

    await saveEncryptedPasswordToSession(encryptedPassword)
    const profile = await addProfile({ name, lockedApiKey, vendor: 'openAI' })

    if (use) {
      dispatch(setAuth({ encryptedPassword, profile }))
      await setCurrentProfile(profile.uuid!)
    }
  }

  async function getApiKey(): Promise<string> {
    if (status !== AuthStatus.PROFILE_UNLOCKED && status !== AuthStatus.PROFILE_LOCKED) {
      return Promise.reject(new Error('Cannot get API key when not unlocked'))
    }

    const { encryptedPassword, profile } = authProfile
    if (!encryptedPassword || !profile) {
      return Promise.reject(new Error('Cannot get API key when not unlocked'))
    }

    return unlockApiKey(encryptedPassword, profile.lockedApiKey)
  }

  return {
    initializeAuth,
    addApiAuth,
    getApiKey,
  }
}