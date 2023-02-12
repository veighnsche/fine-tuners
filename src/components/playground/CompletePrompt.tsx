import styled from '@emotion/styled'
import '@fontsource/open-sans'
import { Theme, useTheme } from '@mui/material'
import { ClipboardEvent, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import { setPromptStore } from '../../store/playground.settings.slice'

const Wrapper = styled.div<{
  theme: Theme
}>`
  white-space: pre-wrap;
  display: inline-block;
  width: 100%;
  height: 100%;
  font-size: ${({ theme }) => theme.typography.body1.fontSize};
  font-family: "Open Sans", sans-serif;
  padding: ${({ theme }) => theme.spacing(1)};
  overflow: auto;

  outline: 0 solid transparent;
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  border: 1px solid ${({ theme }) => theme.palette.divider};

  #completion {
    padding-left: 1px;
    background-color: rgba(102, 187, 106, 0.5);
  }
`

interface CompletePromptProps {
  stream?: ReadableStream
  clearStream: () => void
}

export const CompletePrompt = ({ stream, clearStream }: CompletePromptProps) => {
  const [prompt, setPrompt] = useState<string>('')
  const [completion, setCompletion] = useState<string>('')
  const parentRef = useRef<HTMLDivElement>(null)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const promptStore = useAppSelector((state) => state.playgroundSettings.prompt)

  useEffect(() => {
    if (stream) {
      const reader = stream.getReader()

      const read = async () => {
        const { done, value } = await reader.read()
        if (done) {
          reader.releaseLock()
          clearStream()
          return
        }

        setCompletion((prev) => prev + value)
        await read()
      }

      read()
    }
  }, [stream])

  const handleInput = () => {
    const target = parentRef.current
    if (target) {
      dispatch(setPromptStore({ prompt: target.innerText }))
    }
  }

  const handleBlur = () => {
    setPrompt(promptStore)
  }

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text')
    document.execCommand('insertHTML', false, text)
  }

  return (
    <Wrapper
      role="textbox"
      theme={theme}
      ref={parentRef}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onBlur={handleBlur}
      onPaste={handlePaste}
    >
      {prompt}
      {completion ? (
        <span id="completion">
          {completion}
        </span>
      ) : null}
    </Wrapper>
  )
}

