"use client";

import { useWorkspace } from "@/application/workspace/WorkspaceContext";
import { useState } from "react";
import type { PageId } from "@/domain/entities/page";

export function TrashView() {
  const { trashedPages, restorePage, permanentlyDeletePage, emptyTrash, closeTrash } =
    useWorkspace();
  
  const [selectedIds, setSelectedIds] = useState<Set<PageId>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPages = trashedPages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelect = (id: PageId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filteredPages.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredPages.map((p) => p.id)));
    }
  };

  const restoreSelected = () => {
    if (selectedIds.size === 0) return;
    
    if (confirm(`Restore ${selectedIds.size} item(s)?`)) {
      selectedIds.forEach((id) => restorePage(id));
      setSelectedIds(new Set());
    }
  };

  const deleteSelected = () => {
    if (selectedIds.size === 0) return;
    
    if (
      confirm(
        `Permanently delete ${selectedIds.size} item(s)? This cannot be undone.`
      )
    ) {
      selectedIds.forEach((id) => permanentlyDeletePage(id));
      setSelectedIds(new Set());
    }
  };

  const handleEmptyTrash = () => {
    if (trashedPages.length === 0) return;
    
    if (
      confirm(
        `Permanently delete all ${trashedPages.length} items in trash? This cannot be undone.`
      )
    ) {
      emptyTrash();
      setSelectedIds(new Set());
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <main className="page-root">
      <div className="page-container">
        <div className="page-title-row">
          <h1 className="page-title-static">🗑️ Trash</h1>
          {trashedPages.length > 0 && (
            <div className="trash-header-actions">
              <span className="trash-count">
                {trashedPages.length} item{trashedPages.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {trashedPages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🗑️</div>
            <h3>Trash is empty</h3>
            <p>Deleted pages will appear here</p>
          </div>
        ) : (
          <>
            {/* Search and Bulk Actions */}
            <div className="trash-controls">
              <input
                type="text"
                placeholder="Search trash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="trash-search"
              />
              
              <div className="bulk-actions">
                <button
                  className="subtle small"
                  onClick={selectAll}
                  title={selectedIds.size === filteredPages.length ? "Deselect all" : "Select all"}
                >
                  {selectedIds.size === filteredPages.length ? "Deselect All" : "Select All"}
                </button>
                
                {selectedIds.size > 0 && (
                  <>
                    <button
                      className="subtle small"
                      onClick={restoreSelected}
                      title={`Restore ${selectedIds.size} item(s)`}
                    >
                      ↩️ Restore ({selectedIds.size})
                    </button>
                    <button
                      className="subtle small danger"
                      onClick={deleteSelected}
                      title={`Delete ${selectedIds.size} item(s) permanently`}
                    >
                      🗑️ Delete ({selectedIds.size})
                    </button>
                  </>
                )}
                
                <button
                  className="subtle small danger"
                  onClick={handleEmptyTrash}
                  title="Empty trash"
                >
                  Empty Trash
                </button>
              </div>
            </div>

            {/* Trash List */}
            {filteredPages.length === 0 ? (
              <div className="empty-state">
                <p>No items match your search</p>
              </div>
            ) : (
              <div className="trash-list">
                {filteredPages.map((page) => {
                  const isSelected = selectedIds.has(page.id);
                  const hasChildren = trashedPages.some(p => p.parentId === page.id);
                  
                  return (
                    <div
                      key={page.id}
                      className={`trash-item ${isSelected ? "selected" : ""}`}
                    >
                      <div className="trash-item-header">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(page.id)}
                          className="trash-checkbox"
                        />
                        <div className="trash-item-info" onClick={() => toggleSelect(page.id)}>
                          <div className="trash-item-title">
                            <h3>{page.title}</h3>
                            {hasChildren && (
                              <span className="trash-badge" title="Has sub-pages">
                                📁 {trashedPages.filter(p => p.parentId === page.id).length}
                              </span>
                            )}
                          </div>
                          <p className="trash-item-preview">
                            {page.content.substring(0, 150)}
                            {page.content.length > 150 ? "..." : ""}
                          </p>
                          {page.updatedAt && (
                            <p className="trash-item-date">
                              Deleted {formatDate(page.updatedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="trash-item-actions">
                        <button
                          className="subtle small"
                          onClick={(e) => {
                            e.stopPropagation();
                            restorePage(page.id);
                          }}
                          title="Restore this page"
                        >
                          ↩️ Restore
                        </button>
                        <button
                          className="subtle small danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              confirm(
                                `Permanently delete "${page.title}"? This cannot be undone.`
                              )
                            ) {
                              permanentlyDeletePage(page.id);
                            }
                          }}
                          title="Delete permanently"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        <div className="page-actions">
          <button className="subtle" onClick={closeTrash}>
            ← Back
          </button>
        </div>
      </div>

      <style jsx>{`
        .trash-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .trash-count {
          font-size: 14px;
          color: var(--text-secondary, #666);
          padding: 4px 12px;
          background: var(--bg-secondary, #f5f5f5);
          border-radius: 12px;
        }

        .trash-controls {
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .trash-search {
          width: 100%;
          padding: 10px 16px;
          border: 1px solid var(--border-color, #ddd);
          border-radius: 8px;
          font-size: 15px;
          background: var(--bg-secondary, #fff);
          color: var(--text-primary, #000);
        }

        .trash-search:focus {
          outline: none;
          border-color: var(--primary-color, #007bff);
        }

        .bulk-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .bulk-actions button.small {
          font-size: 13px;
          padding: 6px 12px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-secondary, #666);
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-state h3 {
          font-size: 20px;
          margin-bottom: 8px;
          color: var(--text-primary, #000);
        }

        .empty-state p {
          font-size: 14px;
        }

        .trash-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .trash-item {
          border: 1px solid var(--border-color, #ddd);
          border-radius: 8px;
          padding: 16px;
          background: var(--bg-secondary, #fff);
          transition: all 0.2s;
        }

        .trash-item:hover {
          border-color: var(--border-hover, #bbb);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .trash-item.selected {
          border-color: var(--primary-color, #007bff);
          background: var(--bg-selected, #f0f7ff);
        }

        .trash-item-header {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }

        .trash-checkbox {
          margin-top: 4px;
          width: 18px;
          height: 18px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .trash-item-info {
          flex: 1;
          cursor: pointer;
        }

        .trash-item-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .trash-item-title h3 {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary, #000);
          margin: 0;
        }

        .trash-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          padding: 2px 8px;
          background: var(--bg-badge, #e3f2fd);
          color: var(--text-badge, #1976d2);
          border-radius: 10px;
          font-weight: 500;
        }

        .trash-item-preview {
          font-size: 14px;
          color: var(--text-secondary, #666);
          line-height: 1.5;
          margin-bottom: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .trash-item-date {
          font-size: 12px;
          color: var(--text-tertiary, #999);
        }

        .trash-item-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .trash-item-actions button {
          font-size: 13px;
          padding: 6px 12px;
        }

        .trash-item-actions button.danger {
          color: #d32f2f;
        }

        .trash-item-actions button.danger:hover {
          background: #fdecea;
        }

        @media (max-width: 768px) {
          .trash-controls {
            gap: 8px;
          }

          .bulk-actions {
            flex-direction: column;
          }

          .bulk-actions button {
            width: 100%;
          }

          .trash-item {
            padding: 12px;
          }

          .trash-item-actions {
            flex-direction: column;
          }

          .trash-item-actions button {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}