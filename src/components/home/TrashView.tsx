"use client";

import { useWorkspace } from "@/application/workspace/WorkspaceContext";

export function TrashView() {
  const { trashedPages, restorePage, permanentlyDeletePage, closeTrash } =
    useWorkspace();

  return (
    <main className="page-root">
      <div className="page-container">
        <div className="page-title-row">
          <h1 className="page-title-static"> Trash</h1>
        </div>

        {trashedPages.length === 0 ? (
          <div className="empty-state">
            <p>Trash is empty</p>
          </div>
        ) : (
          <div className="trash-list">
            {trashedPages.map((page) => (
              <div key={page.id} className="trash-item">
                <div className="trash-item-info">
                  <h3>{page.title}</h3>
                  <p className="trash-item-preview">
                    {page.content.substring(0, 100)}
                  </p>
                </div>
                <div className="trash-item-actions">
                  <button
                    className="subtle"
                    onClick={() => restorePage(page.id)}
                  >
                    Restore
                  </button>
                  <button
                    className="subtle danger"
                    onClick={() => {
                      if (
                        confirm(
                          `Permanently delete "${page.title}"? This cannot be undone.`,
                        )
                      ) {
                        permanentlyDeletePage(page.id);
                      }
                    }}
                  >
                    Delete permanently
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="page-actions">
          <button className="subtle" onClick={closeTrash}>
            Back
          </button>
        </div>
      </div>
    </main>
  );
}
