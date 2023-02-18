import { LineType } from '../models/Line'
import { DocumentState } from '../store/document.slice'

export function fromJson(json: string): LineType {
  const { prompt, completion } = JSON.parse(json)
  return {
    prompt,
    completion,
    taught: 0,
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

export function fromJsonl(jsonl: string): {
  lines: LineType[]
} {
  const split = jsonl.split(/(?<!\\)\n/)
  const lines = split.map(fromJson)
  return { lines }
}

export function toJsonl(lines: LineType[], isEdit?: boolean): string {
  return lines.map(
    isEdit ? toJsonEdit : toJson,
  ).join('\n')
}

export function fromJsonlEdit(jsonl: string): {
  document: DocumentState
  lines: LineType[]
} {
  const split = jsonl.split(/(?<!\\)\n/)
  const document = JSON.parse(split[0])
  const lines = split.slice(1).map(fromJson)
  return { document, lines }
}

export function toJsonlEdit(document: DocumentState, lines: LineType[]): string {
  return JSON.stringify(document) + '\n' + toJsonl(lines, true)
}