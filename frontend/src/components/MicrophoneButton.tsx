import { Mic } from 'lucide-react'

type MicrophoneButtonProps = {
  isListening: boolean
  disabled?: boolean
  onClick: () => void
  title?: string
}

export function MicrophoneButton({
  isListening,
  disabled = false,
  onClick,
  title,
}: MicrophoneButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={isListening ? 'Остановить запись' : 'Записать голос'}
      aria-pressed={isListening}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition disabled:cursor-not-allowed disabled:opacity-50 ${
        isListening
          ? 'animate-pulse border-red-300 bg-red-50 text-red-600'
          : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
      }`}
    >
      <Mic className="h-5 w-5" aria-hidden />
    </button>
  )
}
