'use client'

import { useEffect, useState } from 'react'
import { useWorkspace } from '@/application/workspace/WorkspaceContext'
import { SearchInput } from './SearchInput'
import { SearchList } from './SearchList'

export function SearchOverlay() {
  const {
    state,
    pages,
    openPage,
    closeSearch,
  } = useWorkspace()

  const [query, setQuery] = useState('')

  // ESC untuk tutup
  useEffect(() => {
    if (state.mode !== 'search') return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch()
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state, closeSearch])

  if (state.mode !== 'search') return null

  const results = pages.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="search-overlay">
      <div className="search-modal">
        <SearchInput
          value={query}
          onChange={setQuery}
        />

        <SearchList
          pages={results}
          onSelect={(id) => {
            openPage(id)
            closeSearch()
          }}
        />
      </div>
    </div>
  )
}
