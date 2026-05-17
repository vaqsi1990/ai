export type ChatEntry = {
  id: string
  question: string
  reply: string | null
  error: string | null
  status: 'loading' | 'success' | 'error'
}
