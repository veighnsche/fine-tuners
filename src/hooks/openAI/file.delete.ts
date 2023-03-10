import wretch from 'wretch'
import { authFailed } from '../../auth/auth.slice'
import { useAuth } from '../../auth/hooks'
import { OpenAiFileDeleteResponse } from '../../models/openAI/Files'
import { useAppDispatch } from '../../store'

interface UseDeleteFileParams {
  id: string;
}

export const useFileDelete = () => {
  const { getApiKey } = useAuth()
  const dispatch = useAppDispatch()

  return async ({ id }: UseDeleteFileParams): Promise<OpenAiFileDeleteResponse> => {
    const apiKey = await getApiKey()
    return wretch(`https://api.openai.com/v1/files/${id}`)
    .auth(`Bearer ${apiKey}`)
    .delete()
    .unauthorized(() => {
      dispatch(authFailed())
      throw new Error('OpenAI API request failed')
    })
    .json()
  }
}