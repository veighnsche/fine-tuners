import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import { Box, useTheme } from '@mui/material'
import { forwardRef, useImperativeHandle } from 'react'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

export interface CompletePromptRefHandler {
  get promptText(): string

  get completionText(): string

  get text(): string

  chunk(chunk: string): void

  setText(text: {
    prompt: string,
    completion: string,
    from: 'history' | 'training'
  }): void

  redoCompletion(): void
}

export const TextEditorRedo = forwardRef<CompletePromptRefHandler>((props, ref) => {
  const theme = useTheme()
  useImperativeHandle(ref, () => ({
    get promptText() {
      return ''
    },
    get completionText() {
      return ''
    },
    get text() {
      return ''
    },
    chunk(chunk) {
    },
    setText({ prompt, completion, from }) {
    },
    redoCompletion() {
    },
  }))

  return (
    <Box
      height="100%"
      overflow="auto"
      border={`1px solid ${theme.palette.divider}`}
      borderRadius={`${theme.shape.borderRadius}px`}
      p={1}
    >
      <LexicalComposer initialConfig={{
        namespace: 'Playground',
        onError: (error) => {
          console.error(error)
        },
      }}>
        <PlainTextPlugin
          contentEditable={(
            <div contentEditable suppressContentEditableWarning/>
          )}
          placeholder={<div>Type something here...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </LexicalComposer>
    </Box>
  )
})
