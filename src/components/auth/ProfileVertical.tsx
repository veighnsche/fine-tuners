import { Box, Typography } from '@mui/material'
import { Identicon } from '../Identicon'

interface ProfileVerticalProps {
  name: string
  snippet: string
}

export const ProfileVertical = ({ name, snippet }: ProfileVerticalProps) => (
  <Box
    width="100%"
    flexGrow={1}
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
  >
    <Identicon value={name}/>
    <Typography mt={1} color="text.primary">{name}</Typography>
    <Typography variant="caption" color="text.secondary">{snippet}</Typography>
  </Box>
)