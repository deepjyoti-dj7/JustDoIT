import { Link } from 'react-router-dom'
import { ArrowRight, Layers, Database } from 'lucide-react'

const sections = [
  {
    icon: Layers,
    title: 'High Level Design',
    description: 'CAP theorem, distributed systems, networking, databases, caching, reliability, and real-world system design.',
    href: '/system-design/hld',
    accent: 'text-indigo-500 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
  },
  {
    icon: Database,
    title: 'Low Level Design',
    description: 'OOP, SOLID principles, UML diagrams, GoF design patterns, anti-patterns, and best practices.',
    href: '/system-design/lld',
    accent: 'text-emerald-500 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
  },
]

export function Hero() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-20 pt-16 xl:px-10">
      {/* Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Senior Engineer Study Hub
      </div>

      {/* Headline */}
      <h1 className="mb-4 text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-6xl">
        Just
        <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Do
        </span>
        IT
      </h1>
      <p className="mb-12 max-w-xl text-lg text-zinc-500 dark:text-zinc-400">
        Everything you need to master system design, databases, and distributed systems — in one place, no distractions.
      </p>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {sections.map(({ icon: Icon, title, description, href, accent, bg }) => (
          <Link
            key={href}
            to={href}
            className="group flex flex-col gap-4 rounded-xl border border-zinc-200 p-6 transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:hover:border-zinc-700"
          >
            <div className={`w-fit rounded-lg p-2.5 ${bg}`}>
              <Icon className={`h-5 w-5 ${accent}`} />
            </div>
            <div className="flex-1">
              <h2 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
              <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{description}</p>
            </div>
            <span className={`flex items-center gap-1 text-sm font-medium ${accent}`}>
              Explore <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-16 flex flex-wrap gap-8 border-t border-zinc-200 pt-8 dark:border-zinc-800">
        {[
          { value: '250+', label: 'Topics covered' },
          { value: '3', label: 'Major domains' },
          { value: '23', label: 'Design patterns' },
          { value: '∞', label: 'Interviews aced' },
        ].map(({ value, label }) => (
          <div key={label}>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{value}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
