import { cn } from '@/lib/cn'
import { initials } from '@/lib/format'

const SIZES = {
  sm: 'size-6 text-caption',
  md: 'size-8 text-caption',
  lg: 'size-10 text-body',
} as const

/* Sem foto, as iniciais assentam num fundo derivado do hash do nome — o
 * mesmo aluno recebe sempre a mesma cor, em todas as telas. */
const TONES = [
  'bg-purple-100 text-purple-800',
  'bg-orange-100 text-orange-800',
  'bg-gray-30 text-gray-80',
] as const

function toneOf(name: string): string {
  let h = 0
  for (let i = 0; i < name.length; i += 1) h = (h * 31 + name.charCodeAt(i)) % 997
  return TONES[h % TONES.length]
}

interface AvatarProps {
  name: string
  size?: keyof typeof SIZES
  className?: string
}

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-medium select-none',
        SIZES[size],
        toneOf(name),
        className,
      )}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}
