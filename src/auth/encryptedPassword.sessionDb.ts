const encryptedPasswordName = '06a24a4d-aa0d-4f61-8b19-f5d72ec877f2'

export function saveEncryptedPasswordToSession(encryptedPassword: string): void {
  sessionStorage.setItem(encryptedPasswordName, encryptedPassword)
}

export function fetchEncryptedPasswordFromSession(): string | null {
  return sessionStorage.getItem(encryptedPasswordName)
}

export function removeEncryptedPasswordFromSession(): void {
  sessionStorage.removeItem(encryptedPasswordName)
}