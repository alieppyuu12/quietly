import Link from 'next/link'
export function Hero() {
  return (
    <section className="hero">
      <h1>Unload your thoughts</h1>
      <h2>Return with clarity</h2>

      <p>
        Quietly is a calm space for personal thinking.
        Unload your thoughts through free writing,
        gentle organization, and quiet reflection.
      </p>

      <div className="hero-cta">
        <Link href="/sign-up">
         <button>Get started</button>
        </Link>
        <button>Request a demo</button>
      </div>

      <small>Trusted by people who value clarity.</small>
      
    </section>
  )
}
