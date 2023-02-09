import { IndexableType } from 'dexie'

export enum AuthStatus {
  NOT_INITIALIZED = 'NOT_INITIALIZED',
  NO_PROFILE_CREATED = 'NO_PROFILE_CREATED',
  NO_PROFILE_SELECTED = 'NO_PROFILE_SELECTED',
  NO_PASSWORD = 'NO_PASSWORD',
  NO_PASSWORD_VERIFICATION = 'NO_PASSWORD_VERIFICATION',
  PASSWORD_VERIFIED = 'PASSWORD_VERIFIED',
  PROFILE_REQUIRED = 'PROFILE_REQUIRED',
  PASSWORD_REQUIRED = 'PASSWORD_REQUIRED',

}

export interface ProfileType {
  id?: IndexableType;
  uuid?: string;
  name: string;
  lockedApiKey: string;
  passwordSalt: string;
  snippet: string;
  vendor: string;
}

export interface CurrentProfileType {
  id?: IndexableType;
  currentUuid: string;
}