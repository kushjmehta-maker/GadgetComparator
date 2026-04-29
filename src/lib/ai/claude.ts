import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function claudeJSON<T>(
  prompt: string,
  systemPrompt?: string,
): Promise<T> {
  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 2048,
    system:
      systemPrompt ??
      'You are a helpful AI assistant. Always respond with valid JSON only.',
    messages: [{ role: 'user', content: prompt }],
  })

  const text =
    response.content[0].type === 'text' ? response.content[0].text : ''

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
  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    system: systemPrompt ?? 'You are a helpful AI assistant.',
    messages: [{ role: 'user', content: prompt }],
  })

  return response.content[0].type === 'text' ? response.content[0].text : ''
}

export { client as anthropic }
