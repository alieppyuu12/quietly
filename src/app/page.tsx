import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import { Navbar } from '@/components/marketing/Navbar'
import { Hero } from '@/components/marketing/Hero'
import { ValueGrid } from '@/components/marketing/ValueGrid'
import { FeatureCard } from '@/components/marketing/FeatureCard'
import { SupportingGrid } from '@/components/marketing/SupportingGrid'
import { Authority } from '@/components/marketing/Authority'
import { SkeletonGrid } from '@/components/marketing/SkeletonGrid'
import { FinalCTA } from '@/components/marketing/FinalCTA'
import { Footer } from '@/components/marketing/Footer'

export default async function Page() {
  const { userId } = await auth() // ⬅️ INI KUNCINYA

  if (userId) {
    redirect('/editor')
  }

  return (
    <>
      <Navbar />
      <main className="marketing">
        <Hero />
        <ValueGrid />
        <FeatureCard />
        <SupportingGrid />
        <Authority />
        <SkeletonGrid />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
