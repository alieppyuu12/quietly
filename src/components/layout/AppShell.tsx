'use client'

import { WorkspaceProvider } from '@/application/workspace/WorkspaceContext'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { AppContent } from './AppContent'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { SearchOverlay } from '@/components/search/SearchOverlay'

export function AppShell() {
  return (
    <WorkspaceProvider>
      <div className="app-shell">
        <Sidebar />

        {/* ===== MAIN AREA ===== */}
        <div className="app-content">


          <AppContent />
        </div>

        {/* ===== GLOBAL OVERLAYS ===== */}
        <SearchOverlay />
      </div>
    </WorkspaceProvider>
  )
}
