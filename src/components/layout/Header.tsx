import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Search, BookOpen } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { SearchDialog } from '@/components/ui/SearchDialog'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 h-14 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
        <div className="flex h-full items-center gap-4 px-4">
          {/* Mobile menu toggle */}
          <button
            onClick={onMenuClick}
            className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
            <BookOpen className="h-5 w-5 text-indigo-500" />
            <span>JustDoIT</span>
          </Link>

          <div className="flex-1" />

          {/* Search button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-700 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-300"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 sm:inline">
              ⌘K
            </kbd>
          </button>

          {/* GitHub */}
          <a
            href="https://github.com/deepjyoti-dj7/JustDoIT"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
            aria-label="GitHub"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>

          <ThemeToggle />
        </div>
      </header>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
