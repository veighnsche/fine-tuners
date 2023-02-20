import { useAppDispatch, useAppSelector } from "../../store";
import { ProfileType } from "../auth.model";
import { unsetProfile } from "../auth.slice";
import { removeEncryptedPasswordFromSession } from "../encryptedPassword.store";
import { removeProfileStore } from "../profile.store";

export const useProfileRemove = () => {
  const currentProfileUuid = useAppSelector((state) => state.auth.profile?.uuid);
  const dispatch = useAppDispatch()

  return async ({ profile }: { profile: ProfileType }) => {
    if (profile.uuid === currentProfileUuid) {
      await removeEncryptedPasswordFromSession()
      dispatch(unsetProfile())
    }
    await removeProfileStore(profile.uuid!)
  }
}