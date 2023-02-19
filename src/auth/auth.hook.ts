import { useAppDispatch, useAppSelector } from '../store'
import { useAddNotification } from '../store/notifications.slice'
import { apiKeyToSnippet } from '../utils/snippet'
import { AuthStatus, ProfileType } from './auth.model'
import {
  noEncryptedPasswordDuringInit,
  noProfileDuringInit,
  noProfilesDuringInit,
  requirePasswordAsync,
  requireProfileAsync,
  setAuth,
  setProfile,
  unsetProfile,
} from './auth.slice'
import { encryptPassword, lockApiKey, passwordSalt, unlockApiKey } from './crypto'
import {
  fetchEncryptedPasswordFromSession,
  removeEncryptedPasswordFromSession,
  saveEncryptedPasswordToSession,
} from './encryptedPassword.store'
import {
  addProfileStore,
  fetchCurrentProfile,
  fetchHasProfiles,
  removeProfileStore,
  setCurrentProfile,
} from './profile.store'

interface UseAuthHook {
  initializeAuth: () => Promise<{
    status: AuthStatus
    profile?: ProfileType
    encryptedPassword?: string
  }>;
  addProfile: ({
    name,
    unencryptedApiKey,
    unencryptedPassword,
    use,
  }: AddProfileParams) => Promise<void>
  pickProfile: ({ profile }: { profile: ProfileType }) => void
  enterPassword: ({ profile, unencryptedPassword }: EnterPasswordParams) =>
    Promise<{ encryptedPassword: string }>
  getApiKey: (params?: { encryptedPassword?: string, profile?: ProfileType }) => Promise<string>
  removeProfile: ({ profile }: { profile: ProfileType }) => Promise<void>
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
  const currentProfile = useAppSelector((state) => ({
    encryptedPassword: state.auth.encryptedPassword,
    profile: state.auth.profile,
  }))
  const dispatch = useAppDispatch()
  const addNotification = useAddNotification()


  const initializeAuth: UseAuthHook['initializeAuth'] = async () => {
    const profile = await fetchCurrentProfile()
    if (profile === null) {
      const hasProfiles = await fetchHasProfiles()
      if (!hasProfiles) {
        dispatch(noProfilesDuringInit())
        addNotification({
          message: 'Create a profile to get started',
          severity: 'info',
        })
        return {
          status: AuthStatus.NO_PROFILE_CREATED,
        }
      }
      dispatch(noProfileDuringInit())
      removeEncryptedPasswordFromSession()
      return {
        status: AuthStatus.NO_PROFILE_SELECTED,
      }
    }

    const encryptedPassword = await fetchEncryptedPasswordFromSession()
    if (encryptedPassword === null) {
      dispatch(noEncryptedPasswordDuringInit({ profile }))
      return {
        status: AuthStatus.NO_PASSWORD,
        profile,
      }
    }

    dispatch(setAuth({ encryptedPassword, profile }))
    return {
      status: AuthStatus.NO_PASSWORD_VERIFICATION,
      profile,
      encryptedPassword,
    }
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

  const getApiKey: UseAuthHook['getApiKey'] = async ({
    encryptedPassword: encryptedPasswordParam,
    profile: profileParam,
  } = {}) => {
    const { encryptedPassword, profile } = currentProfile

    if (profile === null && profileParam === undefined) {
      requireProfileAsync(dispatch)
      return Promise.reject('No profile selected')
    }

    if (encryptedPassword === null && encryptedPasswordParam === undefined) {
      requirePasswordAsync(dispatch)
      return Promise.reject('No password')
    }

    return unlockApiKey(
      profile?.lockedApiKey || profileParam!.lockedApiKey!,
      encryptedPasswordParam || encryptedPassword!,
    )
  }

  const removeProfile: UseAuthHook['removeProfile'] = async ({ profile }) => {
    if (profile.uuid === currentProfile.profile?.uuid) {
      await removeEncryptedPasswordFromSession()
      dispatch(unsetProfile())
    }
    await removeProfileStore(profile.uuid!)
  }

  return {
    initializeAuth,
    addProfile,
    pickProfile,
    enterPassword,
    getApiKey,
    removeProfile,
  }
}