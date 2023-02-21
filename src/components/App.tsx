import { Box, useTheme } from '@mui/material'
import { useRef } from 'react'
import { AuthWrapper } from '../auth/auth.wrapper'
import { LineType } from '../models/Line'
import { useAppDispatch, useAppSelector } from '../store'
import { toggleFilesDialog, toggleNameDialog } from '../store/app.slice'
import { HistoryItemType } from '../store/document.slice'
import { DialogFiles } from './DialogFiles'
import { History } from './History'
import { TopBarEdit } from './TopBarEdit'
import { DialogName } from './DialogName'
import { Playground } from './Playground'
import { PlaygroundSettings } from './settings.playground'
import { PlaygroundEdit } from './PlaygroundEdit'
import { TextEditorRefHandler } from './TextEditor'
import { TopBar } from './TopBar'
import { TrainingData } from './TrainingData'

function App() {
  const theme = useTheme()
  const dispatch = useAppDispatch()

  const barHeight = theme.spacing(6)
  const contentHeight = `calc(100vh - ${barHeight})`
  const widthUnit = (units: number) => `${(100 / 5) * units}%`

  const editTextRef = useRef<TextEditorRefHandler>(null)

  const dialogOpen = useAppSelector(state => state.app.dialogOpen)

  const handleHistoryItemClick = (item: HistoryItemType) => {
    editTextRef.current?.setText({
      prompt: item.params.prompt || '',
      completion: item.completion,
      id: item.id,
      from: 'history',
    })
  }

  const handleLineClick = (line: LineType) => {
    editTextRef.current?.setText({
      id: line.id,
      prompt: line.prompt,
      completion: line.completion,
      from: 'training',
    })
  }

  return (
    <AuthWrapper>
      <>
        <Box>
          <TopBar height={barHeight}/>
          <Box height={contentHeight} display="flex">
            <Playground width={widthUnit(4)}/>
            <PlaygroundSettings width={widthUnit(1)} minWidth={theme.spacing(40)}/>
          </Box>
          <TopBarEdit height={barHeight}/>
          <Box height={contentHeight} display="flex" gap={1} p={1}>
            <History
              width={widthUnit(0.75)}
              minWidth={theme.spacing(30)}
              onHistoryItemClick={handleHistoryItemClick}
            />
            <TrainingData
              width={widthUnit(0.75)}
              minWidth={theme.spacing(30)}
              onLineClick={handleLineClick}
            />
            <PlaygroundEdit
              ref={editTextRef}
              width={widthUnit(3.5)}
            />
          </Box>
        </Box>

        {dialogOpen === 'name' ? (
          <DialogName
            open
            onClose={() => dispatch(toggleNameDialog())}
          />
        ) : null}

        {dialogOpen === 'files' ? (
          <DialogFiles
            open
            onClose={() => dispatch(toggleFilesDialog())}
          />
        ) : null}

      </>
    </AuthWrapper>
  )
}

export default App
