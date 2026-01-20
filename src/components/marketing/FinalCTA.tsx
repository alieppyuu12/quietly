import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="final-cta">
      <Link href="/sign-up">
        <button className="btn-primary">Get Quietly</button>
      </Link>
      <button className="btn-secondary">Request a demo</button>
    </section>
  );
}
