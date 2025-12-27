'use client'

import { useEffect, useState } from 'react'
import { useWorkspace } from '@/application/workspace/WorkspaceContext'
import { CreatePageInput } from './CreatePageInput'

export function CreatePageModal() {
  const {
    state,
    createPage,
    goHome,
  } = useWorkspace()

  const [title, setTitle] = useState('')

  useEffect(() => {
    if (state.mode !== 'create') return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') goHome()
      if (e.key === 'Enter') {
        createPage()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state, createPage, goHome])

  if (state.mode !== 'create') return null

  return (
    <div className="create-overlay">
      <div className="create-modal">
        <CreatePageInput
          value={title}
          onChange={setTitle}
          onSubmit={() => createPage()}
        />

        <div className="create-hint">
          Press <strong>Enter</strong> to create ·{' '}
          <strong>Esc</strong> to cancel
        </div>
      </div>
    </div>
  )
}
