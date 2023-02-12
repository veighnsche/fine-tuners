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

      const success = await wretch('https://api.openai.com/v1/completions')
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
    createCompletion: async (params: OpenAiCreateCompletionParameters): Promise<string> => {
      const apiKey = await getApiKey()

      return wretch('https://api.openai.com/v1/engines/davinci/completions')
      .auth(`Bearer ${apiKey}`)
      .post(params)
      .json<OpenAICreateCompletionResponse>()
      .then((res) => res.choices[0].text)
    }
  }
}