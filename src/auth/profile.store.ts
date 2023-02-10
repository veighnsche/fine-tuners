import Dexie, { Table } from 'dexie'
import { v4 as uuidv4 } from 'uuid'
import { CurrentProfileType, ProfileType } from '../models/Auth'

export class ProfilesDexieDb extends Dexie {
  profiles!: Table<ProfileType>
  current!: Table<CurrentProfileType>

  constructor() {
    super('fine-tuners-profiles')
    this.version(1).stores({
      profiles: '++id, &uuid, name, locked_api_key, password_salt, snippet, vendor',
      current: '++id, current_uuid',
    })
  }
}

const keysDb = new ProfilesDexieDb()

export async function addProfileStore(profile: ProfileType): Promise<ProfileType> {
  const newKey = {
    ...profile,
    uuid: uuidv4(),
  }
  const id = await keysDb.profiles.add(newKey)
  return {
    ...newKey,
    id,
  }
}

export function fetchProfiles(): Promise<ProfileType[]> {
  return keysDb.profiles.toArray()
}

export function fetchHasProfiles(): Promise<boolean> {
  return keysDb.profiles.count().then(Boolean)
}

async function fetchProfile(uuid: string): Promise<ProfileType | null> {
  const key = await keysDb.profiles.where('uuid').equals(uuid).toArray()
  if (key.length === 0) {
    return null
  }
  return key[0]
}

export async function fetchCurrentProfile(): Promise<ProfileType | null> {
  const current = await keysDb.current.toArray()
  if (current.length === 0) {
    return null
  }
  return fetchProfile(current[0].currentUuid)
}

export async function setCurrentProfile(uuid: string): Promise<ProfileType | null> {
  await keysDb.current.clear()
  await keysDb.current.add({ currentUuid: uuid })
  return fetchProfile(uuid)
}

export async function removeProfileStore(uuid: string): Promise<void> {
  await keysDb.profiles.where('uuid').equals(uuid).delete()
}