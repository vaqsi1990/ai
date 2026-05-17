import { type FormEvent, useCallback, useMemo, useState } from 'react'
import { sendChat, toChatError } from '../api'
import { useVoiceRecording } from '../hooks'
import type { ChatEntry } from '../types/chat'
import { ChatHistory } from './ChatHistory'
import { ErrorAlert } from './ErrorAlert'
import { MicrophoneButton } from './MicrophoneButton'
import { SubmitButton } from './SubmitButton'
import { TextInput } from './TextInput'

function createEntryId(): string {
  return crypto.randomUUID()
}

export function MessageForm() {
  const [text, setText] = useState('')
  const [history, setHistory] = useState<ChatEntry[]>([])

  const appendTranscript = useCallback((transcript: string) => {
    setText((prev) => (prev ? `${prev.trimEnd()} ${transcript}` : transcript))
  }, [])

  const {
    isListening,
    isSupported,
    interimTranscript,
    error: voiceError,
    toggleListening,
    clearError: clearVoiceError,
  } = useVoiceRecording({ onTranscript: appendTranscript, lang: 'ru-RU' })

  const inputValue = useMemo(() => {
    if (!isListening || !interimTranscript) return text
    return text ? `${text.trimEnd()} ${interimTranscript}` : interimTranscript
  }, [text, isListening, interimTranscript])

  const trimmed = text.trim()
  const isLoading = history.some((entry) => entry.status === 'loading')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!trimmed || isLoading) return

    const entryId = createEntryId()
    const question = trimmed

    setHistory((prev) => [
      ...prev,
      {
        id: entryId,
        question,
        reply: null,
        error: null,
        status: 'loading',
      },
    ])
    setText('')
    clearVoiceError()

    try {
      const { reply } = await sendChat(question)
      setHistory((prev) =>
        prev.map((entry) =>
          entry.id === entryId
            ? { ...entry, reply, status: 'success' as const }
            : entry,
        ),
      )
    } catch (error) {
      setHistory((prev) =>
        prev.map((entry) =>
          entry.id === entryId
            ? {
                ...entry,
                error: toChatError(error).message,
                status: 'error' as const,
              }
            : entry,
        ),
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <ChatHistory entries={history} />

      <TextInput
        value={inputValue}
        onChange={setText}
        disabled={isLoading || isListening}
        placeholder={
          isListening ? 'Говорите…' : 'Введите текст или нажмите микрофон...'
        }
        isRecording={isListening}
      />

      <div className="flex items-center justify-end gap-2">
        <MicrophoneButton
          isListening={isListening}
          disabled={isLoading || !isSupported}
          onClick={toggleListening}
          title={
            isSupported
              ? isListening
                ? 'Остановить запись'
                : 'Записать голос (Web Speech API)'
              : 'Голосовой ввод доступен в Chrome и Edge'
          }
        />
        <SubmitButton disabled={!trimmed || isListening} loading={isLoading} />
      </div>

      {!isSupported && (
        <p className="text-xs text-zinc-500">
          Голосовой ввод через Web Speech API доступен в Chrome и Edge.
        </p>
      )}

      {voiceError && <ErrorAlert message={voiceError} title="Голосовой ввод" />}
    </form>
  )
}
