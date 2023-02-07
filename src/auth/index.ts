import { useAppDispatch, useAppSelector } from '../store'
import { AuthStatus, noApiKeyDuringInit, noEncryptedPasswordDuringInit, setAuth } from '../store/auth.slice'
import { encryptPassword, lockApiKey, unlockApiKey } from './crypto'
import {
  fetchEncryptedPasswordFromSession,
  removeEncryptedPasswordFromSession,
  saveEncryptedPasswordToSession,
} from './encryptedPassword.sessionDb'
import { addApiKey, fetchCurrentKey, setCurrentKey } from './lockedApiKeys.indexedDb'

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
    lockedApiKey: state.auth.lockedApiKey,
  }))
  const dispatch = useAppDispatch()

  async function initializeAuth(): Promise<void> {
    const lockedApiKey = await fetchCurrentKey()
    if (!lockedApiKey) {
      dispatch(noApiKeyDuringInit())
      removeEncryptedPasswordFromSession()
      return
    }

    const encryptedPassword = await fetchEncryptedPasswordFromSession()
    if (!encryptedPassword) {
      dispatch(noEncryptedPasswordDuringInit({ lockedApiKey }))
      return
    }

    dispatch(setAuth({ encryptedPassword, lockedApiKey }))
  }

  async function addApiAuth({ name, unencryptedApiKey, unencryptedPassword, use }: AddApiAuthParams): Promise<void> {
    const encryptedPassword = await encryptPassword(unencryptedPassword)
    const lockedApiKey = await lockApiKey(unencryptedApiKey, encryptedPassword)

    await saveEncryptedPasswordToSession(encryptedPassword)
    const key = await addApiKey({ name, locked: lockedApiKey, vendor: 'openAI' })

    if (use) {
      dispatch(setAuth({ encryptedPassword, lockedApiKey: key }))
      await setCurrentKey(key.uuid!)
    }
  }

  async function getApiKey(): Promise<string> {
    if (status !== AuthStatus.UNLOCKED && status !== AuthStatus.UNTESTED) {
      return Promise.reject(new Error('Cannot get API key when not unlocked'))
    }

    const { encryptedPassword, lockedApiKey } = authProfile
    if (!encryptedPassword || !lockedApiKey) {
      return Promise.reject(new Error('Cannot get API key when not unlocked'))
    }

    return unlockApiKey(encryptedPassword, lockedApiKey.locked)
  }

  return {
    initializeAuth,
    addApiAuth,
    getApiKey,
  }
}