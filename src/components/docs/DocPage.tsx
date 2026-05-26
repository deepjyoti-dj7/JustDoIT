import { useEffect, useRef, useState, type ComponentType } from 'react'
import { useLocation } from 'react-router-dom'
import mermaid from 'mermaid'
import { loadDoc } from '@/lib/mdx'
import { flattenNav, findBreadcrumbs, navigation } from '@/lib/nav'
import { mdxComponents } from '@/mdx-components'
import { Breadcrumbs } from './Breadcrumbs'
import { TableOfContents } from './TableOfContents'
import { PageNav } from './PageNav'

mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' })

export function DocPage() {
  const { pathname } = useLocation()
  const [DocComponent, setDocComponent] = useState<ComponentType<{ components?: Record<string, ComponentType> }> | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Re-render mermaid blocks after content loads
  useEffect(() => {
    if (!DocComponent || !contentRef.current) return
    const isDark = document.documentElement.classList.contains('dark')
    const blocks = contentRef.current.querySelectorAll<HTMLDivElement>('.mermaid-block')
    blocks.forEach(async (block, i) => {
      const raw = block.getAttribute('data-code')
      if (!raw) return
      const code = decodeURIComponent(raw)
      try {
        const id = `mermaid-${i}-${Date.now()}`
        await mermaid.initialize({ startOnLoad: false, securityLevel: 'loose', theme: isDark ? 'dark' : 'default' })
        const { svg } = await mermaid.render(id, code)
        block.innerHTML = svg
      } catch (e) {
        block.innerHTML = `<pre class="text-xs text-red-400 p-4">${code}</pre>`
      }
    })
  }, [DocComponent, pathname])

  // Load MDX module for current route
  useEffect(() => {
    setLoading(true)
    setDocComponent(null)
    setNotFound(false)

    loadDoc(pathname)
      .then((mod) => {
        if (!mod) { setNotFound(true); setLoading(false); return }
        setDocComponent(() => mod.default)
        setLoading(false)
        window.scrollTo(0, 0)
      })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [pathname])

  const breadcrumbs = findBreadcrumbs(pathname) ?? []
  const pages = flattenNav(navigation)
  const currentIdx = pages.findIndex((p) => p.href === pathname)
  const prevPage = currentIdx > 0 ? pages[currentIdx - 1] : null
  const nextPage = currentIdx < pages.length - 1 ? pages[currentIdx + 1] : null

  if (loading) return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
    </div>
  )

  if (notFound) return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
      <div className="text-center">
        <p className="text-5xl font-bold text-zinc-200 dark:text-zinc-800">404</p>
        <p className="mt-3 text-zinc-500">Page not found.</p>
      </div>
    </div>
  )

  return (
    <div className="mx-auto flex max-w-screen-xl gap-8 px-6 py-8 xl:px-10">
      {/* Article */}
      <article className="min-w-0 flex-1">
        {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}

        <div ref={contentRef} className="prose prose-zinc max-w-none dark:prose-invert">
          {DocComponent && <DocComponent components={mdxComponents as Record<string, ComponentType>} />}
        </div>

        <PageNav prev={prevPage ?? undefined} next={nextPage ?? undefined} />
      </article>

      {/* Table of contents (right) */}
      <aside className="hidden w-56 shrink-0 xl:block">
        <TableOfContents contentRef={contentRef} key={pathname} />
      </aside>
    </div>
  )
}
