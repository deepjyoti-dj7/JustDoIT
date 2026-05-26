import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { NavItem } from '@/lib/nav'

interface Props {
  prev?: NavItem
  next?: NavItem
}

export function PageNav({ prev, next }: Props) {
  if (!prev && !next) return null

  return (
    <nav className="mt-12 flex items-center justify-between border-t border-zinc-200 pt-8 dark:border-zinc-800">
      <div className="flex-1">
        {prev?.href && (
          <Link
            to={prev.href}
            className="group flex flex-col gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <span className="flex items-center gap-1 text-xs uppercase tracking-wide text-zinc-400 dark:text-zinc-600">
              <ChevronLeft className="h-3 w-3" /> Previous
            </span>
            <span className="font-medium text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-zinc-100">
              {prev.title}
            </span>
          </Link>
        )}
      </div>

      <div className="flex-1 text-right">
        {next?.href && (
          <Link
            to={next.href}
            className="group inline-flex flex-col gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <span className="flex items-center justify-end gap-1 text-xs uppercase tracking-wide text-zinc-400 dark:text-zinc-600">
              Next <ChevronRight className="h-3 w-3" />
            </span>
            <span className="font-medium text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-zinc-100">
              {next.title}
            </span>
          </Link>
        )}
      </div>
    </nav>
  )
}
