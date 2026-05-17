import { type FormEvent, useCallback, useMemo, useState } from 'react'
import { sendChat, toChatError } from '../api'
import { useVoiceRecording } from '../hooks'
import type { ChatEntry } from '../types/chat'
import { ChatHero } from './ChatHero'
import { ChatHistory } from './ChatHistory'
import { ChatInputBar } from './ChatInputBar'
import { ErrorAlert } from './ErrorAlert'

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

  const trimmed = inputValue.trim()
  const isLoading = history.some((entry) => entry.status === 'loading')

  async function submitMessage() {
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    submitMessage()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex min-h-svh flex-col bg-[#001a33] text-white"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 pb-4 pt-8 md:px-10">
        {history.length === 0 ? <ChatHero /> : null}
        <ChatHistory entries={history} />
      </div>

      <div className="sticky bottom-0 mx-auto w-full max-w-3xl px-5 pb-8 pt-2 md:px-10">
        <ChatInputBar
          value={inputValue}
          onChange={setText}
          onSubmit={submitMessage}
          disabled={isLoading}
          loading={isLoading}
          isListening={isListening}
          isMicSupported={isSupported}
          onMicClick={toggleListening}
          placeholder="Ask whatever you want"
        />

        {voiceError && (
          <div className="mt-3">
            <ErrorAlert message={voiceError} title="Voice input" />
          </div>
        )}
      </div>
    </form>
  )
}
