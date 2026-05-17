import { AlertCircle } from 'lucide-react'

type ErrorAlertProps = {
  message: string
  title?: string
}

export function ErrorAlert({ message, title = 'Error' }: ErrorAlertProps) {
  return (
    <div
      className="flex gap-2 rounded-xl border border-red-500/30 bg-red-950/40 px-3 py-2 text-left"
      role="alert"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden />
      <div>
        <p className="text-xs font-medium text-red-300">{title}</p>
        <p className="text-sm text-red-200/90">{message}</p>
      </div>
    </div>
  )
}
