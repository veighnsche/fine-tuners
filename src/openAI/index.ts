import axios from 'axios'

export function useOpenAI() {
  return {
    async testApiKey(apiKey: string) {
      const response = await axios.get('https://api.openai.com/v1/models/text-davinci-003', {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        }
      })

      return response.status === 200
    }
  }
}