import styled from '@emotion/styled'
import { ClipboardEvent, useEffect, useRef, useState } from 'react'
import { LineType } from '../models/Line'
import { useAppDispatch } from '../store'
import { updateLine } from '../store/lines.slice'

interface LineProps {
  line: LineType
  idx: number
}

const Wrapper = styled.div`
  white-space: pre-wrap;
  display: inline-block;
  width: 100%;
  font-family: monospace;
  
  outline: 0 solid transparent;

  #completion {
    padding-left: 1px;
    background-color: rgba(102, 187, 106, 0.5);
  }
`

export const Line = ({ line, idx }: LineProps) => {
  const dispatch = useAppDispatch()
  const [{ prompt, completion }, setLine] = useState<LineType>(line)
  const parentRef = useRef<HTMLDivElement>(null)

  const getPrompt = () => {
    const prompt = parentRef.current?.querySelector('#prompt')
    if (prompt && prompt.innerHTML && prompt.innerHTML !== '') {
      return prompt.innerHTML
    }
    return '-'
  }

  const getCompletion = () => {
    const completion = parentRef.current?.querySelector('#completion')
    if (completion && completion.innerHTML && completion.innerHTML !== '') {
      return completion.innerHTML
    }
    return '-'
  }

  useEffect(() => {
    if (!line.prompt) {
      setLine({
        prompt: '-',
        completion: getCompletion(),
      })

      const prompt = parentRef.current?.querySelector('#prompt')
      if (prompt) {
        prompt.innerHTML = '-'
      }
    }
  }, [line.prompt])

  useEffect(() => {
    if (!line.completion) {
      setLine({
        prompt: getPrompt(),
        completion: '-',
      })

      const completion = parentRef.current?.querySelector('#completion')
      if (completion) {
        completion.innerHTML = '-'
      }
    }
  }, [line.completion])

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          if (mutation.addedNodes) {
            mutation.addedNodes.forEach((node) => {
              const id = (node as unknown as { id: string }).id
              if (!id) {
                parentRef.current?.removeChild(node)
              }
              if (id === 'prompt') {
                const prompts = parentRef.current?.querySelectorAll('#prompt')
                if (prompts && prompts.length > 1) {
                  parentRef.current?.removeChild(node)
                }
              }
              if (id === 'completion') {
                const completions = parentRef.current?.querySelectorAll('#completion')
                if (completions && completions.length > 1) {
                  parentRef.current?.removeChild(node)
                }
              }
            })
          }
          if (mutation.removedNodes) {
            mutation.removedNodes.forEach((node) => {
              const id = (node as unknown as { id: string }).id
              if (id === 'prompt') {
                const span = document.createElement('span')
                span.id = 'prompt'
                span.innerHTML = '-'
                parentRef.current?.prepend(span)

                dispatch(updateLine({
                  idx,
                  prompt: '-',
                  completion: getCompletion(),
                }))

                updateLineFromStore()
              }
              if (id === 'completion') {
                const span = document.createElement('span')
                span.id = 'completion'
                span.innerHTML = '-'
                parentRef.current?.appendChild(span)

                dispatch(updateLine({
                  idx,
                  prompt: getPrompt(),
                  completion: '-',
                }))

                updateLineFromStore()
              }
            })
          }
        }
      })
    })

    observer.observe(parentRef.current!, { childList: true })

    return () => {
      observer.disconnect()
    }
  })

  const handleChange = () => {
    dispatch(updateLine({
      idx,
      prompt: getPrompt(),
      completion: getCompletion(),
    }))
  }

  const updateLineFromStore = () => {
    setLine(line)
  }

  const handleBlur = () => {
    updateLineFromStore()
  }

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text')
    document.execCommand('insertHTML', false, text)
  }

  return (
    <Wrapper
      role="textbox"
      ref={parentRef}
      contentEditable
      suppressContentEditableWarning
      onInput={handleChange}
      onBlur={handleBlur}
      onPaste={handlePaste}
    >
      <span id="prompt">{prompt}</span>
      <span id="completion">{completion}</span>
    </Wrapper>
  )
}
