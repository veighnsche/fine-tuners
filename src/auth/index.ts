import { ProfileType } from '../models/Auth'
import { useOpenAI } from '../openAI'
import { useAppDispatch, useAppSelector } from '../store'
import {
  authFailed,
  authSuccess,
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
  addProfile: ({
    name,
    unencryptedApiKey,
    unencryptedPassword,
    use,
  }: AddProfileParams) => Promise<void>
  pickProfile: ({ profile }: { profile: ProfileType }) => void
  enterPassword: ({ profile, unencryptedPassword }: EnterPasswordParams) =>
    Promise<{ encryptedPassword: string }>
  testAuth: ({ encryptedPassword }?: { encryptedPassword?: string }) => Promise<void>
  getApiKey: ({ encryptedPassword }?: { encryptedPassword?: string }) => Promise<string>;
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
  const { testApiKey } = useOpenAI()
  const currentProfile = useAppSelector((state) => ({
    encryptedPassword: state.auth.encryptedPassword,
    profile: state.auth.profile,
  }))
  const dispatch = useAppDispatch()

  const initializeAuth: UseAuthHook['initializeAuth'] = async () => {
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

  const addProfile: UseAuthHook['addProfile'] = async ({
    name,
    unencryptedApiKey,
    unencryptedPassword,
    use,
  }) => {
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

  const pickProfile: UseAuthHook['pickProfile'] = ({ profile }) => {
    dispatch(setProfile({ profile }))
  }

  const enterPassword: UseAuthHook['enterPassword'] = async ({ profile, unencryptedPassword }) => {
    const salt = passwordSalt.btoa(profile.passwordSalt)
    const encryptedPassword = await encryptPassword(unencryptedPassword, salt)
    dispatch(setAuth({ encryptedPassword, profile }))
    await saveEncryptedPasswordToSession(encryptedPassword)
    return { encryptedPassword }
  }

  const getApiKey: UseAuthHook['getApiKey'] = async ({ encryptedPassword: encryptedPasswordParam } = {}) => {
    const { encryptedPassword, profile } = currentProfile
    console.log({ encryptedPassword, profile })
    if (profile === null) {
      dispatch(requireProfile())
      return Promise.reject('No profile selected')
    }

    if (encryptedPassword === null && encryptedPasswordParam === undefined) {
      dispatch(requirePassword())
      return Promise.reject('No password')
    }

    return unlockApiKey(profile.lockedApiKey, encryptedPasswordParam || encryptedPassword!)
  }

  const testAuth: UseAuthHook['testAuth'] = async ({ encryptedPassword } = {}) => {
    const apiKey = await getApiKey({ encryptedPassword })
    const success = await testApiKey(apiKey)
    if (success) {
      dispatch(authSuccess())
    }
    else {
      dispatch(authFailed())
      await removeEncryptedPasswordFromSession()
    }
  }

  return {
    initializeAuth,
    addProfile,
    pickProfile,
    enterPassword,
    getApiKey,
    testAuth,
  }
}