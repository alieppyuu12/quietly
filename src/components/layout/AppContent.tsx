'use client'

import { useWorkspace } from '@/application/workspace/WorkspaceContext'
import { HomeView } from '@/components/home/HomeView'
import { DatabaseView } from '@/components/page/DatabaseView'
import type { Page } from '@/domain/entities/page'

function getChildPages(pages: Page[], parentId: string) {
  return pages.filter((p) => p.parentId === parentId)
}

function buildBreadcrumb(pages: Page[], current: Page): Page[] {
  const map = new Map(pages.map((p) => [p.id, p]))
  const chain: Page[] = []

  let cursor: Page | undefined = current
  while (cursor) {
    chain.unshift(cursor)
    if (!cursor.parentId) break
    cursor = map.get(cursor.parentId)
  }

  return chain
}


export function AppContent() {
  const {
    state,
    pages,
    openPage,
    goHome,
    updatePageTitle,
    updatePageContent,
    createChildPage,
    favoritePageIds,
    toggleFavorite,
  } = useWorkspace()

  if (state.mode === 'home') {
    return <HomeView />
  }

  if (state.mode !== 'page') return null

  const page = state.page
  const breadcrumb = buildBreadcrumb(pages, page)
  const childPages = getChildPages(pages, page.id)
  const isFavorite = favoritePageIds.has(page.id)

  return (
    <main className="page-root">
      <div className="page-container">
        <nav className="breadcrumb">
          {breadcrumb.map((p, i) => (
            <span key={p.id}>
              <button onClick={() => openPage(p.id)}>
                {p.title}
              </button>
              {i < breadcrumb.length - 1 && ' ▸ '}
            </span>
          ))}
        </nav>

        <div className="page-title-row">
          <textarea
            className="page-title"
            value={page.title}
            onChange={(e) =>
              updatePageTitle(page.id, e.target.value)
            }
            placeholder="Untitled"
          />

          <button
            className="page-favorite"
            onClick={() => toggleFavorite(page.id)}
            aria-label="Toggle favorite"
          >
            {isFavorite ? '⭐️' : '☆'}
          </button>
        </div>

        {childPages.length > 0 ? (
          <DatabaseView
            rows={childPages}
            onOpenRow={openPage}
            onCreateRow={() => createChildPage(page.id)}
          />
        ) : (
          <>
            <textarea
              className="page-content"
              value={page.content}
              onChange={(e) =>
                updatePageContent(page.id, e.target.value)
              }
              placeholder="Start writing..."
            />

            <div className="page-actions">
              <button
                className="subtle"
                onClick={() => createChildPage(page.id)}
              >
                + Add a sub-page
              </button>
            </div>
          </>
        )}

        <div className="page-actions">
          <button className="subtle" onClick={goHome}>
            Back
          </button>
        </div>
      </div>
    </main>
  )
}
