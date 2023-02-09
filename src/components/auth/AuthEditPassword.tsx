import { ProfileType } from '../../models/Auth'

interface AuthProfileFormProps {
  profile?: ProfileType
  onBackClick: () => void
  onSubmitClick: () => void
}

export const AuthEditPassword = ({ profile, onBackClick, onSubmitClick }: AuthProfileFormProps) => {
  return (
    <div>
      AuthPassword
    </div>
  )
}