import { useState, type ComponentType, type ReactNode } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Code block with copy button ───────────────────────────────────────────────
function Pre({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    const pre = document.createElement('pre')
    pre.innerHTML = (props as { 'data-raw-content'?: string })['data-raw-content'] ?? ''
    const text = pre.textContent ?? ''
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Alternatively, grab text from the rendered code element
  const copyFromDOM = (el: HTMLPreElement | null) => {
    if (!el) return
    const code = el.querySelector('code')
    const text = code?.textContent ?? ''
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="group relative">
      <pre {...props} ref={copyFromDOM as unknown as React.Ref<HTMLPreElement>}>{children}</pre>
      <button
        onClick={copy}
        className={cn(
          'absolute right-3 top-3 flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-all',
          'border border-zinc-700/50 bg-zinc-800 text-zinc-300 opacity-0 group-hover:opacity-100',
          'hover:bg-zinc-700',
        )}
        aria-label="Copy code"
      >
        {copied
          ? <><Check className="h-3 w-3 text-emerald-400" /> Copied</>
          : <><Copy className="h-3 w-3" /> Copy</>
        }
      </button>
    </div>
  )
}

// ── Callout / admonition ──────────────────────────────────────────────────────
function Blockquote({ children }: { children?: ReactNode }) {
  return (
    <blockquote className="my-4 rounded-r-lg border-l-4 border-indigo-400 bg-indigo-50/50 px-4 py-3 text-zinc-700 dark:border-indigo-500 dark:bg-indigo-950/30 dark:text-zinc-300 [&>p]:m-0">
      {children}
    </blockquote>
  )
}

// ── Table ─────────────────────────────────────────────────────────────────────
function Table({ children }: { children?: ReactNode }) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-sm">{children}</table>
    </div>
  )
}

function Th({ children }: { children?: ReactNode }) {
  return (
    <th className="border-b border-zinc-200 bg-zinc-50 px-4 py-2.5 text-left font-semibold text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
      {children}
    </th>
  )
}

function Td({ children }: { children?: ReactNode }) {
  return (
    <td className="border-b border-zinc-100 px-4 py-2.5 text-zinc-700 dark:border-zinc-900 dark:text-zinc-300 last:border-b-0">
      {children}
    </td>
  )
}

export const mdxComponents: Record<string, ComponentType<{ children?: ReactNode }>> = {
  pre: Pre as ComponentType<{ children?: ReactNode }>,
  blockquote: Blockquote,
  table: Table,
  th: Th,
  td: Td,
}
