import styled from '@emotion/styled'
import { Theme, useTheme } from '@mui/material'
import { useRef, useState } from 'react'

const Wrapper = styled.div<{
  theme: Theme
}>`
  white-space: pre-wrap;
  display: inline-block;
  width: 100%;
  height: 100%;
  font-size: ${({ theme }) => theme.typography.body1.fontSize};
  padding: ${({ theme }) => theme.spacing(1)};

  outline: 0 solid transparent;
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  border: 1px solid ${({ theme }) => theme.palette.divider};

  #completion {
    padding-left: 1px;
    background-color: rgba(102, 187, 106, 0.5);
  }
`

export const CompletePrompt = () => {
  const [prompt, setPrompt] = useState<string>('')
  const [completion, setCompletion] = useState<string>('')
  const parentRef = useRef<HTMLDivElement>(null)
  const theme = useTheme()


  return (
    <Wrapper
      role="textbox"
      theme={theme}
      ref={parentRef}
      contentEditable
      suppressContentEditableWarning
      onInput={() => {
      }}
      onBlur={() => {
      }}
      onPaste={() => {
      }}
    >
    </Wrapper>
  )
}

