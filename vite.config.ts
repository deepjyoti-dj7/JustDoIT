import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import { visit } from 'unist-util-visit'

// Remark plugin: transform ```mermaid blocks to a JSX <div data-mermaid="...">
function remarkMermaid() {
  return (tree: any) => {
    visit(tree, 'code', (node: any, index: number | undefined, parent: any) => {
      if (node.lang === 'mermaid' && parent && typeof index === 'number') {
        parent.children[index] = {
          type: 'mdxJsxFlowElement',
          name: 'div',
          attributes: [
            {
              type: 'mdxJsxAttribute',
              name: 'className',
              value: 'mermaid-block',
            },
            {
              type: 'mdxJsxAttribute',
              name: 'data-code',
              value: encodeURIComponent(node.value),
            },
          ],
          children: [],
          data: { _mdxExplicitJsx: true },
        }
      }
    })
  }
}

export default defineConfig({
  base: '/JustDoIT/',

  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        include: /\.(md|mdx)$/,
        remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter, remarkMermaid],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap', properties: { className: ['anchor'] } }],
          [rehypePrettyCode, {
            themes: { dark: 'github-dark-dimmed', light: 'github-light' },
            keepBackground: false,
          }],
        ],
      }),
    },
    react(),
  ],

  resolve: {
    alias: { '@': '/src' },
  },
})
