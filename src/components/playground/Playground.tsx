import { Box, Button, ButtonGroup, Paper, Typography, useTheme } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../store'
import { setPlaygroundSettingsOpen } from '../../store/playground.settings.slice'
import { CompletePrompt } from './CompletePrompt'

export const Playground = () => {
  const isPlaygroundSettingsOpen = useAppSelector(state => state.playgroundSettings.isOpen)
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const handleGenerate = () => {

  }

  return (
    <Paper sx={{
      p: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      height: `calc(100vh - ${theme.spacing(10)})`,
    }}>
      <Box display="flex">
        <Typography variant="h6" color="inherit" component="div">
          Playground
        </Typography>
        <Box sx={{ flexGrow: 1 }}/>
        <ButtonGroup>
          <Button onClick={() => {
            dispatch(setPlaygroundSettingsOpen({ isOpen: !isPlaygroundSettingsOpen }))
          }}>
            Settings
          </Button>
        </ButtonGroup>
      </Box>
      <CompletePrompt/>
      <Box display="flex" flexDirection="row">
        <ButtonGroup>
          <Button
            onClick={handleGenerate}
            variant="contained"
          >
            Generate
          </Button>
        </ButtonGroup>
      </Box>

    </Paper>
  )
}