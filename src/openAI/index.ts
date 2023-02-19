import wretch from 'wretch'
import { useAuth } from '../auth/auth.hook'
import { ProfileType } from '../auth/auth.model'
import { authFailed, authSuccess } from '../auth/auth.slice'
import { removeEncryptedPasswordFromSession } from '../auth/encryptedPassword.store'
import { OpenAiCreateCompletionParameters, OpenAICreateCompletionResponse } from '../models/openAI/CreateCompletion'
import { OpenAiFile, OpenAiFileDeleteResponse, OpenAIFilesObject } from '../models/openAI/Files'
import { useAppDispatch, useAppSelector } from '../store'
import { selectLinesForUpload } from '../store/lines.slice'
import { createJsonLFile } from '../utils/files'
import { fromJsonl } from '../utils/lines.json'

export function useOpenAI() {
  const { getApiKey } = useAuth()
  const dispatch = useAppDispatch()
  const lines = useAppSelector(selectLinesForUpload)
  const documentName = useAppSelector(state => state.document.name)

  return {
    async testAuth({ encryptedPassword, profile }: {
      encryptedPassword?: string
      profile?: ProfileType
    } = {}): Promise<boolean> {
      const apiKey = await getApiKey({ encryptedPassword, profile })

      const res = await wretch('https://api.openai.com/v1/models/davinci')
      .auth(`Bearer ${apiKey}`)
      .get()
      .unauthorized(async () => {
        dispatch(authFailed())
        await removeEncryptedPasswordFromSession()
        return { ok: false }
      })
      .res()

      if (res.ok) {
        dispatch(authSuccess())
        return true
      }
      return false
    },
    async* createCompletion({ params }: {
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
    },
    async uploadCurrentLines() {
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
    },
    async fetchFiles(): Promise<OpenAiFile[]> {
      const apiKey = await getApiKey()
      const filesObject = await wretch('https://api.openai.com/v1/files')
      .auth(`Bearer ${apiKey}`)
      .get()
      .unauthorized(() => {
        dispatch(authFailed())
        throw new Error('OpenAI API request failed')
      })
      .json<OpenAIFilesObject>()

      return filesObject.data
    },
    async fetchFileContent({ id }: {
      id: string;
    }): Promise<ReturnType<typeof fromJsonl>> {
      const apiKey = await getApiKey()
      const blob = await wretch(`https://api.openai.com/v1/files/${id}/content`)
      .auth(`Bearer ${apiKey}`)
      .get()
      .unauthorized(() => {
        dispatch(authFailed())
        throw new Error('OpenAI API request failed')
      })
      .blob()
      .catch(err => {
        console.error(err)
        throw err
      })

      const text = await blob.text()
      return fromJsonl(text)
    },
    async deleteFile({ id }: {
      id: string;
    }): Promise<OpenAiFileDeleteResponse> {
      const apiKey = await getApiKey()
      return wretch(`https://api.openai.com/v1/files/${id}`)
      .auth(`Bearer ${apiKey}`)
      .delete()
      .unauthorized(() => {
        dispatch(authFailed())
        throw new Error('OpenAI API request failed')
      })
      .res()
    },
    async trainFile() {

    },
  }
}