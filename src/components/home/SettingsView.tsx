"use client";

import { useWorkspace } from "@/application/workspace/WorkspaceContext";

export function SettingsView() {
  const { closeSettings } = useWorkspace();

  return (
    <main className="page-root">
      <div className="page-container">
        <div className="page-title-row">
          <h1 className="page-title-static">⚙️ Settings</h1>
        </div>

        <div className="settings-section">
          <h2>Appearance</h2>
          <div className="settings-group">
            <label>
              <input type="checkbox" defaultChecked={true} />
              Dark Mode
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h2>Editor</h2>
          <div className="settings-group">
            <label>
              <input type="checkbox" defaultChecked={true} />
              Auto-save enabled
            </label>
          </div>
          <div className="settings-group">
            <label>
              Font Size:
              <select defaultValue="16">
                <option value="14">Small (14px)</option>
                <option value="16">Medium (16px)</option>
                <option value="18">Large (18px)</option>
                <option value="20">Extra Large (20px)</option>
              </select>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h2>About</h2>
          <p>Quietly v1.0</p>
          <p className="settings-description">
            A minimal, distraction-free writing space.
          </p>
        </div>

        <div className="page-actions">
          <button className="subtle" onClick={closeSettings}>
            Back
          </button>
        </div>
      </div>
    </main>
  );
}
