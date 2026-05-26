import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { navigation, type NavItem } from '@/lib/nav'
import { cn } from '@/lib/utils'

interface SidebarProps {
  onNavigate?: () => void
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const { pathname } = useLocation()

  return (
    <nav className="px-3 py-6 text-sm">
      {navigation.map((section) => (
        <SidebarSection
          key={section.title}
          item={section}
          currentPath={pathname}
          depth={0}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  )
}

interface SectionProps {
  item: NavItem
  currentPath: string
  depth: number
  onNavigate?: () => void
}

function SidebarSection({ item, currentPath, depth, onNavigate }: SectionProps) {
  const isActive = item.href ? currentPath === item.href || currentPath.startsWith(item.href + '/') : false
  const [open, setOpen] = useState(isActive || depth === 0)

  if (!item.children) {
    // Leaf node — clickable link
    return (
      <NavLink
        to={item.href!}
        onClick={onNavigate}
        className={({ isActive: a }) =>
          cn(
            'block truncate rounded-md px-2 py-1.5 transition-colors',
            depth === 0 ? 'font-medium' : 'font-normal',
            a
              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100',
          )
        }
        style={{ paddingLeft: `${0.5 + depth * 0.75}rem` }}
      >
        {item.title}
      </NavLink>
    )
  }

  // Section with children
  return (
    <div className={depth > 0 ? 'mt-1' : 'mb-4'}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left transition-colors',
          depth === 0
            ? 'text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500'
            : 'text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900',
          isActive && depth > 0 && 'text-zinc-900 dark:text-zinc-100',
        )}
        style={{ paddingLeft: depth > 0 ? `${0.5 + (depth - 1) * 0.75}rem` : undefined }}
      >
        <span className="truncate">{item.title}</span>
        {depth > 0 && (
          open
            ? <ChevronDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
            : <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
        )}
      </button>

      {open && (
        <div className={depth === 0 ? 'mt-1' : 'ml-2 mt-0.5 border-l border-zinc-200 dark:border-zinc-800 pl-2'}>
          {item.children.map((child) => (
            <SidebarSection
              key={child.href ?? child.title}
              item={child}
              currentPath={currentPath}
              depth={depth + 1}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  )
}
