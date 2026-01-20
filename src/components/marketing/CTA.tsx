import Link from "next/link";

export function CTA() {
  return (
    <section className="cta">
      <Link href="/sign-up">
        <button className="btn-primary">Get started</button>
      </Link>
      <button className="btn-secondary">Request a demo</button>
    </section>
  );
}
