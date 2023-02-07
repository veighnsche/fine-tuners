import Dexie, { IndexableType, Table } from 'dexie'
import { v4 as uuidv4 } from 'uuid'

export interface ApiKeyType {
  id?: IndexableType;
  uuid?: string;
  name: string;
  locked: string;
  vendor: string;
}

export interface CurrentKeyType {
  id?: IndexableType;
  currentUuid: string;
}

export class KeysDexieDb extends Dexie {
  keys!: Table<ApiKeyType>
  current!: Table<CurrentKeyType>

  constructor() {
    super('fine-tuners-keys')
    this.version(1).stores({
      keys: '++id, &uuid, name, encrypted, vendor',
      current: '++id, current_uuid',
    })
  }
}

const keysDb = new KeysDexieDb()

export function fetchKeys(): Promise<ApiKeyType[]> {
  return keysDb.keys.toArray() as Promise<ApiKeyType[]>
}

async function fetchKey(uuid: string): Promise<ApiKeyType> {
  const key = await keysDb.keys.where('uuid').equals(uuid).toArray()
  if (key.length === 0) {
    return Promise.reject('No key')
  }
  return key[0] as ApiKeyType
}

export async function addApiKey(key: ApiKeyType): Promise<ApiKeyType> {
  const newKey = {
    ...key,
    uuid: uuidv4(),
  }
  const id = await keysDb.keys.add(newKey)
  return {
    ...newKey,
    id,
  }
}

export async function fetchCurrentKey(): Promise<ApiKeyType> {
  const current = await keysDb.current.toArray()
  if (current.length === 0) {
    return Promise.reject('No current key')
  }
  return fetchKey(current[0].currentUuid)
}

export async function setCurrentKey(uuid: string): Promise<ApiKeyType> {
  await keysDb.current.clear()
  await keysDb.current.add({ currentUuid: uuid })
  return fetchKey(uuid)
}