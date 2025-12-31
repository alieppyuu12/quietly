import type { Page, PageId } from '@/domain/entities/page'

export function HomeGrid({
  pages,
  onOpen,
}: {
  pages: Page[]
  onOpen: (id: PageId) => void
}) {
  if (pages.length === 0) {
    return (
      <div className="home-empty">
        No pages yet. Create a new one.
      </div>
    )
  }

  return (
    <div className="home-grid">
      {pages.map((page) => (
        <div
          key={page.id}
          className="home-card"
          onClick={() => onOpen(page.id)}
        >
          <div className="home-card-title">
            {page.title}
          </div>
        </div>
      ))}
    </div>
  )
}
