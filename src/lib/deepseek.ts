import axios from 'axios';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1';

export interface DeepSeekResponse {
  text: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class DeepSeekClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chat(prompt: string): Promise<DeepSeekResponse> {
    try {
      const response = await axios.post(
        `${DEEPSEEK_API_URL}/chat/completions`,
        {
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        text: response.data.choices[0].message.content,
        usage: response.data.usage,
      };
    } catch (error) {
      console.error('DeepSeek API Error:', error);
      throw new Error('Failed to get response from DeepSeek API');
    }
  }
}

let deepseekClient: DeepSeekClient | null = null;

export const initDeepSeek = () => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('Missing DeepSeek API key');
  }
  
  if (!deepseekClient) {
    deepseekClient = new DeepSeekClient(apiKey);
  }
  
  return deepseekClient;
};

export const getDeepSeek = () => {
  if (!deepseekClient) {
    return initDeepSeek();
  }
  return deepseekClient;
};