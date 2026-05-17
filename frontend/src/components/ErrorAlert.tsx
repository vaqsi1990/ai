import { AlertCircle } from 'lucide-react'

type ErrorAlertProps = {
  message: string
  title?: string
}

export function ErrorAlert({ message, title = 'Ошибка' }: ErrorAlertProps) {
  return (
    <div
      className="flex gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-left"
      role="alert"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden />
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-red-700">{title}</p>
        <p className="text-sm text-red-600">{message}</p>
      </div>
    </div>
  )
}
