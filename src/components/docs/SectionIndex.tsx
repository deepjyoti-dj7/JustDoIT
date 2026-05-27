import { Link, useLocation } from "react-router-dom";
import { navigation, type NavItem } from "@/lib/nav";

// ── Helpers ────────────────────────────────────────────────────────────────────

function findSection(items: NavItem[], targetHref: string): NavItem | null {
  for (const item of items) {
    if (item.href === targetHref) return item;
    if (item.children) {
      const found = findSection(item.children, targetHref);
      if (found) return found;
    }
  }
  return null;
}

function countLeaves(item: NavItem): number {
  if (!item.children || item.children.length === 0) return item.href ? 1 : 0;
  return item.children.reduce((sum, child) => sum + countLeaves(child), 0);
}

// ── Recursive topic link renderer ──────────────────────────────────────────────

function TopicLinks({ items, accent }: { items: NavItem[]; accent: string }) {
  return (
    <ul className="space-y-1">
      {items.map((item) => {
        if (item.href && (!item.children || item.children.length === 0)) {
          return (
            <li key={item.href}>
              <Link
                to={item.href}
                className={`text-sm transition-colors text-zinc-600 dark:text-zinc-400 hover:${accent} dark:hover:${accent}`}
              >
                {item.title}
              </Link>
            </li>
          );
        }
        // Group without a direct href (e.g. "Problems", "Easy", "Medium")
        return (
          <li key={item.title} className="pt-2">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              {item.title}
            </p>
            {item.children && (
              <TopicLinks items={item.children} accent={accent} />
            )}
          </li>
        );
      })}
    </ul>
  );
}

// ── Category card ──────────────────────────────────────────────────────────────

function CategoryCard({
  category,
  accent,
  border,
}: {
  category: NavItem;
  accent: string;
  border: string;
}) {
  const total = countLeaves(category);

  return (
    <div className={`flex flex-col gap-3 rounded-xl border p-5 ${border}`}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
          {category.title}
        </h3>
        <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          {total}
        </span>
      </div>
      {category.children && (
        <div className="max-h-72 overflow-y-auto pr-1">
          <TopicLinks items={category.children} accent={accent} />
        </div>
      )}
    </div>
  );
}

// ── Palette per section ────────────────────────────────────────────────────────

const palette: Record<
  string,
  { heading: string; badge: string; accent: string; border: string }
> = {
  hld: {
    heading: "text-indigo-500 dark:text-indigo-400",
    badge:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
    accent: "text-indigo-600 dark:text-indigo-400",
    border: "border-zinc-200 dark:border-zinc-800",
  },
  lld: {
    heading: "text-emerald-500 dark:text-emerald-400",
    badge:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    accent: "text-emerald-600 dark:text-emerald-400",
    border: "border-zinc-200 dark:border-zinc-800",
  },
  dsa: {
    heading: "text-violet-500 dark:text-violet-400",
    badge:
      "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
    accent: "text-violet-600 dark:text-violet-400",
    border: "border-zinc-200 dark:border-zinc-800",
  },
};

function getPalette(pathname: string) {
  if (pathname.includes("/lld")) return palette.lld;
  if (pathname.includes("/dsa")) return palette.dsa;
  return palette.hld;
}

// ── Main component ─────────────────────────────────────────────────────────────

export function SectionIndex() {
  const { pathname } = useLocation();
  const section = findSection(navigation, pathname);

  if (!section || !section.children) return null;

  const { heading, badge, accent, border } = getPalette(pathname);
  const totalTopics = section.children.reduce(
    (sum, cat) => sum + countLeaves(cat),
    0,
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 xl:px-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold tracking-tight ${heading}`}>
          {section.title}
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          <span
            className={`mr-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge}`}
          >
            {section.children.length} sections
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge}`}
          >
            {totalTopics} topics
          </span>
        </p>
      </div>

      {/* Grid of category cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {section.children.map((category) => (
          <CategoryCard
            key={category.title}
            category={category}
            accent={accent}
            border={border}
          />
        ))}
      </div>
    </div>
  );
}
