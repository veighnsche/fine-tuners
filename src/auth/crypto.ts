/**
 * Encrypts a password using the SHA256 algorithm
 * @param toEncrypt
 */
export async function encryptPassword(toEncrypt: string): Promise<string> {
  const utf8 = new TextEncoder().encode(toEncrypt)
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Locks an API key using the encrypted password using the AES-GCM algorithm
 * @param toLock
 * @param encryptedPassword
 */
export async function lockApiKey(toLock: string, encryptedPassword: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12))

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(encryptedPassword),
    'AES-GCM',
    false,
    ['encrypt']
  )

  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    new TextEncoder().encode(toLock)
  )

  return Buffer.from(JSON.stringify({
    iv: Array.from(iv),
    encrypted: Array.from(new Uint8Array(encrypted)),
  })).toString('base64')
}

/**
 * Unlocks an API key using the encrypted password using the AES-GCM algorithm
 * @param toUnlock
 * @param encryptedPassword
 */
export async function unlockApiKey(toUnlock: string, encryptedPassword: string): Promise<string> {
  const { iv, encrypted } = JSON.parse(Buffer.from(toUnlock, 'base64').toString('utf8'))

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(encryptedPassword),
    'AES-GCM',
    false,
    ['decrypt']
  )

  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(iv),
    },
    key,
    new Uint8Array(encrypted)
  )

  return new TextDecoder().decode(decrypted)
}