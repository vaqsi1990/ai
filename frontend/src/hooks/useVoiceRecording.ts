import { useCallback, useEffect, useRef, useState } from 'react'

type SpeechRecognitionInstance = {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance

type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor
  webkitSpeechRecognition?: SpeechRecognitionConstructor
}

const ERROR_MESSAGES: Record<string, string> = {
  'not-allowed': 'Разрешите доступ к микрофону в настройках браузера',
  'no-speech': 'Речь не распознана. Попробуйте ещё раз',
  'audio-capture': 'Микрофон недоступен',
  network: 'Ошибка сети при распознавании речи',
  aborted: '',
}

function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] ?? 'Не удалось распознать речь'
}

type UseVoiceRecordingOptions = {
  /** Called with finalized speech segments (appended to the input field). */
  onTranscript: (text: string) => void
  lang?: string
}

/**
 * Web Speech API (SpeechRecognition) — speech-to-text in the browser.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
 */
export function useVoiceRecording({
  onTranscript,
  lang = 'ru-RU',
}: UseVoiceRecordingOptions) {
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const onTranscriptRef = useRef(onTranscript)
  const shouldListenRef = useRef(false)
  const interimRef = useRef('')

  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)

  onTranscriptRef.current = onTranscript

  const flushInterim = useCallback(() => {
    const pending = interimRef.current.trim()
    if (pending) {
      onTranscriptRef.current(pending)
    }
    interimRef.current = ''
    setInterimTranscript('')
  }, [])

  useEffect(() => {
    const win = window as SpeechRecognitionWindow
    const Recognition = win.SpeechRecognition ?? win.webkitSpeechRecognition

    if (!Recognition) {
      setIsSupported(false)
      return
    }

    const recognition = new Recognition()
    recognition.lang = lang
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcript = result[0]?.transcript ?? ''

        if (result.isFinal) {
          final += transcript
        } else {
          interim += transcript
        }
      }

      if (final.trim()) {
        onTranscriptRef.current(final.trim())
      }

      interimRef.current = interim
      setInterimTranscript(interim.trim())
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const message = getErrorMessage(event.error)
      if (message) {
        setError(message)
      }
      shouldListenRef.current = false
      interimRef.current = ''
      setInterimTranscript('')
      setIsListening(false)
    }

    recognition.onend = () => {
      interimRef.current = ''
      setInterimTranscript('')

      if (shouldListenRef.current) {
        try {
          recognition.start()
        } catch {
          shouldListenRef.current = false
          setIsListening(false)
        }
        return
      }

      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      shouldListenRef.current = false
      recognition.onresult = null
      recognition.onerror = null
      recognition.onend = null
      recognition.abort()
      recognitionRef.current = null
    }
  }, [lang])

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('Web Speech API не поддерживается. Используйте Chrome или Edge.')
      return
    }

    setError(null)
    interimRef.current = ''
    setInterimTranscript('')
    shouldListenRef.current = true

    try {
      recognitionRef.current.start()
      setIsListening(true)
    } catch {
      setError('Микрофон уже используется')
      shouldListenRef.current = false
    }
  }, [])

  const stopListening = useCallback(() => {
    shouldListenRef.current = false
    flushInterim()
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [flushInterim])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  const clearError = useCallback(() => setError(null), [])

  return {
    isListening,
    isSupported,
    interimTranscript,
    error,
    toggleListening,
    startListening,
    stopListening,
    clearError,
  }
}
