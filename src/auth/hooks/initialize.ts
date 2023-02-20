import { useAppDispatch } from "../../store";
import { useAddNotification } from "../../store/notifications.slice";
import { AuthStatus, ProfileType } from "../auth.model";
import { noEncryptedPasswordDuringInit, noProfileDuringInit, noProfilesDuringInit, setAuth } from "../auth.slice";
import { fetchEncryptedPasswordFromSession, removeEncryptedPasswordFromSession } from "../encryptedPassword.store";
import { fetchCurrentProfile, fetchHasProfiles } from "../profile.store";

interface UseAuthInitialize {
  status: AuthStatus
  profile?: ProfileType
  encryptedPassword?: string
}

export const useAuthInitialize = () => {
  const dispatch = useAppDispatch();
  const addNotification = useAddNotification()

  return async (): Promise<UseAuthInitialize> => {
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
}