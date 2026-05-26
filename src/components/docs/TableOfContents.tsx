import { useEffect, useState, type RefObject } from 'react'
import { cn } from '@/lib/utils'

interface TocItem {
  id: string
  text: string
  level: number
}

interface Props {
  contentRef: RefObject<HTMLDivElement | null>
}

export function TableOfContents({ contentRef }: Props) {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState('')

  // Extract headings after content renders
  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    const headings = Array.from(el.querySelectorAll<HTMLElement>('h2, h3'))
    setItems(
      headings.map((h) => ({
        id: h.id,
        text: h.textContent?.replace(/#$/, '').trim() ?? '',
        level: parseInt(h.tagName[1]),
      })),
    )
  }, [contentRef])

  // Highlight active heading on scroll
  useEffect(() => {
    if (!items.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) { setActiveId(entry.target.id); break }
        }
      },
      { rootMargin: '-80px 0px -60% 0px' },
    )
    items.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [items])

  if (!items.length) return null

  return (
    <div className="sticky top-20">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        On this page
      </p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: item.level === 3 ? '0.75rem' : undefined }}>
            <a
              href={`#${item.id}`}
              className={cn(
                'block truncate text-sm transition-colors',
                activeId === item.id
                  ? 'font-medium text-indigo-600 dark:text-indigo-400'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200',
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
