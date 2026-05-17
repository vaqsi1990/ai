import { BrandMark } from './BrandMark'

export function ChatHero() {
  return (
    <header className="mb-10 pt-4">
      <BrandMark size="lg" className="mb-8" />
      <p className="text-lg text-white/90">Hi there!</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
        What would you like to know?
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-[#8ba3bc]">
        Use one of the most common prompts below or ask your own question
      </p>
    </header>
  )
}
