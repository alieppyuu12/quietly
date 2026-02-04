"use client";

import { useWorkspace } from "@/application/workspace/WorkspaceContext";
import { useState } from "react";

export function SettingsView() {
  const { closeSettings, settings, updateSettings, emptyTrash, trashedPages } = useWorkspace();
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  const handleExportData = () => {
    try {
      const data = {
        pages: localStorage.getItem("quietly-pages"),
        trashed: localStorage.getItem("quietly-trashed"),
        favorites: localStorage.getItem("quietly-favorites"),
        settings: localStorage.getItem("quietly-settings"),
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `quietly-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setShowExportDialog(false);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export data. Please try again.");
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.pages) localStorage.setItem("quietly-pages", data.pages);
        if (data.trashed) localStorage.setItem("quietly-trashed", data.trashed);
        if (data.favorites) localStorage.setItem("quietly-favorites", data.favorites);
        if (data.settings) localStorage.setItem("quietly-settings", data.settings);

        alert("Data imported successfully! Please refresh the page.");
        setShowImportDialog(false);
      } catch (error) {
        console.error("Import failed:", error);
        alert("Failed to import data. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  const handleEmptyTrash = () => {
    if (trashedPages.length === 0) {
      alert("Trash is already empty.");
      return;
    }

    if (
      confirm(
        `Permanently delete all ${trashedPages.length} items in trash? This cannot be undone.`
      )
    ) {
      emptyTrash();
    }
  };

  const handleClearAllData = () => {
    if (
      confirm(
        "⚠️ WARNING: This will delete ALL your notes and settings permanently. This cannot be undone.\n\nType 'DELETE' to confirm."
      )
    ) {
      const input = prompt("Type DELETE to confirm:");
      if (input === "DELETE") {
        localStorage.clear();
        alert("All data cleared. The page will now reload.");
        window.location.reload();
      }
    }
  };

  return (
    <main className="page-root">
      <div className="page-container">
        <div className="page-title-row">
          <h1 className="page-title-static">⚙️ Settings</h1>
        </div>

        {/* Appearance */}
        <div className="settings-section">
          <h2>Appearance</h2>
          <div className="settings-group">
            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => updateSettings({ darkMode: e.target.checked })}
              />
              <span>Dark Mode</span>
            </label>
            <p className="settings-description">
              Use dark theme for comfortable reading in low light
            </p>
          </div>
        </div>

        {/* Editor */}
        <div className="settings-section">
          <h2>Editor</h2>
          <div className="settings-group">
            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => updateSettings({ autoSave: e.target.checked })}
              />
              <span>Auto-save enabled</span>
            </label>
            <p className="settings-description">
              Automatically save changes as you type
            </p>
          </div>

          <div className="settings-group">
            <label className="settings-select">
              <span>Font Size</span>
              <select
                value={settings.fontSize}
                onChange={(e) =>
                  updateSettings({ fontSize: parseInt(e.target.value) })
                }
              >
                <option value="14">Small (14px)</option>
                <option value="16">Medium (16px)</option>
                <option value="18">Large (18px)</option>
                <option value="20">Extra Large (20px)</option>
                <option value="22">Huge (22px)</option>
              </select>
            </label>
          </div>

          <div className="settings-group">
            <label className="settings-select">
              <span>Default View</span>
              <select
                value={settings.defaultView}
                onChange={(e) =>
                  updateSettings({
                    defaultView: e.target.value as "home" | "lastOpened",
                  })
                }
              >
                <option value="home">Home</option>
                <option value="lastOpened">Last Opened Page</option>
              </select>
            </label>
            <p className="settings-description">
              Choose what to show when you open Quietly
            </p>
          </div>
        </div>

        {/* Data Management */}
        <div className="settings-section">
          <h2>Data Management</h2>
          
          <div className="settings-group">
            <button
              className="settings-button"
              onClick={() => setShowExportDialog(true)}
            >
              📥 Export Data
            </button>
            <p className="settings-description">
              Download all your notes as a backup file
            </p>
          </div>

          <div className="settings-group">
            <button
              className="settings-button"
              onClick={() => setShowImportDialog(true)}
            >
              📤 Import Data
            </button>
            <p className="settings-description">
              Restore notes from a backup file
            </p>
          </div>

          <div className="settings-group">
            <button
              className="settings-button danger"
              onClick={handleEmptyTrash}
            >
              🗑️ Empty Trash ({trashedPages.length})
            </button>
            <p className="settings-description">
              Permanently delete all items in trash
            </p>
          </div>

          <div className="settings-group">
            <button
              className="settings-button danger"
              onClick={handleClearAllData}
            >
              ⚠️ Clear All Data
            </button>
            <p className="settings-description">
              Delete everything and start fresh (cannot be undone)
            </p>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="settings-section">
          <h2>Keyboard Shortcuts</h2>
          <div className="shortcuts-list">
            <div className="shortcut-item">
              <kbd>Cmd/Ctrl</kbd> + <kbd>K</kbd>
              <span>Search</span>
            </div>
            <div className="shortcut-item">
              <kbd>Cmd/Ctrl</kbd> + <kbd>Z</kbd>
              <span>Undo</span>
            </div>
            <div className="shortcut-item">
              <kbd>Cmd/Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd>
              <span>Redo</span>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="settings-section">
          <h2>About</h2>
          <p>Quietly v2.0</p>
          <p className="settings-description">
            A minimal, distraction-free writing space.
          </p>
          <p className="settings-description" style={{ marginTop: "8px" }}>
            Made with ❤️ for focused writing
          </p>
        </div>

        <div className="page-actions">
          <button className="subtle" onClick={closeSettings}>
            ← Back
          </button>
        </div>
      </div>

      {/* Export Dialog */}
      {showExportDialog && (
        <div className="modal-overlay" onClick={() => setShowExportDialog(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Export Data</h3>
            <p>
              This will download all your notes, favorites, and settings as a
              JSON file that you can use to restore your data later.
            </p>
            <div className="modal-actions">
              <button className="subtle" onClick={() => setShowExportDialog(false)}>
                Cancel
              </button>
              <button onClick={handleExportData}>Download Backup</button>
            </div>
          </div>
        </div>
      )}

      {/* Import Dialog */}
      {showImportDialog && (
        <div className="modal-overlay" onClick={() => setShowImportDialog(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Import Data</h3>
            <p>
              Select a backup file to restore your notes. This will replace your
              current data.
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              style={{ marginTop: "16px" }}
            />
            <div className="modal-actions">
              <button className="subtle" onClick={() => setShowImportDialog(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .settings-section {
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border-color, #eee);
        }

        .settings-section:last-of-type {
          border-bottom: none;
        }

        .settings-section h2 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--text-primary, #000);
        }

        .settings-group {
          margin-bottom: 20px;
        }

        .settings-group:last-child {
          margin-bottom: 0;
        }

        .settings-checkbox {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          font-size: 15px;
          color: var(--text-primary, #000);
        }

        .settings-checkbox input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .settings-select {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .settings-select span {
          font-size: 15px;
          font-weight: 500;
          color: var(--text-primary, #000);
        }

        .settings-select select {
          padding: 8px 12px;
          border: 1px solid var(--border-color, #ddd);
          border-radius: 6px;
          background: var(--bg-secondary, #fff);
          color: var(--text-primary, #000);
          font-size: 14px;
          cursor: pointer;
          max-width: 200px;
        }

        .settings-description {
          margin-top: 6px;
          font-size: 13px;
          color: var(--text-secondary, #666);
          line-height: 1.4;
        }

        .settings-button {
          padding: 10px 16px;
          border: 1px solid var(--border-color, #ddd);
          border-radius: 6px;
          background: var(--bg-secondary, #fff);
          color: var(--text-primary, #000);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .settings-button:hover {
          background: var(--bg-hover, #f5f5f5);
        }

        .settings-button.danger {
          color: #d32f2f;
          border-color: #d32f2f;
        }

        .settings-button.danger:hover {
          background: #fdecea;
        }

        .shortcuts-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .shortcut-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--text-secondary, #666);
        }

        .shortcut-item kbd {
          padding: 4px 8px;
          background: var(--bg-secondary, #f5f5f5);
          border: 1px solid var(--border-color, #ddd);
          border-radius: 4px;
          font-size: 12px;
          font-family: monospace;
          color: var(--text-primary, #000);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: var(--bg-primary, #fff);
          padding: 24px;
          border-radius: 12px;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .modal-content h3 {
          margin-bottom: 12px;
          font-size: 20px;
          color: var(--text-primary, #000);
        }

        .modal-content p {
          margin-bottom: 16px;
          color: var(--text-secondary, #666);
          line-height: 1.5;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .modal-actions button {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .modal-actions button.subtle {
          background: transparent;
          color: var(--text-secondary, #666);
        }

        .modal-actions button.subtle:hover {
          background: var(--bg-hover, #f5f5f5);
        }

        .modal-actions button:not(.subtle) {
          background: var(--primary-color, #007bff);
          color: white;
        }

        .modal-actions button:not(.subtle):hover {
          opacity: 0.9;
        }
      `}</style>
    </main>
  );
}