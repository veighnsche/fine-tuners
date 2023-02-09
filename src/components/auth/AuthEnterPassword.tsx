import { ProfileType } from '../../models/Auth'

interface AuthProfileFormProps {
  profile?: ProfileType
  onBackClick: (() => void) | null
  onSubmitClick: () => void
}

export const AuthEnterPassword = ({ profile, onBackClick, onSubmitClick }: AuthProfileFormProps) => {
  return (
    <div>
      AuthPassword
    </div>
  )
}