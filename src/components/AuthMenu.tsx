import { useLiveQuery } from 'dexie-react-hooks'
import { fetchProfiles } from '../auth/profile.store'

interface TopBarMenuProps {
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
}

export const AuthMenu = ({ anchorEl, open, onClose }: TopBarMenuProps) => {
  const profiles = useLiveQuery(fetchProfiles, [])
  return null
}