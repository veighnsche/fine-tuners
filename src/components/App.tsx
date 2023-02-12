import { Box, Theme, useTheme } from '@mui/material'
import React from 'react'
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
          flexGrow: isPlaygroundSettingsOpen ? 0.20 : 0.5,
        }}>
          <Lines/>
        </Box>
        <Box sx={{
          transition: transition(theme),
          flexGrow: isPlaygroundSettingsOpen ? 0.80 : 0.5,
        }}>
          <Playground/>
        </Box>
        <Box sx={{
          transition: transition(theme),
          overflow: 'hidden',
          width: isPlaygroundSettingsOpen ? '15rem' : 0,
        }}>
          <PlaygroundSettings/>
        </Box>
      </Box>
    </AuthWrapper>
  )
}

export default App
