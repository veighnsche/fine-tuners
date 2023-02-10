import KeyIcon from '@mui/icons-material/Key'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { Avatar, AvatarGroup, Slide } from '@mui/material'
import { AuthStatus } from '../../models/Auth'
import { useAppSelector } from '../../store'

export const AuthStatusIcon = () => {
  const status = useAppSelector(state => state.auth.status)

  if (status === AuthStatus.NO_PASSWORD) {
    return (
      <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.main', opacity: 0.75 }}>
        <LockIcon fontSize="small"/>
      </Avatar>
    )
  }

  if (status === AuthStatus.NO_PASSWORD_VERIFICATION) {
    return (
      <AvatarGroup max={2} sx={{ opacity: 0.5 }}>
        <Avatar sx={{ width: 30, height: 30, bgcolor: 'secondary.main' }}>
          <KeyIcon fontSize="small"/>
        </Avatar>
        <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.main' }}>
          <LockIcon fontSize="small"/>
        </Avatar>
      </AvatarGroup>
    )
  }

  if (status === AuthStatus.PASSWORD_VERIFIED) {
    return (
      <Slide direction="left" in={true} timeout={500}>
        <Avatar sx={{ width: 30, height: 30, bgcolor: 'success.main', opacity: 0.25 }}>
          <LockOpenIcon fontSize="small"/>
        </Avatar>
      </Slide>
    )
  }

  return null
}