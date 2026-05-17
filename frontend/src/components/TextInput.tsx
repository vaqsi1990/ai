type TextInputProps = {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
  isRecording?: boolean
}

export function TextInput({
  value,
  onChange,
  disabled = false,
  placeholder = 'Введите сообщение...',
  isRecording = false,
}: TextInputProps) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      readOnly={isRecording}
      placeholder={placeholder}
      rows={4}
      aria-label="Сообщение"
      className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-[15px] leading-relaxed text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-[#0284c7] disabled:cursor-not-allowed disabled:opacity-60 ${
        isRecording ? 'border-red-200 ring-2 ring-red-100' : 'border-zinc-200'
      }`}
    />
  )
}
