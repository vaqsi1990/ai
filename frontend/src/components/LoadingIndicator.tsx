import { Loader2 } from 'lucide-react'

type LoadingIndicatorProps = {
  label?: string
}

export function LoadingIndicator({
  label = 'Думаю…',
}: LoadingIndicatorProps) {
  return (
    <div
      className="flex items-center gap-2 text-sm text-[#8ba3bc]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#3d7dd6]" aria-hidden />
      <span>{label}</span>
    </div>
  )
}
