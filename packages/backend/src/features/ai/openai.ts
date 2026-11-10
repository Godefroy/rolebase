import OpenAI from 'openai'
import settings from '../../settings'

let client: OpenAI | undefined

// Created on first use: the SDK throws when the API key is missing, which
// would otherwise prevent the backend from starting without it
export function getOpenai(): OpenAI {
  if (!client) {
    client = new OpenAI({ apiKey: settings.openai.apiKey })
  }
  return client
}
