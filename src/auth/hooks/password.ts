import { useAppDispatch } from "../../store";
import { ProfileType } from "../auth.model";
import { setAuth } from "../auth.slice";
import { encryptPassword, passwordSalt } from "../crypto";
import { saveEncryptedPasswordToSession } from "../encryptedPassword.store";

interface UsePasswordEnterParams {
  profile: ProfileType
  unencryptedPassword: string
}

interface UsePasswordEnter {
  encryptedPassword: string
}

export const usePasswordEnter = () => {
  const dispatch = useAppDispatch();

  return async ({ profile, unencryptedPassword }: UsePasswordEnterParams): Promise<UsePasswordEnter> => {
    const salt = passwordSalt.btoa(profile.passwordSalt)
    const encryptedPassword = await encryptPassword(unencryptedPassword, salt)
    dispatch(setAuth({ encryptedPassword, profile }))
    await saveEncryptedPasswordToSession(encryptedPassword)
    return { encryptedPassword }
  }
}