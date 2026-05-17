import type { ChatEntry } from '../types/chat'
import { ErrorAlert } from './ErrorAlert'
import { LoadingIndicator } from './LoadingIndicator'

type ChatHistoryProps = {
  entries: ChatEntry[]
}

export function ChatHistory({ entries }: ChatHistoryProps) {
  if (entries.length === 0) return null

  return (
    <section
      className="flex max-h-96 flex-col gap-4 overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-left"
      aria-live="polite"
    >
      {entries.map((entry) => (
        <article
          key={entry.id}
          className="flex flex-col gap-3 border-b border-zinc-200 pb-4 last:border-0 last:pb-0"
        >
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
              Вы
            </p>
            <p className="text-sm text-zinc-900">{entry.question}</p>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
              AI
            </p>

            {entry.status === 'loading' && <LoadingIndicator label="Думаю…" />}

            {entry.status === 'error' && entry.error && (
              <ErrorAlert message={entry.error} title="Не удалось получить ответ" />
            )}

            {entry.status === 'success' && entry.reply && (
              <p className="whitespace-pre-wrap text-sm text-zinc-900">{entry.reply}</p>
            )}
          </div>
        </article>
      ))}
    </section>
  )
}
