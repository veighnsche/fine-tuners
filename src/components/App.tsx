import { Box, useTheme } from '@mui/material'
import { useRef } from 'react'
import { AuthWrapper } from '../auth/auth.wrapper'
import { HistoryItem } from '../store/document.slice'
import { History } from './History'
import { MidBar } from './MidBar'
import { Playground } from './playground/Playground'
import { PlaygroundSettings } from './playground/settings'
import { CompletePromptRefHandler, TextEditor } from './TextEditor'
import { TopBar } from './TopBar'
import { TrainingData } from './TrainingData'

function App() {
  const theme = useTheme()

  const barHeight = theme.spacing(6)
  const contentHeight = `calc(100vh - ${barHeight})`
  const widthUnit = (units: number) => `calc(20vw * ${units})`

  const completePromptRef = useRef<CompletePromptRefHandler>(null)

  const handleHistoryItemClick = (item: HistoryItem) => {
    completePromptRef.current?.setText({
      prompt: item.params.prompt || '',
      completion: item.completion,
      from: 'history',
    })
  }

  return (
    <AuthWrapper>
      <Box>
        <TopBar height={barHeight}/>
        <Box height={contentHeight} display="flex">
          <Playground width={widthUnit(4)}/>
          <PlaygroundSettings width={widthUnit(1)} minWidth={theme.spacing(40)}/>
        </Box>
        <MidBar height={barHeight}/>
        <Box height={contentHeight} display="flex" gap={1} p={1}>
          <History
            width={widthUnit(0.75)}
            minWidth={theme.spacing(30)}
            onHistoryItemClick={handleHistoryItemClick}
          />
          <TrainingData
            width={widthUnit(0.75)}
            minWidth={theme.spacing(30)}
          />
          <Box
            sx={{
              width: widthUnit(3.5),
              height: '100%',
            }}
          >
            <TextEditor ref={completePromptRef}/>
          </Box>
        </Box>
      </Box>
    </AuthWrapper>
  )
}

export default App
