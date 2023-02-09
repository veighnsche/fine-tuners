import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useAuth } from '../../auth'
import { useAppSelector } from '../../store'
import { apiKeyToSnippet } from '../../utils/snippet'
import { ProfileVertical } from './ProfileVertical'

interface AuthProfileFormProps {
  onBackClick: () => void
  onSubmitClick: () => void
}

export const AuthCreatePassword = ({ onBackClick, onSubmitClick }: AuthProfileFormProps) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const isPasswordValid = password.length > 0 && password === confirmPassword
  const creatingProfile = useAppSelector(state => state.auth.creatingProfileVehicle)
  const { addProfile } = useAuth()

  const handleSubmitClick = () => {
    if (creatingProfile && isPasswordValid) {
      addProfile({
        ...creatingProfile,
        unencryptedPassword: password,
        use: true,
      }).then(onSubmitClick)
    }
  }

  if (!creatingProfile) return null

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
        name={creatingProfile.name}
        snippet={apiKeyToSnippet(creatingProfile.unencryptedApiKey)}
      />

      <Typography mt={1} color="text.primary" variant="caption">
        Protect API Key with Password
      </Typography>
      <TextField
        type="password"
        size="small"
        value={password}
        onChange={e => setPassword(e.target.value)}
        fullWidth
      />

      <Typography mt={1} color="text.primary" variant="caption">
        Confirm Password
      </Typography>
      <TextField
        type="password"
        size="small"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        color={isPasswordValid ? 'success' : 'error'}
        fullWidth
      />

          <Button
            sx={{ mt: 1 }}
            variant="contained"
            onClick={handleSubmitClick}
            disabled={!password || !confirmPassword}
            color="secondary"
            fullWidth
          >
            Create Profile
          </Button>
    </Box>
  )
}