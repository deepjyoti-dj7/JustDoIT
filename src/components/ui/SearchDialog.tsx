import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, FileText } from 'lucide-react'
import { search } from '@/lib/search'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/lib/nav'

interface Props {
  open: boolean
  onClose: () => void
}

export function SearchDialog({ open, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<NavItem[]>([])
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // Open with Cmd+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); open ? onClose() : undefined }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      setQuery('')
      setResults([])
      setSelected(0)
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [open])

  useEffect(() => {
    setResults(search(query))
    setSelected(0)
  }, [query])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => Math.min(s + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)) }
    if (e.key === 'Enter' && results[selected]?.href) { navigate(results[selected].href!); onClose() }
    if (e.key === 'Escape') onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-20" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-zinc-200 px-4 dark:border-zinc-800">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Search pages..."
            className="flex-1 bg-transparent py-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none dark:text-zinc-100"
          />
          <kbd className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            ESC
          </kbd>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul className="max-h-80 overflow-y-auto py-2">
            {results.map((item, i) => (
              <li key={item.href}>
                <button
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors',
                    i === selected
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                      : 'text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900',
                  )}
                  onClick={() => { navigate(item.href!); onClose() }}
                  onMouseEnter={() => setSelected(i)}
                >
                  <FileText className="h-4 w-4 shrink-0 text-zinc-400" />
                  <span>{item.title}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {query && !results.length && (
          <p className="px-4 py-8 text-center text-sm text-zinc-400">No results for "{query}"</p>
        )}

        {!query && (
          <p className="px-4 py-6 text-center text-xs text-zinc-400">Type to search across all pages</p>
        )}
      </div>
    </div>
  )
}
