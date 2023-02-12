export interface OpenAiCreateCompletionParameters {
  model: string
  prompt?: string
  max_tokens?: number
  temperature?: number
  top_p?: number
  n?: number
  stream?: boolean
  logprobs?: null
  echo?: boolean
  stop?: string[]
  presence_penalty?: number
  frequency_penalty?: number
  best_of?: number
  logit_bias?: Record<string, number>
}

export interface OpenAICreateCompletionResponse {
  id:      string;
  object:  string;
  created: number;
  model:   string;
  choices: Choice[];
  usage:   Usage;
}

interface Choice {
  text:          string;
  index:         number;
  logprobs:      null;
  finish_reason: string;
}

interface Usage {
  prompt_tokens:     number;
  completion_tokens: number;
  total_tokens:      number;
}
