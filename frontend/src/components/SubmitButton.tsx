import { Loader2, Send } from 'lucide-react'

type SubmitButtonProps = {
  disabled?: boolean
  loading?: boolean
}

export function SubmitButton({ disabled = false, loading = false }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      aria-label="Отправить"
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0284c7] text-white transition hover:bg-[#0284c7]/80 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
      ) : (
        <Send className="h-5 w-5" aria-hidden />
      )}
    </button>
  )
}
