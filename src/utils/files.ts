import { LineType } from '../models/Line'
import { DocumentState } from '../store/document.slice'
import { fromJsonl, fromJsonlEdit, toJsonl, toJsonlEdit } from './lines.json'

interface CreateJsonlFileParams {
  lines: LineType[]
  name: string
}

export function createJsonlFile({ lines, name }: CreateJsonlFileParams) {
  const jsonl = toJsonl(lines)
  const blob = new Blob([jsonl], { type: 'application/jsonl' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${name}.jsonl`
  link.click()
}

interface CreateJsonlFileEditParams extends CreateJsonlFileParams {
  docState: DocumentState
}

export function createJsonlEditFile({ docState, lines, name }: CreateJsonlFileEditParams) {
  const jsonl = toJsonlEdit(docState, lines)
  const blob = new Blob([jsonl], { type: 'application/jsonl-edit' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${name}.jsonl-edit`
  link.click()
}

type JsonlFileType = JsonlFile | JsonlEditFile

interface JsonlFile extends ReturnType<typeof fromJsonl> {
  type: 'jsonl'
}

interface JsonlEditFile extends ReturnType<typeof fromJsonlEdit> {
  type: 'jsonl-edit'
}

export function selectFile(): Promise<JsonlFileType> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.jsonl,.jsonl-edit'
    input.onchange = () => {
      const file = input.files?.[0]
      if (file) {
        resolve(loadFile(file))
      }
    }
    input.click()
  })
}

export function loadFile(file: File): Promise<JsonlFileType> {
  return new Promise((resolve) => {
    const type = file.name.split('.').pop()
    const reader = new FileReader()
    reader.onload = () => {
      const text = reader.result as string
      if (type === 'jsonl') {
        resolve({
          ...fromJsonl(text),
          type: 'jsonl'
        })
      }
      if (type === 'jsonl-edit') {
        resolve({
          ...fromJsonlEdit(text),
          type: 'jsonl-edit'
        })
      }
    }
    reader.readAsText(file)
  })
}