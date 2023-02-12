import wretch from 'wretch'
import { useAuth } from '../auth'
import { removeEncryptedPasswordFromSession } from '../auth/encryptedPassword.store'
import { OpenAiCreateCompletionParameters, OpenAICreateCompletionResponse } from '../models/openAI/CreateCompletion'
import { useAppDispatch } from '../store'
import { authFailed, authSuccess } from '../store/auth.slice'

export function useOpenAI() {
  const { getApiKey } = useAuth()
  const dispatch = useAppDispatch()

  return {
    testAuth: async ({ encryptedPassword }: { encryptedPassword?: string } = {}): Promise<boolean> => {
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
    createCompletionStream: async (params: OpenAiCreateCompletionParameters): Promise<ReadableStream<string>> => {
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

      const reader = await res.body.getReader()

      return new ReadableStream<string>({
        start(controller) {
          const push = async () => {
            const { value, done } = await reader.read()
            if (done) {
              console.log('done (done)')
              // controller.close()
              return
            }
            new TextDecoder('utf-8')
            .decode(value)
            .split('data: ')
            .forEach((data) => {
              const trimmed = data.trim()
              if (trimmed === '') {
                return
              }

              if (trimmed === '[DONE]') {
                console.log('done')
                controller.close()
                return
              }

              const parsed: OpenAICreateCompletionResponse = JSON.parse(trimmed)
              const text = parsed.choices[0].text
              controller.enqueue(text)
            })

            await push()
          }

          push()
        },
      })
    },
  }
}