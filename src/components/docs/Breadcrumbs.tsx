import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { NavItem } from '@/lib/nav'

interface Props {
  items: NavItem[]
}

export function Breadcrumbs({ items }: Props) {
  // Exclude the current page (last item) from links
  const crumbs = items.slice(0, -1)
  const current = items[items.length - 1]

  if (items.length <= 1) return null

  return (
    <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
      {crumbs.map((item) => (
        <span key={item.title} className="flex items-center gap-1">
          {item.href
            ? <Link to={item.href} className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">{item.title}</Link>
            : <span>{item.title}</span>
          }
          <ChevronRight className="h-3 w-3 text-zinc-300 dark:text-zinc-700" />
        </span>
      ))}
      <span className="text-zinc-900 dark:text-zinc-100">{current.title}</span>
    </nav>
  )
}
