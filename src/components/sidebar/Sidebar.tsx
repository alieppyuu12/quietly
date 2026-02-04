"use client";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { useState, useMemo } from "react";
import { useWorkspace } from "@/application/workspace/WorkspaceContext";
import type { PageId } from "@/domain/entities/page";

export function Sidebar() {
  const {
    pages,
    state,
    openPage,
    goHome,
    createPage,
    createChildPage,
    openSearch,
    openTrash,
    openSettings,
    favoritePageIds,
    toggleFavorite,
    getRecentPages,
    deletePage,
    duplicatePage,
    trashedPages,
  } = useWorkspace();

  const [expanded, setExpanded] = useState<Set<PageId>>(new Set());
  const [contextMenu, setContextMenu] = useState<{
    pageId: PageId;
    x: number;
    y: number;
  } | null>(null);

  const recentPages = useMemo(() => getRecentPages(5), [getRecentPages]);
  const favoritePages = useMemo(
    () => pages.filter((p) => favoritePageIds.has(p.id)),
    [pages, favoritePageIds]
  );

  const toggleExpand = (id: PageId) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleContextMenu = (e: React.MouseEvent, pageId: PageId) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ pageId, x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleAction = (action: string, pageId: PageId) => {
    switch (action) {
      case "favorite":
        toggleFavorite(pageId);
        break;
      case "duplicate":
        duplicatePage(pageId);
        break;
      case "addChild":
        createChildPage(pageId);
        break;
      case "delete":
        if (confirm("Move this page to trash?")) {
          deletePage(pageId);
        }
        break;
    }
    closeContextMenu();
  };

  const renderTree = (parentId: PageId | null, level = 0) =>
    pages
      .filter((p) => (p.parentId ?? null) === parentId)
      .map((p) => {
        const hasChildren = pages.some((c) => c.parentId === p.id);
        const isExpanded = expanded.has(p.id);
        const isFavorite = favoritePageIds.has(p.id);
        const isActive =
          state.mode === "page" && state.page && state.page.id === p.id;

        return (
          <div key={p.id}>
            <div
              className={`sidebar-item ${isActive ? "active" : ""}`}
              style={{ paddingLeft: 8 + level * 16 }}
              onContextMenu={(e) => handleContextMenu(e, p.id)}
            >
              <span
                className="sidebar-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasChildren) toggleExpand(p.id);
                }}
                style={{
                  cursor: hasChildren ? "pointer" : "default",
                  opacity: hasChildren ? 1 : 0.3,
                }}
              >
                {hasChildren ? (isExpanded ? "▾" : "▸") : "•"}
              </span>

              <span
                className="sidebar-item-title"
                onClick={() => openPage(p.id)}
                style={{ cursor: "pointer", flex: 1 }}
              >
                {p.title}
              </span>

              {isFavorite && (
                <span className="sidebar-favorite" title="Favorited">
                  ⭐
                </span>
              )}
            </div>

            {hasChildren && isExpanded && (
              <div className="sidebar-tree">{renderTree(p.id, level + 1)}</div>
            )}
          </div>
        );
      });

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-header" onClick={goHome}>
          <span className="sidebar-logo">📝</span>
          <span>Quietly</span>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-item" onClick={openSearch}>
            <span className="sidebar-icon">🔍</span>
            <span>Search</span>
            <kbd className="sidebar-kbd">⌘K</kbd>
          </div>

          <div
            className={`sidebar-item ${state.mode === "home" ? "active" : ""}`}
            onClick={goHome}
          >
            <span className="sidebar-icon">🏠</span>
            <span>Home</span>
          </div>
        </div>

        {/* Favorites Section */}
        {favoritePages.length > 0 && (
          <div className="sidebar-section">
            <div className="sidebar-label">
              <span>⭐ Favorites</span>
            </div>
            {favoritePages.map((p) => {
              const isActive =
                state.mode === "page" && state.page && state.page.id === p.id;
              return (
                <div
                  key={p.id}
                  className={`sidebar-item ${isActive ? "active" : ""}`}
                  onClick={() => openPage(p.id)}
                  onContextMenu={(e) => handleContextMenu(e, p.id)}
                >
                  <span className="sidebar-icon">⭐</span>
                  <span>{p.title}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Recent Pages Section */}
        {recentPages.length > 0 && (
          <div className="sidebar-section">
            <div className="sidebar-label">
              <span>🕐 Recent</span>
            </div>
            {recentPages.slice(0, 5).map((p) => {
              const isActive =
                state.mode === "page" && state.page && state.page.id === p.id;
              return (
                <div
                  key={p.id}
                  className={`sidebar-item ${isActive ? "active" : ""}`}
                  onClick={() => openPage(p.id)}
                  onContextMenu={(e) => handleContextMenu(e, p.id)}
                >
                  <span className="sidebar-icon">📄</span>
                  <span>{p.title}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* All Pages Section */}
        <div className="sidebar-section sidebar-section-grow">
          <div className="sidebar-label">
            <span>📚 All Pages</span>
            <span className="sidebar-count">{pages.length}</span>
          </div>

          <div className="sidebar-tree">{renderTree(null)}</div>

          <div className="sidebar-item muted" onClick={createPage}>
            <span className="sidebar-icon">＋</span>
            <span>New Page</span>
          </div>
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <div
            className={`sidebar-item muted ${state.mode === "trash" ? "active" : ""}`}
            onClick={openTrash}
          >
            <span className="sidebar-icon">🗑️</span>
            <span>Trash</span>
            {trashedPages.length > 0 && (
              <span className="sidebar-badge">{trashedPages.length}</span>
            )}
          </div>

          <div
            className={`sidebar-item muted ${state.mode === "settings" ? "active" : ""}`}
            onClick={openSettings}
          >
            <span className="sidebar-icon">⚙️</span>
            <span>Settings</span>
          </div>

          <LogoutButton />
        </div>
      </aside>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div className="context-menu-overlay" onClick={closeContextMenu} />
          <div
            className="context-menu"
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
            }}
          >
            <button
              className="context-menu-item"
              onClick={() => handleAction("favorite", contextMenu.pageId)}
            >
              {favoritePageIds.has(contextMenu.pageId) ? (
                <>
                  <span>⭐</span> Remove from Favorites
                </>
              ) : (
                <>
                  <span>⭐</span> Add to Favorites
                </>
              )}
            </button>
            <button
              className="context-menu-item"
              onClick={() => handleAction("duplicate", contextMenu.pageId)}
            >
              <span>📋</span> Duplicate Page
            </button>
            <button
              className="context-menu-item"
              onClick={() => handleAction("addChild", contextMenu.pageId)}
            >
              <span>📄</span> Add Sub-page
            </button>
            <div className="context-menu-divider" />
            <button
              className="context-menu-item danger"
              onClick={() => handleAction("delete", contextMenu.pageId)}
            >
              <span>🗑️</span> Move to Trash
            </button>
          </div>
        </>
      )}

      <style jsx>{`
        .sidebar {
          width: 260px;
          background: var(--sidebar-bg, #f9fafb);
          border-right: 1px solid var(--border-color, #e5e7eb);
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
        }

        .sidebar-header {
          padding: 20px 16px;
          font-weight: 600;
          font-size: 18px;
          border-bottom: 1px solid var(--border-color, #e5e7eb);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s;
        }

        .sidebar-header:hover {
          background: var(--bg-hover, rgba(0, 0, 0, 0.03));
        }

        .sidebar-logo {
          font-size: 24px;
        }

        .sidebar-section {
          padding: 12px 8px;
          border-bottom: 1px solid var(--border-color, #e5e7eb);
        }

        .sidebar-section-grow {
          flex: 1;
          overflow-y: auto;
          border-bottom: none;
        }

        .sidebar-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary, #6b7280);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .sidebar-count {
          background: var(--bg-secondary, #e5e7eb);
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 11px;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          color: var(--text-primary, #1f2937);
          position: relative;
        }

        .sidebar-item:hover {
          background: var(--bg-hover, rgba(0, 0, 0, 0.05));
        }

        .sidebar-item.active {
          background: var(--primary-bg, #e0f2fe);
          color: var(--primary-color, #0369a1);
          font-weight: 500;
        }

        .sidebar-item.muted {
          color: var(--text-secondary, #6b7280);
        }

        .sidebar-icon {
          width: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 14px;
        }

        .sidebar-item-title {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-favorite {
          font-size: 12px;
          opacity: 0.7;
        }

        .sidebar-kbd {
          margin-left: auto;
          font-size: 11px;
          padding: 2px 6px;
          background: var(--bg-secondary, rgba(0, 0, 0, 0.05));
          border-radius: 4px;
          color: var(--text-secondary, #6b7280);
          font-family: monospace;
        }

        .sidebar-badge {
          margin-left: auto;
          background: var(--badge-bg, #ef4444);
          color: white;
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 10px;
          font-weight: 600;
        }

        .sidebar-tree {
          margin: 4px 0;
        }

        .sidebar-footer {
          padding: 8px;
          border-top: 1px solid var(--border-color, #e5e7eb);
        }

        .context-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 999;
        }

        .context-menu {
          position: fixed;
          background: var(--bg-primary, white);
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 4px;
          min-width: 200px;
          z-index: 1000;
        }

        .context-menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 8px 12px;
          border: none;
          background: none;
          text-align: left;
          font-size: 14px;
          color: var(--text-primary, #1f2937);
          cursor: pointer;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .context-menu-item:hover {
          background: var(--bg-hover, #f3f4f6);
        }

        .context-menu-item.danger {
          color: #dc2626;
        }

        .context-menu-item.danger:hover {
          background: #fef2f2;
        }

        .context-menu-item span {
          font-size: 16px;
        }

        .context-menu-divider {
          height: 1px;
          background: var(--border-color, #e5e7eb);
          margin: 4px 0;
        }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            left: -260px;
            z-index: 100;
            transition: left 0.3s;
          }

          .sidebar.open {
            left: 0;
          }
        }
      `}</style>
    </>
  );
}