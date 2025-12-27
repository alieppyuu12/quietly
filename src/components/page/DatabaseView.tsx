'use client'

import { useMemo, useState } from 'react'
import type { Page } from '@/domain/entities/page'

type SortOrder = 'asc' | 'desc'
type ViewMode = 'table' | 'board'

type Props = {
  rows: Page[]
  onOpenRow: (id: string) => void
  onCreateRow: () => void
}

function groupByFirstLetter(rows: Page[]) {
  const groups: Record<string, Page[]> = {}

  rows.forEach((r) => {
    const ch = (r.title?.[0] || '#').toUpperCase()
    const key =
      ch <= 'D' ? 'A–D'
      : ch <= 'H' ? 'E–H'
      : ch <= 'L' ? 'I–L'
      : ch <= 'P' ? 'M–P'
      : ch <= 'T' ? 'Q–T'
      : 'U–Z'

    groups[key] ??= []
    groups[key].push(r)
  })

  return groups
}

export function DatabaseView({
  rows,
  onOpenRow,
  onCreateRow,
}: Props) {
  const [view, setView] = useState<ViewMode>('table')
  const [filterText, setFilterText] = useState('')
  const [sortOrder, setSortOrder] =
    useState<SortOrder>('asc')

  const processedRows = useMemo(() => {
    let r = rows

    if (filterText.trim()) {
      const q = filterText.toLowerCase()
      r = r.filter((x) =>
        x.title.toLowerCase().includes(q)
      )
    }

    r = [...r].sort((a, b) => {
      if (a.title < b.title)
        return sortOrder === 'asc' ? -1 : 1
      if (a.title > b.title)
        return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return r
  }, [rows, filterText, sortOrder])

  const groups = useMemo(
    () => groupByFirstLetter(processedRows),
    [processedRows]
  )

  return (
    <section className="db">
      {/* Toolbar */}
      <div className="db-toolbar">
        <input
          placeholder="Filter title..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />

        <button
          onClick={() =>
            setSortOrder((o) =>
              o === 'asc' ? 'desc' : 'asc'
            )
          }
        >
          Sort {sortOrder === 'asc' ? 'A–Z' : 'Z–A'}
        </button>

        <button
          className={view === 'table' ? 'active' : ''}
          onClick={() => setView('table')}
        >
          Table
        </button>

        <button
          className={view === 'board' ? 'active' : ''}
          onClick={() => setView('board')}
        >
          Board
        </button>

        <button onClick={onCreateRow}>+ New Row</button>
      </div>

      {/* Table */}
      {view === 'table' && (
        <div className="db-table">
          {processedRows.map((row) => (
            <div
              key={row.id}
              className="db-row"
              onClick={() => onOpenRow(row.id)}
            >
              {row.title}
            </div>
          ))}

          {processedRows.length === 0 && (
            <div className="db-empty">No results</div>
          )}
        </div>
      )}

      {/* Board */}
      {view === 'board' && (
        <div className="db-board">
          {Object.entries(groups).map(([col, items]) => (
            <div key={col} className="db-column">
              <div className="db-column-title">
                {col}
              </div>

              {items.map((card) => (
                <div
                  key={card.id}
                  className="db-card"
                  onClick={() => onOpenRow(card.id)}
                >
                  {card.title}
                </div>
              ))}

              {items.length === 0 && (
                <div className="db-empty">
                  Empty
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
