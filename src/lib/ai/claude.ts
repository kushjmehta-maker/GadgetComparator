import { AzureOpenAI } from 'openai'

let _client: AzureOpenAI | null = null

function getClient(): AzureOpenAI {
  if (!_client) {
    _client = new AzureOpenAI({
      endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
      apiKey: process.env.AZURE_OPENAI_API_KEY!,
      apiVersion: process.env.AZURE_OPENAI_API_VERSION ?? '2025-01-01-preview',
    })
  }
  return _client
}

const MODEL = process.env.AZURE_OPENAI_DEPLOYMENT ?? 'gpt-5.4-pro'

export async function claudeJSON<T>(
  prompt: string,
  systemPrompt?: string,
): Promise<T> {
  const response = await getClient().chat.completions.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [
      {
        role: 'system',
        content:
          systemPrompt ??
          'You are a helpful AI assistant. Always respond with valid JSON only.',
      },
      { role: 'user', content: prompt },
    ],
  })

  const text = response.choices[0]?.message?.content ?? ''

  // Strip any markdown code fences if present
  const cleaned = text
    .replace(/^```(?:json)?\n?/m, '')
    .replace(/\n?```$/m, '')
    .trim()

  return JSON.parse(cleaned) as T
}

export async function claudeText(
  prompt: string,
  systemPrompt?: string,
): Promise<string> {
  const response = await getClient().chat.completions.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: 'system',
        content: systemPrompt ?? 'You are a helpful AI assistant.',
      },
      { role: 'user', content: prompt },
    ],
  })

  return response.choices[0]?.message?.content ?? ''
}

export { getClient as anthropic }
