import { User } from 'lucide-react'
import type { ChatEntry } from '../types/chat'
import { BrandMark } from './BrandMark'
import { ErrorAlert } from './ErrorAlert'
import { LoadingIndicator } from './LoadingIndicator'

type ChatHistoryProps = {
  entries: ChatEntry[]
}

export function ChatHistory({ entries }: ChatHistoryProps) {
  if (entries.length === 0) return null

  return (
    <section
      className="flex flex-1 flex-col gap-6 overflow-y-auto pb-6"
      aria-live="polite"
    >
      {entries.map((entry) => (
        <article key={entry.id} className="flex flex-col gap-4">
          <div className="flex items-end justify-end gap-2">
            <div className="max-w-[85%] rounded-2xl rounded-br-md bg-[#1a4a7a]/70 px-4 py-3">
              <p className="text-sm leading-relaxed text-white">{entry.question}</p>
            </div>
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1e5a8f]/90"
              aria-hidden
            >
              <User className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <BrandMark size="sm" />
            <div className="min-w-0 flex-1 pt-0.5">
              {entry.status === 'loading' && (
                <LoadingIndicator label="Thinking…" />
              )}

              {entry.status === 'error' && entry.error && (
                <ErrorAlert message={entry.error} title="Error" />
              )}

              {entry.status === 'success' && entry.reply && (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#c8d9e8]">
                  {entry.reply}
                </p>
              )}
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}
