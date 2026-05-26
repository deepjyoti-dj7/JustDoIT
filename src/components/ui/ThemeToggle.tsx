import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
    >
      {theme === 'dark'
        ? <Sun className="h-4.5 w-4.5" />
        : <Moon className="h-4.5 w-4.5" />
      }
    </button>
  )
}
