import { MessageForm } from '../components'

export function HomePage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-zinc-50 px-4 py-12">
      <section className="w-full max-w-5xl">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-[#0284c7]">
            Отправка сообщения
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Введите текст или запишите голосом
          </p>
        </header>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <MessageForm />
        </div>
      </section>
    </main>
  )
}
