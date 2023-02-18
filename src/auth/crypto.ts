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
    ['deriveBits'],
  )

  const derivedKey = await crypto.subtle.deriveBits({
    name: 'PBKDF2',
    salt,
    iterations,
    hash: 'SHA-256',
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
    ['encrypt'],
  )

  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    new TextEncoder().encode(toLock),
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
    new Uint8Array(encrypted),
  )

  return new TextDecoder().decode(decrypted)
}

/**
 * This is a client-side solution for encrypting and storing an API key in the browser. By using this solution, you have reduced the risk of having a single point of attack. Instead of storing the API key on a central server, it is stored locally on the user's browser, which adds an extra layer of security.
 *
 * The encryption process uses the PBKDF2 and AES-GCM algorithms to secure the API key. The PBKDF2 algorithm is used to derive a key from the password and the salt, while the AES-GCM algorithm is used to encrypt and decrypt the API key.
 *
 * By using the encryption algorithms, you ensure that the API key is stored in an encrypted format that is difficult to reverse. The password is used as the encryption key, so even if someone gains access to the encrypted data, they would still need the password to unlock it.
 *
 * This solution also reduces the cost of maintaining a backend server because the authentication is handled by the API vendor. The encrypted API key is stored locally on the user's browser, so there is no need for a central server to handle the storage and retrieval of the API key.
 *
 * Overall, this is a secure solution for storing an API key in the browser that reduces the risk of a single point of attack and eliminates the need for a central server.
 *
 * --------------------
 *
 * However, this implementation is not perfect. There are several ways to improve the security of this implementation:
 *
 *     Use a stronger encryption algorithm: AES-GCM is a strong encryption algorithm, but there are stronger algorithms such as ChaCha20-Poly1305 that could be used instead.
 *
 *     Use a longer key length: The encryption key length is currently set to 16 bytes, but using a longer key length would increase the security of the encryption.
 *
 *     Increase the number of PBKDF2 iterations: The PBKDF2 algorithm uses 100,000 iterations to derive the encryption key from the password and salt. Increasing the number of iterations would increase the time and computational resources required to reverse the encryption, making the encryption more secure.
 *
 *     Use a server-side solution for key storage: While this implementation reduces the need for a central server, it is still susceptible to attacks on the client-side. By storing the encrypted API key on a secure server, you can add an extra layer of security to the solution.
 *
 *     Implement multi-factor authentication: Adding multi-factor authentication to the solution would increase the security of the encryption by requiring an additional factor (such as a one-time code) in addition to the password to unlock the API key.
 *
 * Overall, while the current implementation is secure, there are several ways to increase the security of the solution. The specific improvements that would be most appropriate would depend on the specific requirements and security needs of the application.
 *
 * --------------------
 *
 * There are several other ways to implement secure storage of API keys in the browser that are more secure than the implementation you've shown. One common approach is to use a browser extension that provides secure storage of sensitive data, such as password managers or encryption tools. This allows the keys to be stored in a dedicated, secure environment outside of the web page itself, reducing the risk of theft or exposure.
 *
 * Another option is to use a secure front-end framework, such as OpenSSL or NaCl, which provide cryptographic functions for encrypting and decrypting data within the browser. This approach can provide a high level of security, as long as the implementation is done correctly and the cryptographic primitives used are secure.
 *
 * Ultimately, the best approach will depend on the specific security requirements and threat model of your application, as well as factors such as the level of user trust and the level of technical expertise of your users.
 */