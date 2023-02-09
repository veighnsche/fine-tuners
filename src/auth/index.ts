import { AuthStatus } from '../models/Auth'
import { useAppDispatch, useAppSelector } from '../store'
import { noEncryptedPasswordDuringInit, noProfileDuringInit, noProfilesDuringInit, setAuth } from '../store/auth.slice'
import { apiKeyToSnippet } from '../utils/snippet'
import { createPasswordSalt, encryptPassword, lockApiKey, passwordSaltToBase64, unlockApiKey } from './crypto'
import {
  fetchEncryptedPasswordFromSession,
  removeEncryptedPasswordFromSession,
  saveEncryptedPasswordToSession,
} from './encryptedPassword.store'
import { addProfileStore, fetchCurrentProfile, fetchHasProfiles, setCurrentProfile } from './profile.store'

interface AddProfileParams {
  name: string
  unencryptedApiKey: string
  unencryptedPassword: string
  use?: boolean
  remember?: boolean
}

interface UseAuthHook {
  initializeAuth: () => Promise<void>;
  getApiKey: () => Promise<string>;
  addProfile: ({
    name,
    unencryptedApiKey,
    unencryptedPassword,
    use,
  }: AddProfileParams) => Promise<void>
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

  async function addProfile({
    name,
    unencryptedApiKey,
    unencryptedPassword,
    use,
  }: AddProfileParams): Promise<void> {
    const salt = createPasswordSalt()
    const encryptedPassword = await encryptPassword(unencryptedPassword, salt)
    const lockedApiKey = await lockApiKey(unencryptedApiKey, encryptedPassword)

    await saveEncryptedPasswordToSession(encryptedPassword)
    const profile = await addProfileStore({
      name,
      lockedApiKey,
      passwordSalt: passwordSaltToBase64(salt),
      vendor: 'openAI',
      snippet: apiKeyToSnippet(unencryptedApiKey),
    })

    if (use) {
      dispatch(setAuth({ encryptedPassword, profile }))
      await setCurrentProfile(profile.uuid!)
    }
  }

  async function getApiKey(): Promise<string> {
    if (status !== AuthStatus.PASSWORD_VERIFIED && status !== AuthStatus.NO_PASSWORD_VERIFICATION) {
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
    addProfile,
    getApiKey,
  }
}