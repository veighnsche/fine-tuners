import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Alert, AlertTitle, Box, Button, Link } from '@mui/material'

interface AuthForgotPasswordProps {
  onBackClick: () => void
  onCreateProfileClick: () => void
}

export const AuthForgotPassword = ({ onBackClick, onCreateProfileClick }: AuthForgotPasswordProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="flex-start"
      height="100%"
      p={1}
    >
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

      <Alert severity="info" sx={{ mt: 1, flexGrow: 1, alignItems: 'center' }}>
        <AlertTitle>Forgot Password?</AlertTitle>
        If you have forgotten your password, you can reset it by creating a new profile. You can go to the
        <Link href="https://beta.openai.com/account/api-keys" target="_blank"> OpenAI API Keys</Link>
        {' '}page to create a new API key.
      </Alert>

      <Button
        sx={{ mt: 1 }}
        variant="contained"
        onClick={onCreateProfileClick}
        fullWidth
        endIcon={<ChevronRightIcon/>}
      >
        Create Profile
      </Button>
    </Box>
  )
}