/**
 * Bundle of functions to manage Password salts
 */
export const passwordSalt = {
  create(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(16))
  },
  atob(array: Uint8Array): string {
    return window.btoa(String.fromCharCode(...array))
  },
  btoa(base64: string): Uint8Array {
    return new Uint8Array(window.atob(base64).split('').map((c) => c.charCodeAt(0)))
  },
}

/**
 * Encrypts a password using the PBKDF2 algorithm
 * Maximum length of the password complies with the maximum key length of the AES-GCM algorithm
 * @param toEncrypt
 * @param salt
 */
export async function encryptPassword(toEncrypt: string, salt: Uint8Array): Promise<string> {
  const utf8 = new TextEncoder().encode(toEncrypt)
  const iterations = 100000
  const keyLength = 16

  const key = await crypto.subtle.importKey(
    'raw',
    utf8,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  )

  const derivedKey = await crypto.subtle.deriveBits({
    name: 'PBKDF2',
    salt,
    iterations,
    hash: 'SHA-256'
  }, key, keyLength * 8)

  return Array.from(new Uint8Array(derivedKey))
  .map((b) => b.toString(16).padStart(2, '0'))
  .join('')
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
    new TextEncoder().encode(encryptedPassword).buffer,
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

  return window.btoa(JSON.stringify({
    iv: Array.from(iv),
    encrypted: Array.from(new Uint8Array(encrypted)),
  }))
}

/**
 * Unlocks an API key using the encrypted password using the AES-GCM algorithm
 * @param toUnlock
 * @param encryptedPassword
 */
export async function unlockApiKey(toUnlock: string, encryptedPassword: string): Promise<string> {
  const { iv, encrypted } = JSON.parse(window.atob(toUnlock))

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(encryptedPassword),
    'AES-GCM',
    false,
    ['decrypt'],
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