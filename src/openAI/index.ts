import wretch from 'wretch'
import { useAuth } from '../auth/auth.hook'
import { removeEncryptedPasswordFromSession } from '../auth/encryptedPassword.store'
import { OpenAiCreateCompletionParameters, OpenAICreateCompletionResponse } from '../models/openAI/CreateCompletion'
import { useAppDispatch } from '../store'
import { authFailed, authSuccess } from '../auth/auth.slice'

export function useOpenAI() {
  const { getApiKey } = useAuth()
  const dispatch = useAppDispatch()

  return {
    async testAuth({
      encryptedPassword
    }: {
      encryptedPassword?: string
    } = {}): Promise<boolean> {
      const apiKey = await getApiKey({ encryptedPassword })

      const success = await wretch('https://api.openai.com/v1/models/davinci')
      .auth(`Bearer ${apiKey}`)
      .get()
      .unauthorized(() => false)
      .json()
      .then(() => true)
      .catch(() => false)

      if (success) {
        dispatch(authSuccess())
        return true
      }
      dispatch(authFailed())
      await removeEncryptedPasswordFromSession()
      return false
    },
    async* createCompletion({
      params,
    }: {
      params: OpenAiCreateCompletionParameters;
    }): AsyncGenerator<{
      chunk: string;
      done: boolean;
    }> {
      const apiKey = await getApiKey()
      const res = await wretch('https://api.openai.com/v1/completions')
      .auth(`Bearer ${apiKey}`)
      .post({
        ...params,
        stream: true,
      })
      .res()

      if (!res.ok || !res.body) {
        throw new Error('OpenAI API request failed')
      }

      dispatch(authSuccess())
      const reader = res.body.getReader()

      readerLoop:
        while (true) {
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

            const parsed: OpenAICreateCompletionResponse = JSON.parse(trimmed)
            const text = parsed.choices[0].text
            yield {
              chunk: text,
              done: false,
            }
          }
        }
    }
  }
}