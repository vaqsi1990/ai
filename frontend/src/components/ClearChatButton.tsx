import { Trash2 } from 'lucide-react'

type ClearChatButtonProps = {
  onClick: () => void
  disabled?: boolean
}

export function ClearChatButton({ onClick, disabled = false }: ClearChatButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Очистить чат"
      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#4a8fd4] bg-[#0d3a6b] px-4 py-2 text-sm font-medium text-white shadow-md shadow-black/25 transition hover:border-[#6ba8e8] hover:bg-[#1a5a9e] disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Trash2 className="h-4 w-4" aria-hidden />
      Очистить чат
    </button>
  )
}
