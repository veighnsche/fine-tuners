import { useGetApiKey } from './apiKey'
import { useAuthInitialize } from './initialize'
import { usePasswordEnter } from './password'
import { useProfileAdd } from './profile.add'
import { useProfilePick } from './profile.pick'
import { useProfileRemove } from './profile.remove'

export const useAuth = () => ({
  getApiKey: useGetApiKey(),
  initializeAuth: useAuthInitialize(),
  enterPassword: usePasswordEnter(),
  addProfile: useProfileAdd(),
  pickProfile: useProfilePick(),
  removeProfile: useProfileRemove(),
})