export type DatumObject = 'model';
export type OwnedBy = 'openai' | 'openai-internal' | 'openai-dev' | 'system';
export type PermissionObject = 'model_permission';
export type Organization = '*';

export interface OpenAiModels {
  object: string;
  data: OpenAiModel[];
}

export interface OpenAiModel {
  id: string;
  object: DatumObject;
  created: number;
  owned_by: OwnedBy;
  permission: OpenAiModelPermission[];
  root: string;
  parent: null;
}

export interface OpenAiModelPermission {
  id: string;
  object: PermissionObject;
  created: number;
  allow_create_engine: boolean;
  allow_sampling: boolean;
  allow_logprobs: boolean;
  allow_search_indices: boolean;
  allow_view: boolean;
  allow_fine_tuning: boolean;
  organization: Organization;
  group: null;
  is_blocking: boolean;
}
