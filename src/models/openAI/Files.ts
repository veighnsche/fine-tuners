export interface OpenAIFilesObject {
  data: OpenAiFile[];
  object: string;
}

export interface OpenAiFile {
  id: string;
  object: string;
  bytes: number;
  created_at: number;
  filename: string;
  purpose: string;
}

export interface OpenAiFileDeleteResponse {
  id: string;
  object: string;
  deleted: boolean;
}