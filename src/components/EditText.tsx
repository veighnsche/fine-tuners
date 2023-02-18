import { Box, Button, ButtonGroup, Theme } from '@mui/material'
import { forwardRef, MutableRefObject } from 'react'
import { useAppDispatch } from '../store'
import { removeFromHistory } from '../store/document.slice'
import { addLine } from '../store/lines.slice'
import { TextEditor, TextEditorRefHandler } from './TextEditor'

interface EditTextProps {
  width: ReturnType<Theme['spacing']>;
}

export const EditText = forwardRef<TextEditorRefHandler, EditTextProps>(
  ({ width }, ref) => {
    const dispatch = useAppDispatch()


    const handleAddToTraining = () => {
      const currentRef = ref as MutableRefObject<TextEditorRefHandler>
      const line = currentRef.current.trainingData
      const id = currentRef.current.historyId
      dispatch(addLine({ line }))
      dispatch(removeFromHistory({ id }))
    }


    return (
      <Box
        width={width}
        height="100%"
        display="flex"
        flexDirection="column"
        gap={1}
      >
        <TextEditor ref={ref}/>

        <Box display="flex" flexDirection="row">
          <ButtonGroup>
            <Button
              onClick={handleAddToTraining}
              variant="contained"
            >
              Add to training data
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
    )
  },
)