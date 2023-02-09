export function apiKeyToSnippet(unencryptedApiKey: string): string {
  // first 3 characters, then 3 dots, then last 4 characters
  return `${unencryptedApiKey.slice(0, 3)}...${unencryptedApiKey.slice(-4)}`
}