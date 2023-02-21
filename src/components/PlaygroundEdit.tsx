import { Box, Button, ButtonGroup, Theme } from '@mui/material'
import { forwardRef, MutableRefObject } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import { addLine, removeLine, updateLine } from '../store/lines.slice'
import { TextEditor, TextEditorRefHandler } from './TextEditor'

interface EditTextProps {
  width: ReturnType<Theme['spacing']>;
}

export const PlaygroundEdit = forwardRef<TextEditorRefHandler, EditTextProps>(
  ({ width }, ref) => {
    const dispatch = useAppDispatch()
    const from = useAppSelector(state => state.app.editTextFrom)

    const handleAddToTraining = () => {
      const currentRef = ref as MutableRefObject<TextEditorRefHandler>
      const line = currentRef.current.trainingData
      dispatch(addLine({ line }))
    }

    const handleRemoveFromTraining = () => {
      const currentRef = ref as MutableRefObject<TextEditorRefHandler>
      const { id } = currentRef.current.trainingData
      dispatch(removeLine({ id }))
    }

    const handleBlur = () => {
      const currentRef = ref as MutableRefObject<TextEditorRefHandler>
      dispatch(updateLine(currentRef.current.trainingData))
    }

    return (
      <Box
        width={width}
        height="100%"
        display="flex"
        flexDirection="column"
        gap={1}
      >
        <TextEditor ref={ref} onBlur={handleBlur} />
        {from ? (
          <Box display="flex" flexDirection="row">
            <ButtonGroup>

              {from === 'history' ? (
                <Button
                  onClick={handleAddToTraining}
                  variant="contained"
                >
                  Add to training data
                </Button>
              ) : null}

              {from === 'training' ? (
                <Button
                  onClick={handleRemoveFromTraining}
                  variant="contained"
                >
                  Remove from training data
                </Button>
              ) : null}

            </ButtonGroup>
          </Box>
        ) : null}
      </Box>
    )
  },
)