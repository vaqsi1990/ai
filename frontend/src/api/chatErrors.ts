export class ChatApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ChatApiError'
    this.status = status
  }
}

const STATUS_MESSAGES: Record<number, string> = {
  400: 'Некорректный запрос. Проверьте текст сообщения.',
  401: 'Ошибка авторизации API. Проверьте ключ OpenAI на сервере.',
  403: 'Доступ к API запрещён.',
  429: 'Слишком много запросов. Подождите и попробуйте снова.',
  500: 'Ошибка сервера. Попробуйте позже.',
  502: 'Сервер недоступен. Убедитесь, что backend запущен.',
  503: 'Сервис OpenAI временно недоступен.',
}

export function getErrorMessage(status: number, serverMessage?: string): string {
  if (serverMessage?.trim()) {
    return serverMessage
  }
  return STATUS_MESSAGES[status] ?? `Ошибка запроса (${status})`
}

export function toChatError(error: unknown): ChatApiError {
  if (error instanceof ChatApiError) {
    return error
  }

  if (error instanceof TypeError) {
    return new ChatApiError(
      'Не удалось связаться с сервером. Запустите backend (npm run dev).',
    )
  }

  if (error instanceof Error) {
    return new ChatApiError(error.message)
  }

  return new ChatApiError('Неизвестная ошибка')
}
