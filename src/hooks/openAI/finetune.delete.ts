import wretch from 'wretch'
import { authFailed } from '../../auth/auth.slice'
import { useAuth } from '../../auth/hooks'
import { OpenAiFinetuneDeleteResponse } from '../../models/openAI/FineTuning'
import { useAppDispatch } from '../../store'

interface UseFileTrainParams {
  name: string;
}

export const useFinetuneDelete = () => {
  const { getApiKey } = useAuth()
  const dispatch = useAppDispatch()

  return async function ({ name }: UseFileTrainParams): Promise<OpenAiFinetuneDeleteResponse> {
    const apiKey = await getApiKey()
    return wretch(`https://api.openai.com/v1/models/${name}`)
    .auth(`Bearer ${apiKey}`)
    .delete()
    .unauthorized(() => {
      dispatch(authFailed())
      throw new Error('OpenAI API request failed')
    })
    .json()
  }
}