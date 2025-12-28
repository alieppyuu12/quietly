'use client'

import { SignOutButton } from '@clerk/nextjs'

export function LogoutButton() {
  return (
    <SignOutButton redirectUrl="/">
      <div className="sidebar-item muted" style={{ cursor: 'pointer' }}>
        <span className="sidebar-icon">⎋</span>
        <span>Sign out</span>
      </div>
    </SignOutButton>
  )
}
