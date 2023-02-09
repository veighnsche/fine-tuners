import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Alert, AlertTitle, Box, Button, Link, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import { setCreatingProfileVehicle } from '../../store/auth.slice'

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
        <Box width="100%" display="flex" justifyContent="flex-end">
          <Button
            color="inherit"
            endIcon={<ChevronRightIcon/>}
            sx={{ textTransform: 'none' }}
            onClick={onBackClick}
          >
            profiles
          </Button>
        </Box>
      ) : null}
      <Alert severity="info" sx={{ mt: 1, flexGrow: 1, alignItems: 'center' }}>
        <AlertTitle>Important Notice</AlertTitle>
        By creating a profile, you are confirming your acceptance of OpenAI's <Link
        href="https://beta.openai.com/terms">Terms of Use</Link> and <Link href="https://beta.openai.com/privacy">Privacy
        Policy</Link>. Please review these agreements before proceeding.
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