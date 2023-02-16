import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Alert, AlertTitle, Box, Button, Link, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import { setCreatingProfileVehicle } from '../auth.slice'

interface AuthProfileFormProps {
  onPasswordClick: () => void
  onBackClick: () => void
  canGoBack: boolean
}

export const AuthCreateProfile = ({ onPasswordClick, onBackClick, canGoBack }: AuthProfileFormProps) => {
  const creatingProfile = useAppSelector(state => state.auth.creatingProfileVehicle)
  const [name, setName] = useState(creatingProfile?.name ?? 'Project1')
  const [unencryptedApiKey, setUnencryptedApiKey] = useState(creatingProfile?.unencryptedApiKey ?? '')
  const dispatch = useAppDispatch()

  const handlePasswordClick = () => {
    dispatch(setCreatingProfileVehicle({ name, unencryptedApiKey }))
    onPasswordClick()
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
      {canGoBack ? (
        <Box width="100%" display="flex" justifyContent="flex-end" mb={1}>
          <Button
            color="inherit"
            endIcon={<ChevronRightIcon/>}
            onClick={onBackClick}
          >
            profiles
          </Button>
        </Box>
      ) : null}
      <Alert severity="info" sx={{ flexGrow: 1, alignItems: 'center' }}>
        <AlertTitle>Important Notice</AlertTitle>
        <Typography variant="body2" fontWeight="bold">
          By creating a profile, you are confirming your acceptance of OpenAI's
          <Link href="https://beta.openai.com/terms" target="_blank"> Terms of Use</Link> and
          <Link href="https://beta.openai.com/privacy" target="_blank"> Privacy Policy</Link>.
          Please review these agreements before proceeding.
        </Typography>
        <br/>
        <Typography variant="body2">
          You can go to the
          <Link href="https://beta.openai.com/account/api-keys" target="_blank"> OpenAI API Keys</Link>
          {' '}page to create a new API key.
        </Typography>
      </Alert>

      <Typography mt={1} color="text.primary" variant="caption">
        API Key
      </Typography>
      <TextField
        size="small"
        value={unencryptedApiKey}
        onChange={e => setUnencryptedApiKey(e.target.value)}
        placeholder={'sk-...'}
        fullWidth
      />

      <Typography mt={1} color="text.primary" variant="caption">
        Name
      </Typography>
      <TextField
        size="small"
        value={name}
        onChange={e => setName(e.target.value)}
        fullWidth
      />

      <Button
        sx={{ mt: 1 }}
        variant="contained"
        onClick={handlePasswordClick}
        disabled={!name || !unencryptedApiKey}
        fullWidth
        endIcon={<ChevronRightIcon/>}
      >
        Protect API Key
      </Button>
    </Box>
  )
}