import type { ComponentType } from 'react'

type MDXModule = {
  default: ComponentType<{ components?: Record<string, ComponentType> }>
  frontmatter?: Record<string, unknown>
}

// Lazy-load every .md file under /docs at build time (code-split per page)
const modules = import.meta.glob<MDXModule>('/docs/**/*.md')

function routeToKey(route: string): string | undefined {
  // Direct file: /system-design/hld/cap-theorem → /docs/system-design/hld/cap-theorem.md
  let key = `/docs${route}.md`
  if (key in modules) return key

  // Section index: /system-design → /docs/system-design/index.md
  key = `/docs${route}/index.md`
  if (key in modules) return key

  return undefined
}

export async function loadDoc(route: string): Promise<MDXModule | null> {
  const key = routeToKey(route)
  if (!key) return null
  return modules[key]()
}

export function docExists(route: string): boolean {
  return routeToKey(route) !== undefined
}
