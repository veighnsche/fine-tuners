import { useAppDispatch, useAppSelector } from '../../store'
import { ProfileType } from '../auth.model'
import { requirePasswordAsync, requireProfileAsync } from '../auth.slice'
import { unlockApiKey } from '../crypto'

interface UseGetApiKeyParams {
  encryptedPassword?: string;
  profile?: ProfileType;
}

export const useGetApiKey = () => {
  const currentProfile = useAppSelector((state) => ({
    encryptedPassword: state.auth.encryptedPassword,
    profile: state.auth.profile,
  }))
  const dispatch = useAppDispatch()

  return async ({ encryptedPassword: encryptedPasswordParam, profile: profileParam }: UseGetApiKeyParams = {}) => {
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
}