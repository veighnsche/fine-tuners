import { alpha, Box, useTheme } from '@mui/material'
import { ClipboardEvent, forwardRef, useImperativeHandle, useRef, useState } from 'react'

export interface TextEditorRefHandler {
  get promptText(): string;

  get completionText(): string;

  get text(): string;

  get trainingData(): {
    prompt: string
    completion: string
  };

  get historyId(): string;

  chunk(chunk: string): void;

  setText(text: {
    prompt: string,
    completion: string,
    id?: string,
    from: 'history' | 'training'
  }): void;

  redoCompletion(): void;
}

export const TextEditor = forwardRef<TextEditorRefHandler>((_, ref) => {
  const promptRef = useRef<HTMLSpanElement>(null)
  const completionRef = useRef<HTMLSpanElement>(null)
  const [historyId, setHistoryId] = useState<string | undefined>(undefined)

  useImperativeHandle(ref, () => ({
    get promptText() {
      return promptRef.current!.innerText
    },
    get completionText() {
      return completionRef.current!.innerText
    },
    get text() {
      return promptRef.current!.innerText + completionRef.current!.innerText
    },
    get trainingData() {
      return {
        prompt: promptRef.current!.innerText,
        completion: completionRef.current!.innerText,
      }
    },
    get historyId() {
      return historyId!
    },
    chunk(chunk: string) {
      completionRef.current!.innerText += chunk
    },
    setText({ prompt, completion, id }) {
      setHistoryId(id)
      promptRef.current!.innerText = prompt
      completionRef.current!.innerText = completion
    },
    redoCompletion() {
      completionRef.current!.innerText = ''
    },
  }))

  const theme = useTheme()
  const backgroundColor = alpha(theme.palette.success.main, 0.5)

  const handleBoxClick = () => {
    if (promptRef.current && completionRef.current!.innerText === '') {
      promptRef.current.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text')
    document.execCommand('insertHTML', false, text)
  }

  return (
    <Box
      height="100%"
      overflow="auto"
      border={`1px solid ${theme.palette.divider}`}
      borderRadius={`${theme.shape.borderRadius}px`}
      p={1}
      onClick={handleBoxClick}
      sx={{
        cursor: 'text',
      }}
    >
      <span
        ref={promptRef}
        contentEditable
        suppressContentEditableWarning
        onPaste={handlePaste}
        style={{
          outline: '0 solid transparent',
        }}
      />
      <span
        ref={completionRef}
        contentEditable
        suppressContentEditableWarning
        onPaste={handlePaste}
        style={{
          backgroundColor,
          outline: '0 solid transparent',
          paddingLeft: 1,
        }}
      />
    </Box>
  )
})