import { authFailed } from '../../auth/auth.slice'
import { removeEncryptedPasswordFromSession } from '../../auth/encryptedPassword.store'
import { useAuth } from '../../auth/hooks'
import { useAppDispatch, useAppSelector } from '../../store'
import { selectLinesForUpload } from '../../store/lines.slice'
import { createJsonLFile } from '../../utils/files'

export const useFileUpload = () => {
  const { getApiKey } = useAuth()
  const lines = useAppSelector(selectLinesForUpload)
  const documentName = useAppSelector(state => state.document.name)
  const dispatch = useAppDispatch()

  return async () => {
    const file: File = createJsonLFile({
      lines,
      name: documentName,
    })

    const apiKey = await getApiKey()

    const formData = new FormData()
    formData.append('purpose', 'fine-tune')
    formData.append('file', file)

    const res = await fetch('https://api.openai.com/v1/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    })

    if (!res.ok) {
      if (res.status === 401) {
        dispatch(authFailed())
        await removeEncryptedPasswordFromSession()
      }
      throw new Error('OpenAI API request failed')
    }

    const json = await res.json()
    console.log(json)
  }
}