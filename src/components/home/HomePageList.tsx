'use client'

import { useWorkspace } from '@/application/workspace/WorkspaceContext'

export function HomePageList() {
  const { pages, openPage } = useWorkspace()

  return (
    <div>
      <h3>Pages</h3>
      <ul>
        {pages.map((page) => (
          <li key={page.id}>
            <button onClick={() => openPage(page.id)}>
              {page.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
