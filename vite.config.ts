import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { visit } from "unist-util-visit";

// Remark plugin: group consecutive fenced code blocks into <CodeTabs>
function remarkCodeTabs() {
  return (tree: any) => {
    const processChildren = (parent: any) => {
      if (!parent.children) return;
      const out: any[] = [];
      let i = 0;
      while (i < parent.children.length) {
        const child = parent.children[i];
        if (child.type === "code" && child.lang) {
          let j = i + 1;
          while (
            j < parent.children.length &&
            parent.children[j].type === "code" &&
            parent.children[j].lang
          ) {
            j++;
          }
          if (j - i > 1) {
            const blocks = parent.children.slice(i, j);
            const langs = blocks.map((b: any) => b.lang).join(",");
            out.push({
              type: "mdxJsxFlowElement",
              name: "CodeTabs",
              attributes: [
                { type: "mdxJsxAttribute", name: "languages", value: langs },
              ],
              children: blocks,
              data: { _mdxExplicitJsx: true },
            });
            i = j;
          } else {
            out.push(child);
            i++;
          }
        } else {
          out.push(child);
          i++;
        }
      }
      parent.children = out;
    };
    processChildren(tree);
  };
}

// Remark plugin: transform ```mermaid blocks to a JSX <div data-mermaid="...">
function remarkMermaid() {
  return (tree: any) => {
    visit(tree, "code", (node: any, index: number | undefined, parent: any) => {
      if (node.lang === "mermaid" && parent && typeof index === "number") {
        parent.children[index] = {
          type: "mdxJsxFlowElement",
          name: "div",
          attributes: [
            {
              type: "mdxJsxAttribute",
              name: "className",
              value: "mermaid-block",
            },
            {
              type: "mdxJsxAttribute",
              name: "data-code",
              value: encodeURIComponent(node.value),
            },
          ],
          children: [],
          data: { _mdxExplicitJsx: true },
        };
      }
    });
  };
}

export default defineConfig({
  base: "/JustDoIT/",

  plugins: [
    {
      enforce: "pre",
      ...mdx({
        include: /\.(md|mdx)$/,
        remarkPlugins: [
          remarkGfm,
          remarkFrontmatter,
          remarkMdxFrontmatter,
          remarkMermaid,
          remarkCodeTabs,
        ],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            { behavior: "wrap", properties: { className: ["anchor"] } },
          ],
          [
            rehypePrettyCode,
            {
              themes: { dark: "github-dark-dimmed", light: "github-light" },
              keepBackground: false,
            },
          ],
        ],
      }),
    },
    react(),
  ],

  resolve: {
    alias: { "@": "/src" },
  },
});
