import { useAuthVerify } from './auth.verify'
import { useCompletionCreate } from './completion.create'
import { useFileDelete } from './file.delete'
import { useFileFetch } from './file.fetch'
import { useFileList } from './file.list'
import { useFileTrain } from './file.train'
import { useFileUpload } from './file.upload'
import { useFineTunesList } from './fineTunes.list'

export const useOpenAI = () => ({
  verifyAuth: useAuthVerify(),
  createCompletion: useCompletionCreate(),
  deleteFile: useFileDelete(),
  fetchFile: useFileFetch(),
  fetchFileList: useFileList(),
  trainFile: useFileTrain(),
  uploadFile: useFileUpload(),
  fetchFineTunesList: useFineTunesList(),
})