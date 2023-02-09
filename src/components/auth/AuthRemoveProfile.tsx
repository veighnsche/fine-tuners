import { ProfileType } from '../../models/Auth'

interface AuthRemoveProfileProps {
  profile?: ProfileType
  onBackClick: (() => void) | null
  onSubmitClick: () => void
}

export const AuthRemoveProfile = ({ profile, onBackClick, onSubmitClick }: AuthRemoveProfileProps) => {
  if (!profile) return null
  return (
    <div>
      <h1>AuthRemoveProfile</h1>
    </div>
  )
}