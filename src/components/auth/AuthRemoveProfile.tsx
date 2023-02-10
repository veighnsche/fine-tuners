import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import DeleteIcon from '@mui/icons-material/Delete'
import { Alert, AlertTitle, Box, Button } from '@mui/material'
import { useAuth } from '../../auth'
import { ProfileType } from '../../models/Auth'
import { ProfileVertical } from './ProfileVertical'

interface AuthRemoveProfileProps {
  profile?: ProfileType
  onBackClick: () => void
  onRemoveClick: () => void
}

export const AuthRemoveProfile = ({ profile, onBackClick, onRemoveClick }: AuthRemoveProfileProps) => {
  const { removeProfile } = useAuth()

  if (!profile) return null

  const handleRemoveClick = async () => {
    await removeProfile({ profile })
    onRemoveClick()
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="flex-start"
      height="100%"
      p={1}
    >
      <Box width="100%">
        <Button
          color="inherit"
          startIcon={<ChevronLeftIcon/>}
          sx={{ textTransform: 'none' }}
          onClick={onBackClick}
        >
          profile
        </Button>
      </Box>

      <Alert severity="warning" sx={{ mt: 1, alignItems: 'center' }}>
        <AlertTitle>Remove Profile</AlertTitle>
        Are you sure you want to remove the profile <strong>{profile.name}</strong>? You will not be able to use this
        profile again.
      </Alert>

      <ProfileVertical name={profile.name} snippet={profile.snippet}/>

      <Button
        sx={{ mt: 1 }}
        variant="contained"
        onClick={handleRemoveClick}
        color="error"
        fullWidth
        startIcon={<DeleteIcon/>}
      >
        Remove Profile
      </Button>
    </Box>
  )
}