'use client'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { useState } from 'react'
import { useWorkspace } from '@/application/workspace/WorkspaceContext'
import type { PageId } from '@/domain/entities/page'

export function Sidebar() {
  const {
    pages,
    state,
    openPage,
    goHome,
    createPage,
    openSearch,
  } = useWorkspace()

  const [expanded, setExpanded] = useState<Set<PageId>>(new Set())

  const toggleExpand = (id: PageId) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const renderTree = (parentId: PageId | null, level = 0) =>
    pages
      .filter((p) => (p.parentId ?? null) === parentId)
      .map((p) => {
        const hasChildren = pages.some((c) => c.parentId === p.id)
        const isExpanded = expanded.has(p.id)

        const isActive =
          state.mode === 'page' && state.page.id === p.id

        return (
          <div key={p.id}>
            <div
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              style={{ paddingLeft: 8 + level * 12 }}
            >
              <span
                className="sidebar-icon"
                onClick={() => hasChildren && toggleExpand(p.id)}
                style={{
                  cursor: hasChildren ? 'pointer' : 'default',
                }}
              >
                {hasChildren ? (isExpanded ? '▾' : '▸') : '•'}
              </span>

              <span
                onClick={() => openPage(p.id)}
                style={{ cursor: 'pointer' }}
              >
                {p.title}
              </span>
            </div>

            {hasChildren && isExpanded && (
              <div className="sidebar-tree">
                {renderTree(p.id, level + 1)}
              </div>
            )}
          </div>
        )
      })

  return (
    <aside className="sidebar">
      <div className="sidebar-header">Quietly</div>

      <div className="sidebar-section">
        <div className="sidebar-item" onClick={openSearch}>
          <span className="sidebar-icon"></span>
          <span>Search</span>
        </div>

        <div
          className={`sidebar-item ${
            state.mode === 'home' ? 'active' : ''
          }`}
          onClick={goHome}
        >
          <span className="sidebar-icon"></span>
          <span>Home</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Pages</div>

        <div className="sidebar-tree">{renderTree(null)}</div>

        <div className="sidebar-item muted" onClick={createPage}>
          <span className="sidebar-icon">＋</span>
          <span>Add page</span>
        </div>
      </div>

<div className="sidebar-footer">
  <div className="sidebar-item muted">
    <span className="sidebar-icon">⚙</span>
    <span>Setting</span>
  </div>

  <LogoutButton />

  <div className="sidebar-item muted">
    <span className="sidebar-icon">🗑</span>
    <span>Trash</span>
  </div>
</div>

    </aside>
  )
}
