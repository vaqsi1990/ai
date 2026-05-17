import { type FormEvent, useCallback, useMemo, useState } from 'react'
import { sendChat, toChatError } from '../api'
import { useVoiceRecording } from '../hooks'
import type { ChatEntry, ChatMessage } from '../types/chat'
import { BrandMark } from './BrandMark'
import { ChatHero } from './ChatHero'
import { ChatHistory } from './ChatHistory'
import { ChatInputBar } from './ChatInputBar'
import { ClearChatButton } from './ClearChatButton'
import { ErrorAlert } from './ErrorAlert'

function createEntryId(): string {
  return crypto.randomUUID()
}

function buildApiHistory(entries: ChatEntry[]): ChatMessage[] {
  return entries
    .filter((entry) => entry.status === 'success' && entry.reply)
    .flatMap((entry) => [
      { role: 'user' as const, content: entry.question },
      { role: 'assistant' as const, content: entry.reply! },
    ])
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
    stopListening,
    clearError: clearVoiceError,
  } = useVoiceRecording({ onTranscript: appendTranscript, lang: 'ru-RU' })

  const inputValue = useMemo(() => {
    if (!isListening || !interimTranscript) return text
    return text ? `${text.trimEnd()} ${interimTranscript}` : interimTranscript
  }, [text, isListening, interimTranscript])

  const trimmed = inputValue.trim()
  const isLoading = history.some((entry) => entry.status === 'loading')

  const sendQuestion = useCallback(
    async (question: string, entryId: string, priorHistory: ChatEntry[]) => {
      try {
        const { reply } = await sendChat(question, buildApiHistory(priorHistory))
        setHistory((prev) =>
          prev.map((entry) =>
            entry.id === entryId
              ? { ...entry, reply, status: 'success' as const, error: null }
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
    },
    [],
  )

  async function submitMessage(messageText?: string) {
    const question = (messageText ?? trimmed).trim()
    if (!question || isLoading) return

    const entryId = createEntryId()
    const priorHistory = history.filter((e) => e.status === 'success')

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

    await sendQuestion(question, entryId, priorHistory)
  }

  function handleRetry(entryId: string) {
    const entry = history.find((e) => e.id === entryId)
    if (!entry || isLoading) return

    const priorHistory = history.filter(
      (e) => e.id !== entryId && e.status === 'success',
    )

    setHistory((prev) =>
      prev.map((e) =>
        e.id === entryId
          ? { ...e, status: 'loading' as const, error: null, reply: null }
          : e,
      ),
    )

    void sendQuestion(entry.question, entryId, priorHistory)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void submitMessage()
  }

  function handleClearChat() {
    if (isLoading) return

    if (isListening) {
      stopListening()
    }

    setHistory([])
    setText('')
    clearVoiceError()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex min-h-svh flex-col bg-[#001a33] text-white"
    >
      {history.length > 0 && (
        <header className="sticky top-0 z-20 shrink-0 border-b border-[#2a5a8a]/60 bg-[#001a33]/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4 md:px-10">
            <div className="flex items-center gap-3">
              <BrandMark size="md" />
              <p className="text-sm font-medium text-white">AI Chat</p>
            </div>
            <ClearChatButton onClick={handleClearChat} disabled={isLoading} />
          </div>
        </header>
      )}

      <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col px-5 pb-4 pt-6 md:px-10">
        {history.length === 0 && <ChatHero />}

        <ChatHistory entries={history} onRetry={handleRetry} />
      </div>

      <div className="sticky bottom-0 z-20 mx-auto w-full max-w-3xl shrink-0 bg-gradient-to-t from-[#001a33] via-[#001a33] to-transparent px-5 pb-8 pt-4 md:px-10">
        <ChatInputBar
          value={inputValue}
          onChange={setText}
          onSubmit={() => void submitMessage()}
          disabled={isLoading}
          loading={isLoading}
          isListening={isListening}
          isMicSupported={isSupported}
          onMicClick={toggleListening}
          placeholder="Спросите что угодно…"
        />

        {voiceError && (
          <div className="mt-3">
            <ErrorAlert message={voiceError} title="Голосовой ввод" />
            </div>
        )}
      </div>
    </form>
  )
}

