import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { Box, Button, Link, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useOpenAI } from '../../hooks/openAI'
import { useAuth } from '../hooks'
import { ProfileType } from '../auth.model'
import { ProfileVertical } from './ProfileVertical'

interface AuthProfileFormProps {
  profile?: ProfileType
  onBackClick: () => void
  onForgotPasswordClick: () => void
  onSubmitClick: () => void
}

export const AuthEnterPassword = ({
  profile,
  onBackClick,
  onForgotPasswordClick,
  onSubmitClick,
}: AuthProfileFormProps) => {
  const { enterPassword } = useAuth()
  const { verifyAuth } = useOpenAI()
  const [password, setPassword] = useState<string>('')
  if (!profile) return null

  async function handleSubmitClick() {
    if (profile && password.length > 0) {
      const { encryptedPassword } = await enterPassword({ profile, unencryptedPassword: password })
      await verifyAuth({ encryptedPassword })
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
      <Link
        color="primary"
        onClick={onForgotPasswordClick}
        sx={{ mt: 1, width: '100%', textAlign: 'center', textDecoration: 'none', cursor: 'pointer' }}
      >
        Forgot password?
      </Link>
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