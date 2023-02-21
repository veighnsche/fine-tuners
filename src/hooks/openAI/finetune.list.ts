import wretch from 'wretch'
import { authFailed } from '../../auth/auth.slice'
import { useAuth } from '../../auth/hooks'
import { OpenAiFinetuneObject } from '../../models/openAI/FineTuning'
import { useAppDispatch } from '../../store'

export const useFinetunesList = () => {
  const { getApiKey } = useAuth()
  const dispatch = useAppDispatch()

  return async () => {
    const apiKey = await getApiKey()
    return wretch('https://api.openai.com/v1/fine-tunes')
    .auth(`Bearer ${apiKey}`)
    .get()
    .unauthorized(() => {
      dispatch(authFailed())
      throw new Error('OpenAI API request failed')
    })
    .json<OpenAiFinetuneObject>()
  }
}