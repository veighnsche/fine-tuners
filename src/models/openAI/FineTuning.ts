import { OpenAiFile } from './Files'

export interface OpenAiFineTuningParams {
  training_file: string;
  model?: string;
  n_epochs?: number;
  prompt_loss_weight?: number;
  suffix?: string;
  // todo: there are way more params

}

export interface OpenAiFineTuningEvent {
  object: string;
  created_at: number;
  level: string;
  message: string;
}

export interface OpenAiHyperParams {
  batch_size: number;
  learning_rate_multiplier: number;
  n_epochs: number;
  prompt_loss_weight: number;
}

export interface OpenAiFinetune {
  id: string;
  object: string;
  model: string;
  created_at: number;
  events: OpenAiFineTuningEvent[];
  fine_tuned_model?: any;
  hyperparams: OpenAiHyperParams;
  organization_id: string;
  result_files: any[];
  status: string;
  validation_files: any[];
  training_files: OpenAiFile[];
  updated_at: number;
}

export interface OpenAiFinetuneObject {
  data: OpenAiFinetune[];
  object: string;
}

export interface OpenAiFinetuneDeleteResponse {
  id: string;
  object: string;
  deleted: boolean;
}