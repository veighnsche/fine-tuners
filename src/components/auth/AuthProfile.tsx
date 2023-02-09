import { ProfileType } from '../../models/Auth'

interface AuthProfileProps {
  profile?: ProfileType
  onBackClick: () => void
  onEditClick: () => void
}

export const AuthProfile = ({ profile }: AuthProfileProps) => {
  const hasProfile = !!profile
  return (
    <div>
      AuthProfile
    </div>
  )
}