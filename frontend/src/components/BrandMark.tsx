import { MessageSquare } from 'lucide-react'

type BrandMarkProps = {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: { box: 'h-8 w-8 rounded-lg', icon: 'h-4 w-4' },
  md: { box: 'h-11 w-11 rounded-xl', icon: 'h-5 w-5' },
  lg: { box: 'h-14 w-14 rounded-2xl', icon: 'h-7 w-7' },
}

export function BrandMark({ size = 'lg', className = '' }: BrandMarkProps) {
  const { box, icon } = sizes[size]

  return (
    <div
      className={`flex shrink-0 items-center justify-center bg-[#2a6cb8] shadow-sm shadow-black/20 ${box} ${className}`}
      aria-hidden
    >
      <MessageSquare
        className={`${icon} fill-white text-white`}
        strokeWidth={0}
      />
    </div>
  )
}
