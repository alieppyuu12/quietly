import type { Page, PageId } from '@/domain/entities/page'

export function SearchList({
  pages,
  onSelect,
}: {
  pages: Page[]
  onSelect: (id: PageId) => void
}) {
  if (pages.length === 0) {
    return (
      <div className="search-empty">
        No results
      </div>
    )
  }

  return (
    <div className="search-list">
      {pages.map((p) => (
        <div
          key={p.id}
          className="search-item"
          onClick={() => onSelect(p.id)}
        >
          {p.title}
        </div>
      ))}
    </div>
  )
}
