import { useAppDispatch } from "../../store";
import { apiKeyToSnippet } from "../../utils/snippet";
import { setAuth } from "../auth.slice";
import { encryptPassword, lockApiKey, passwordSalt } from "../crypto";
import { saveEncryptedPasswordToSession } from "../encryptedPassword.store";
import { addProfileStore, setCurrentProfile } from "../profile.store";

interface AddProfileParams {
  name: string;
  unencryptedApiKey: string;
  unencryptedPassword: string;
  use?: boolean;
  remember?: boolean;
}

export const useProfileAdd = () => {
  const dispatch = useAppDispatch();

  return async ({ name, unencryptedApiKey, unencryptedPassword, use }: AddProfileParams): Promise<void> => {
    const salt = passwordSalt.create();
    const encryptedPassword = await encryptPassword(unencryptedPassword, salt);
    const lockedApiKey = await lockApiKey(unencryptedApiKey, encryptedPassword);

    await saveEncryptedPasswordToSession(encryptedPassword);
    const profile = await addProfileStore({
      name,
      lockedApiKey,
      passwordSalt: passwordSalt.atob(salt),
      vendor: "openAI",
      snippet: apiKeyToSnippet(unencryptedApiKey),
    });

    if (use) {
      dispatch(setAuth({ encryptedPassword, profile }));
      await setCurrentProfile(profile.uuid!);
    }
  };
};