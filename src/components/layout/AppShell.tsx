'use client'

import { Sidebar } from '@/components/sidebar/Sidebar'
import { AppContent } from './AppContent'
import { WorkspaceProvider } from '@/application/workspace/WorkspaceContext'
import { SearchOverlay } from '@/components/search/SearchOverlay'

export function AppShell() {
  return (
    <WorkspaceProvider>
      <div className="app-shell">
        <Sidebar />
        <div className="app-content">
          <AppContent />
        </div>
      </div>
    </WorkspaceProvider>
  )
}



