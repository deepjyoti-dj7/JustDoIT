import { useState, Children, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const LANG_LABELS: Record<string, string> = {
  cpp: "C++",
  "c++": "C++",
  java: "Java",
  typescript: "TypeScript",
  ts: "TypeScript",
  python: "Python",
  py: "Python",
  go: "Go",
  javascript: "JavaScript",
  js: "JavaScript",
};

export function CodeTabs({
  languages,
  children,
}: {
  languages: string;
  children?: ReactNode;
}) {
  const langs = languages.split(",");
  const [active, setActive] = useState(0);
  const childArray = Children.toArray(children);

  return (
    <div className="code-tabs not-prose my-6">
      <div className="flex border-b border-zinc-200 bg-zinc-100 rounded-t-lg overflow-x-auto dark:border-zinc-800 dark:bg-zinc-900">
        {langs.map((lang, i) => (
          <button
            key={`${lang}-${i}`}
            onClick={() => setActive(i)}
            className={cn(
              "shrink-0 px-4 py-2 text-xs font-medium font-mono transition-colors border-b-2 -mb-px",
              active === i
                ? "text-indigo-600 border-indigo-500 bg-white/50 dark:text-indigo-400 dark:border-indigo-400 dark:bg-white/5"
                : "text-zinc-500 border-transparent hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200",
            )}
          >
            {LANG_LABELS[lang] ?? lang}
          </button>
        ))}
      </div>
      <div className="code-tabs-panels">
        {childArray.map((child, i) => (
          <div key={i} className={active === i ? "block" : "hidden"}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
