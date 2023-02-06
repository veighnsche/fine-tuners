import { LineType } from '../models/Line'
import { DocumentState } from '../store/document.slice'

export function fromJson(json: string): LineType {
  const { prompt, completion } = JSON.parse(json)
  return {
    prompt,
    completion,
    taught: 0
  }
}

export function toJson(lineType: LineType): string {
  const { prompt, completion } = lineType
  return JSON.stringify({
    prompt,
    completion,
  })
}

export function toJsonEdit(lineType: LineType): string {
  return JSON.stringify(lineType)
}

export function fromJsonl(jsonl: string): LineType[] {
  return jsonl.split('/n').map(fromJson)
}

export function toJsonl(lines: LineType[], isEdit?: boolean): string {
  return lines.map(
    isEdit ? toJsonEdit : toJson
  ).join('/n')
}

export function fromJsonlEdit(jsonl: string): {
  document: DocumentState
  lines: LineType[]
} {
  const lines = jsonl.split('/n')
  const document = JSON.parse(lines[0])
  const sliced = lines.slice(1).map(fromJson)
  return { document, lines: sliced }
}

export function toJsonlEdit(document: DocumentState, lines: LineType[]): string {
  return JSON.stringify(document) + '/n' + toJsonl(lines, true)
}