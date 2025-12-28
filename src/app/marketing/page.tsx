import { Navbar } from '@/components/marketing/Navbar'
import { Hero } from '@/components/marketing/Hero'
import { ValueGrid } from '@/components/marketing/ValueGrid'
import { FeatureCard } from '@/components/marketing/FeatureCard'
import { SupportingGrid } from '@/components/marketing/SupportingGrid'
import { Authority } from '@/components/marketing/Authority'
import { SkeletonGrid } from '@/components/marketing/SkeletonGrid'
import { FinalCTA } from '@/components/marketing/FinalCTA'
import { Footer } from '@/components/marketing/Footer'

export default function MarketingPage() {
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
