import { AuthStatus, ProfileType } from '../models/Auth'
import { useAppDispatch, useAppSelector } from '../store'
import {
  noEncryptedPasswordDuringInit,
  noProfileDuringInit,
  noProfilesDuringInit,
  requirePassword,
  requireProfile,
  setAuth,
  setProfile,
} from '../store/auth.slice'
import { apiKeyToSnippet } from '../utils/snippet'
import { encryptPassword, lockApiKey, passwordSalt, unlockApiKey } from './crypto'
import {
  fetchEncryptedPasswordFromSession,
  removeEncryptedPasswordFromSession,
  saveEncryptedPasswordToSession,
} from './encryptedPassword.store'
import { addProfileStore, fetchCurrentProfile, fetchHasProfiles, setCurrentProfile } from './profile.store'

interface UseAuthHook {
  initializeAuth: () => Promise<void>;
  getApiKey: () => Promise<string>;
  addProfile: ({
    name,
    unencryptedApiKey,
    unencryptedPassword,
    use,
  }: AddProfileParams) => Promise<void>
  pickProfile: ({ profile }: { profile: ProfileType }) => void
  enterPassword: ({ profile, unencryptedPassword }: EnterPasswordParams) => Promise<boolean>
}

interface AddProfileParams {
  name: string
  unencryptedApiKey: string
  unencryptedPassword: string
  use?: boolean
  remember?: boolean
}

interface EnterPasswordParams {
  profile: ProfileType
  unencryptedPassword: string
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
    const salt = passwordSalt.create()
    const encryptedPassword = await encryptPassword(unencryptedPassword, salt)
    const lockedApiKey = await lockApiKey(unencryptedApiKey, encryptedPassword)

    await saveEncryptedPasswordToSession(encryptedPassword)
    const profile = await addProfileStore({
      name,
      lockedApiKey,
      passwordSalt: passwordSalt.atob(salt),
      vendor: 'openAI',
      snippet: apiKeyToSnippet(unencryptedApiKey),
    })

    if (use) {
      dispatch(setAuth({ encryptedPassword, profile }))
      await setCurrentProfile(profile.uuid!)
    }
  }

  function pickProfile({ profile }: { profile: ProfileType }): void {
    dispatch(setProfile({ profile }))
  }

  async function enterPassword({ profile, unencryptedPassword }: EnterPasswordParams): Promise<boolean> {
    const salt = passwordSalt.btoa(profile.passwordSalt)
    const encryptedPassword = await encryptPassword(unencryptedPassword, salt)
    await saveEncryptedPasswordToSession(encryptedPassword)
    dispatch(setAuth({ encryptedPassword, profile }))

    const apiKey = await unlockApiKey(profile.lockedApiKey, encryptedPassword)

    console.log({ apiKey })

    return true
  }

  async function getApiKey(): Promise<string> {
    if (status !== AuthStatus.PASSWORD_VERIFIED && status !== AuthStatus.NO_PASSWORD_VERIFICATION) {
      dispatch(requirePassword())
      return Promise.reject()
    }

    const { encryptedPassword, profile } = authProfile
    if (!encryptedPassword || !profile) {
      dispatch(requireProfile())
      return Promise.reject()
    }

    return unlockApiKey(encryptedPassword, profile.lockedApiKey)
  }

  return {
    initializeAuth,
    addProfile,
    pickProfile,
    enterPassword,
    getApiKey,
  }
}