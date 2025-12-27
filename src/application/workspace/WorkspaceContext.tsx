'use client'

import { createContext, useContext, useState } from 'react'
import type { Page, PageId } from '@/domain/entities/page'

type WorkspaceState =
  | { mode: 'home' }
  | { mode: 'page'; page: Page }
  | { mode: 'search'; previous: WorkspaceState }
  | { mode: 'create' }

type WorkspaceContextValue = {
  state: WorkspaceState
  pages: Page[]

  openPage: (pageId: PageId) => void
  goHome: () => void

  openCreate: () => void
  createPage: () => void
  createChildPage: (parentId: PageId) => void

  updatePageTitle: (pageId: PageId, title: string) => void
  updatePageContent: (pageId: PageId, content: string) => void

  favoritePageIds: Set<PageId>
  toggleFavorite: (pageId: PageId) => void

  openSearch: () => void
  closeSearch: () => void
}

const WorkspaceContext =
  createContext<WorkspaceContextValue | null>(null)

function generatePageId(): PageId {
  return `page-${Date.now()}`
}

export function WorkspaceProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [pages, setPages] = useState<Page[]>([
    { id: 'page-1', title: 'Daily Notes', content: 'This is your daily notes.' },
    { id: 'page-2', title: 'Project Ideas', content: 'List your project ideas here.' },
    { id: 'page-3', title: 'Tasks', content: 'Track your tasks.' },
  ])

  const [state, setState] = useState<WorkspaceState>({
    mode: 'home',
  })

  const [favoritePageIds, setFavoritePageIds] = useState<Set<PageId>>(
    new Set()
  )

  /* navigation */

  const openPage = (pageId: PageId) => {
    const page = pages.find((p) => p.id === pageId)
    if (!page) return
    setState({ mode: 'page', page })
  }

  const goHome = () => {
    setState({ mode: 'home' })
  }

  /* create */

  const openCreate = () => {
    setState({ mode: 'create' })
  }

  const createPage = () => {
    const baseTitle = 'Untitled'
    const count = pages.filter(
      (p) =>
        p.title === baseTitle ||
        p.title.startsWith(`${baseTitle} (`)
    ).length

    const title =
      count === 0 ? baseTitle : `${baseTitle} (${count + 1})`

    const newPage: Page = {
      id: generatePageId(),
      title,
      content: '',
    }

    setPages((prev) => [...prev, newPage])
    setState({ mode: 'page', page: newPage })
  }

  const createChildPage = (parentId: PageId) => {
    const baseTitle = 'Untitled'
    const siblings = pages.filter((p) => p.parentId === parentId)

    const count = siblings.filter(
      (p) =>
        p.title === baseTitle ||
        p.title.startsWith(`${baseTitle} (`)
    ).length

    const title =
      count === 0 ? baseTitle : `${baseTitle} (${count + 1})`

    const newPage: Page = {
      id: generatePageId(),
      title,
      content: '',
      parentId,
    }

    setPages((prev) => [...prev, newPage])
    setState({ mode: 'page', page: newPage })
  }

  /* edit */

  const updatePageTitle = (pageId: PageId, title: string) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === pageId ? { ...p, title } : p
      )
    )

    setState((prev) =>
      prev.mode === 'page' && prev.page.id === pageId
        ? { mode: 'page', page: { ...prev.page, title } }
        : prev
    )
  }

  const updatePageContent = (pageId: PageId, content: string) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === pageId ? { ...p, content } : p
      )
    )

    setState((prev) =>
      prev.mode === 'page' && prev.page.id === pageId
        ? { mode: 'page', page: { ...prev.page, content } }
        : prev
    )
  }

  /* favorite */

  const toggleFavorite = (pageId: PageId) => {
    setFavoritePageIds((prev) => {
      const next = new Set(prev)
      next.has(pageId) ? next.delete(pageId) : next.add(pageId)
      return next
    })
  }

  /* search */

  const openSearch = () => {
    setState((prev) =>
      prev.mode === 'search'
        ? prev
        : { mode: 'search', previous: prev }
    )
  }

  const closeSearch = () => {
    setState((prev) =>
      prev.mode === 'search' ? prev.previous : prev
    )
  }

  return (
    <WorkspaceContext.Provider
      value={{
        state,
        pages,

        openPage,
        goHome,

        openCreate,
        createPage,
        createChildPage,

        updatePageTitle,
        updatePageContent,

        favoritePageIds,
        toggleFavorite,

        openSearch,
        closeSearch,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) {
    throw new Error('useWorkspace must be used within WorkspaceProvider')
  }
  return ctx
}
