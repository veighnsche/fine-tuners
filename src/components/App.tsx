import { Box, Theme, useTheme } from '@mui/material'
import { AuthWrapper } from '../auth/AuthWrapper'
import { useAppSelector } from '../store'
import { Lines } from './Lines'
import { Playground } from './playground/Playground'
import { PlaygroundSettings } from './playground/settings/Settings'
import { TopBar } from './TopBar'

const transition = (theme: Theme) => theme.transitions.create('all', {
  easing: theme.transitions.easing.easeInOut,
  duration: theme.transitions.duration.standard,
})

function App() {
  const isPlaygroundSettingsOpen = useAppSelector(state => state.playgroundSettings.isOpen)
  const theme = useTheme()
  return (
    <AuthWrapper>
      <TopBar/>
      <Box display="flex" sx={{ p: 1, flexGrow: 1 }} gap={1}>
        <Box sx={{
          transition: transition(theme),
          width: isPlaygroundSettingsOpen ? '20vw' : '50vw',
        }}>
          <Lines/>
        </Box>
        <Box sx={{
          transition: transition(theme),
          width: isPlaygroundSettingsOpen ? '67.5vw' : '50vw',
        }}>
          <Playground/>
        </Box>
        <Box sx={{
          transition: transition(theme),
          overflow: 'hidden',
          width: isPlaygroundSettingsOpen ? '20rem' : 0,
        }}>
          <PlaygroundSettings/>
        </Box>
      </Box>
    </AuthWrapper>
  )
}

export default App
