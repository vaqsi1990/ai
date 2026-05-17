import { ChevronRight, Loader2, Mic } from 'lucide-react'

type ChatInputBarProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
  loading?: boolean
  isListening?: boolean
  isMicSupported?: boolean
  onMicClick?: () => void
  placeholder?: string
}

export function ChatInputBar({
  value,
  onChange,
  onSubmit,
  disabled = false,
  loading = false,
  isListening = false,
  isMicSupported = true,
  onMicClick,
  placeholder = 'Ask whatever you want',
}: ChatInputBarProps) {
  const canSend = value.trim().length > 0 && !disabled && !loading

  return (
    <div className="flex items-center gap-2 rounded-full border border-[#2a5a8a] bg-[#001528] px-3 py-2 shadow-lg shadow-black/20">
      {isMicSupported && (
        <button
          type="button"
          onClick={onMicClick}
          disabled={disabled}
          aria-label={isListening ? 'Stop recording' : 'Record voice'}
          aria-pressed={isListening}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition disabled:opacity-40 ${
            isListening
              ? 'text-red-400'
              : 'text-[#6b8fb0] hover:text-white'
          }`}
        >
          <Mic className="h-5 w-5" />
        </button>
      )}

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            if (canSend) onSubmit()
          }
        }}
        disabled={disabled || isListening}
        readOnly={isListening}
        placeholder={isListening ? 'Слушаю…' : placeholder}
        aria-label="Message"
        className="min-w-0 flex-1 bg-transparent text-[15px] text-white placeholder:text-[#5a7a9a] outline-none disabled:opacity-60"
      />

      <button
        type="submit"
        disabled={!canSend || isListening}
        aria-label="Send"
        onClick={(e) => {
          e.preventDefault()
          if (canSend) onSubmit()
        }}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2a6cb8] text-white transition hover:bg-[#3578c9] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
        )}
      </button>
    </div>
  )
}
