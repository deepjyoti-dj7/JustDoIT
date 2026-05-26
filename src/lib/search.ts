import Fuse from 'fuse.js'
import { allNavItems, navigation, type NavItem } from './nav'

let fuse: Fuse<NavItem> | null = null

function getIndex(): Fuse<NavItem> {
  if (!fuse) {
    const items = allNavItems(navigation)
    fuse = new Fuse(items, {
      keys: ['title'],
      threshold: 0.35,
      minMatchCharLength: 2,
    })
  }
  return fuse
}

export function search(query: string): NavItem[] {
  if (!query.trim()) return []
  return getIndex()
    .search(query)
    .slice(0, 12)
    .map((r) => r.item)
}
