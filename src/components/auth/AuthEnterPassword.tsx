import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useAuth } from '../../auth'
import { ProfileType } from '../../models/Auth'
import { ProfileVertical } from './ProfileVertical'

interface AuthProfileFormProps {
  profile?: ProfileType
  onBackClick: () => void
  onSubmitClick: () => void
}

export const AuthEnterPassword = ({ profile, onBackClick, onSubmitClick }: AuthProfileFormProps) => {
  const { enterPassword } = useAuth()
  const [password, setPassword] = useState<string>('')
  if (!profile) return null

  async function handleSubmitClick() {
    if (profile && password.length > 0) {
      const success = await enterPassword({ profile, unencryptedPassword: password })
      console.log('success', success)
      onSubmitClick()
    }
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
          onClick={onBackClick}
          color="inherit"
          startIcon={<ChevronLeftIcon/>}
          sx={{ textTransform: 'none' }}
        >
          pick other profile
        </Button>
      </Box>
      <ProfileVertical
        name={profile.name}
        snippet={profile.snippet}
      />
      <Typography mt={1} color="text.primary" variant="caption">
        Please enter password to use this profile
      </Typography>
      <TextField
        size="small"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />
      <Button
        variant="contained"
        color="secondary"
        onClick={handleSubmitClick}
        fullWidth
        disabled={password.length === 0}
        sx={{ mt: 1 }}
      >
        Enter password
      </Button>
    </Box>
  )
}