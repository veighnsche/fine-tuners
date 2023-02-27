import wretch from 'wretch'
import { authFailed, authSuccess } from '../../auth/auth.slice'
import { useAuth } from '../../auth/hooks'
import { OpenAiCreateCompletionParameters } from '../../models/openAI/CreateCompletion'
import { useAppDispatch } from '../../store'

interface UseCreateCompletionParams {
  params: OpenAiCreateCompletionParameters;
}

type UseCreateCompletion = AsyncGenerator<{
  chunk: string;
  done: boolean;
}>;

export const useCompletionCreate = () => {
  const { getApiKey } = useAuth()
  const dispatch = useAppDispatch()

  return async function* createCompletion({ params }: UseCreateCompletionParams): UseCreateCompletion {
    const apiKey = await getApiKey()
    const res = await wretch('https://api.openai.com/v1/completions')
    .auth(`Bearer ${apiKey}`)
    .post({
      ...params,
      stream: true,
    })
    .unauthorized(() => {
      dispatch(authFailed())
      throw new Error('OpenAI API request failed')
    })
    .res()

    if (!res.ok || !res.body) {
      throw new Error('OpenAI API request failed')
    }

    dispatch(authSuccess())
    const reader = res.body.getReader()

    readerLoop: while (true) {
      const { value, done } = await reader.read()
      if (done) {
        break
      }

      const filtered = new TextDecoder('utf-8')
      .decode(value)
      .split('data: ')

      for (const data of filtered) {
        const trimmed = data.trim()
        if (trimmed === '') {
          continue
        }

        if (trimmed === '[DONE]') {
          yield {
            chunk: '',
            done: true,
          }
          break readerLoop
        }

        const parsed = JSON.parse(trimmed)

        yield {
          chunk: parsed.choices[0].text,
          done: false,
        }
      }
    }
  }
}