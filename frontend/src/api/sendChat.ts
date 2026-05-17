import { ChatApiError, getErrorMessage, toChatError } from './chatErrors'

export type ChatResponse = {
  reply: string
}

type ErrorBody = {
  error?: string
}

const REQUEST_TIMEOUT_MS = 60_000

export async function sendChat(message: string): Promise<ChatResponse> {
  const trimmed = message.trim()

  if (!trimmed) {
    throw new ChatApiError('Введите сообщение перед отправкой.', 400)
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: trimmed }),
      signal: controller.signal,
    })

    let data: ChatResponse & ErrorBody = { reply: '' }

    try {
      data = await response.json()
    } catch {
      if (!response.ok) {
        throw new ChatApiError(
          getErrorMessage(response.status),
          response.status,
        )
      }
      throw new ChatApiError('Сервер вернул некорректный ответ.')
    }

    if (!response.ok) {
      throw new ChatApiError(
        getErrorMessage(response.status, data.error),
        response.status,
      )
    }

    if (!data.reply?.trim()) {
      throw new ChatApiError('Пустой ответ от AI. Попробуйте переформулировать вопрос.')
    }

    return { reply: data.reply }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ChatApiError('Превышено время ожидания ответа. Попробуйте снова.')
    }

    throw toChatError(error)
  } finally {
    clearTimeout(timeoutId)
  }
}
