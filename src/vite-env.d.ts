/// <reference types="vite/client" />

declare module '*.md' {
  import type { ComponentType } from 'react'
  const component: ComponentType<{ components?: Record<string, ComponentType> }>
  export const frontmatter: Record<string, unknown>
  export default component
}

declare module '*.mdx' {
  import type { ComponentType } from 'react'
  const component: ComponentType<{ components?: Record<string, ComponentType> }>
  export const frontmatter: Record<string, unknown>
  export default component
}
