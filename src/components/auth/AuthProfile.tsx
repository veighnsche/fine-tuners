import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { Box, Button, Divider } from '@mui/material'
import { useAuth } from '../../auth'
import { ProfileType } from '../../models/Auth'
import { ProfileVertical } from './ProfileVertical'

interface AuthProfileProps {
  profile?: ProfileType
  onBackClick: () => void
  onUseClick: () => void
  onRemoveClick: () => void
}

export const AuthProfile = ({
  profile,
  onBackClick,
  onUseClick,
  onRemoveClick,
}: AuthProfileProps) => {
  const { pickProfile } = useAuth()
  if (!profile) {
    return null
  }

  const handleUseClick = () => {
    pickProfile({ profile })
    onUseClick()
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
        <Button onClick={onBackClick} color="inherit" startIcon={<ChevronLeftIcon/>} sx={{ textTransform: 'none' }}>
          back
        </Button>
      </Box>
      <ProfileVertical
        name={profile.name}
        snippet={profile.snippet}
      />
      <Button
        color="primary"
        onClick={handleUseClick}
        fullWidth
      >
        Use profile
      </Button>
      <Divider sx={{ width: '100%' }}/>
      <Button
        color="warning"
        onClick={onRemoveClick}
        fullWidth
      >
        Remove profile
      </Button>
    </Box>
  )
}