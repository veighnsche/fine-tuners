import { ProfileType } from '../../models/Auth'

interface AuthProfileFormProps {
  profile?: ProfileType
  onBackClick: () => void
  onUseClick: () => void
  onSubmitClick: () => void
  onPasswordClick: () => void
}

export const AuthEditProfile = ({ profile, onBackClick, onSubmitClick }: AuthProfileFormProps) => {
  if (!profile) return null

  return (
    <div>
      AuthProfileForm
    </div>
  )
}