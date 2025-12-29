'use client'

import { useWorkspace } from '@/application/workspace/WorkspaceContext'
import { HomeHeader } from './HomeHeader'
import { HomeGrid } from './HomeGrid'
import { HomeSkeleton } from './HomeSkeleton'

export function HomeView() {
  const { pages, openPage } = useWorkspace()

  const isLoading = false

  if (isLoading) {
    return <HomeSkeleton />
  }

  return (
    <main className="home">
      <HomeHeader />

      <section className="home-section">
        <h3 className="home-section-title">Pages</h3>

        <HomeGrid
          pages={pages.filter((p) => !p.parentId)}
          onOpen={openPage}
        />
      </section>
    </main>
  )
}
