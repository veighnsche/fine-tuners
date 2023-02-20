import wretch from "wretch";
import { useAuth } from "../../auth/hooks";
import { ProfileType } from "../../auth/auth.model";
import { authFailed, authSuccess } from "../../auth/auth.slice";
import { removeEncryptedPasswordFromSession } from "../../auth/encryptedPassword.store";
import { useAppDispatch } from "../../store";

interface UseTestAuthParams {
  encryptedPassword?: string;
  profile?: ProfileType;
}

export const useAuthVerify = () => {
  const { getApiKey } = useAuth();
  const dispatch = useAppDispatch();

  return async ({ encryptedPassword, profile }: UseTestAuthParams = {}) => {
    const apiKey = await getApiKey({ encryptedPassword, profile });

    const res = await wretch("https://api.openai.com/v1/models/davinci")
      .auth(`Bearer ${apiKey}`)
      .get()
      .unauthorized(async () => {
        dispatch(authFailed());
        await removeEncryptedPasswordFromSession();
        return { ok: false };
      })
      .res();

    if (res.ok) {
      dispatch(authSuccess());
      return true;
    }
    return false;
  };
};