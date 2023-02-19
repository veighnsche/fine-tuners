import { alpha, Box, useTheme } from '@mui/material'
import { ClipboardEvent, forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { useAppDispatch } from '../store'
import { setEditTextFrom } from '../store/app.slice'
import { v4 as uuid } from 'uuid'

export interface TextEditorRefHandler {
  get promptText(): string;

  get completionText(): string;

  get text(): string;

  get trainingData(): {
    id: string,
    prompt: string
    completion: string
  };

  get id(): string;

  chunk(chunk: string): void;

  setText(text: {
    prompt: string,
    completion: string,
    id: string,
    from: 'history' | 'training'
  }): void;

  redoCompletion(): void;
}

interface TextEditorProps {
  onBlur?: () => void;
}

export const TextEditor = forwardRef<TextEditorRefHandler, TextEditorProps>(({ onBlur }, ref) => {
  const promptRef = useRef<HTMLSpanElement>(null)
  const completionRef = useRef<HTMLSpanElement>(null)
  const [id, setId] = useState<string | undefined>(undefined)
  const dispatch = useAppDispatch()

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
        id: id || uuid(),
        prompt: promptRef.current!.innerText,
        completion: completionRef.current!.innerText,
      }
    },
    get id() {
      return id!
    },
    chunk(chunk: string) {
      completionRef.current!.innerText += chunk
    },
    setText({ prompt, completion, id, from }) {
      setId(id)
      promptRef.current!.innerText = prompt
      completionRef.current!.innerText = completion
      dispatch(setEditTextFrom({ from }))
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

  const handleBlur = () => {
    if (onBlur) {
      onBlur()
    }
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
        onBlur={handleBlur}
        style={{
          outline: '0 solid transparent',
        }}
      />
      <span
        ref={completionRef}
        contentEditable
        suppressContentEditableWarning
        onPaste={handlePaste}
        onBlur={handleBlur}
        style={{
          backgroundColor,
          outline: '0 solid transparent',
          paddingLeft: 1,
        }}
      />
    </Box>
  )
})