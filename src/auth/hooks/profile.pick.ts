import { useAppDispatch } from '../../store'
import { ProfileType } from '../auth.model'
import { setProfile } from '../auth.slice'

interface UseProfilePickParams {
  profile: ProfileType;
}

export const useProfilePick = () => {
  const dispatch = useAppDispatch()

  return async ({ profile }: UseProfilePickParams): Promise<void> => {
    dispatch(setProfile({ profile }))
  }
}